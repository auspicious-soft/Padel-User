import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { toast } from "sonner";

// Define prop types
interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (address: string, position: LatLng) => void;
  initialCenter?: LatLng;
}

interface LatLng {
  lat: number;
  lng: number;
}

const libraries: "places"[] = ["places"];

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  initialCenter,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<LatLng | null>(null);
  const [address, setAddress] = useState<string>("");
  const defaultSpainCenter: LatLng = { lat: 40.4168, lng: -3.7038 }; // Madrid, Spain
  const [mapCenter, setMapCenter] = useState<LatLng>(
    initialCenter || defaultSpainCenter
  );
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const allowedCountries = ["GB", "NL", "BE", "ES", "FR"];

  const grayStyle = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ saturation: -100 }, { lightness: 60 }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ color: "#999999" }, { weight: 1 }],
    },
  ];

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPosition(null);
      setAddress("");
      autocompleteRef.current = null;
      setMapCenter(defaultSpainCenter); // Reset to Spain when modal closes
    }
  }, [isOpen]);

  // Update map center when initialCenter changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMapCenter(initialCenter || defaultSpainCenter); // Use initialCenter if provided, else default to Spain
    }
  }, [isOpen, initialCenter]);

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "400px",
    borderRadius: "8px",
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const latLng: LatLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        let countryCode = "";
        const formattedAddress = results[0].formatted_address;

        results[0].address_components.forEach((component) => {
          if (component.types.includes("country")) {
            countryCode = component.short_name;
          }
        });

        if (!allowedCountries.includes(countryCode)) {
          toast.error("Sorry, only UK, NL, BE, ES, FR countries are allowed.");
          setSelectedPosition(null);
          setAddress("");
          return;
        }

        setSelectedPosition(latLng);
        setAddress(formattedAddress);
      }
    });
  };

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (place.geometry && place.geometry.location) {
      const latLng: LatLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedPosition(latLng);
      setAddress(place.formatted_address || "");
      if (mapRef.current) {
        mapRef.current.panTo(latLng);
      }
    }
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleSelect = () => {
    if (address && selectedPosition) {
      onSelectLocation(address, selectedPosition);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl p-2 w-[70%] max-w-[50%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-stone-200 text-lg font-medium">
            Select Location
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200"
          >
            ✕
          </button>
        </div>
        <Autocomplete
          onLoad={(autocomplete) => {
            autocompleteRef.current = autocomplete;
            autocomplete.setComponentRestrictions({
              country: ["gb", "nl", "be", "es", "fr"],
            });
          }}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full p-3 mb-4 bg-zinc-800 rounded-lg text-stone-200 text-sm font-light font-['Kodchasan']"
          />
        </Autocomplete>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={13}
          onClick={handleMapClick}
          onLoad={handleMapLoad}
          options={{ styles: grayStyle }}
        >
          {selectedPosition && <Marker position={selectedPosition} />}
        </GoogleMap>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 text-stone-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            disabled={!address || !selectedPosition}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;