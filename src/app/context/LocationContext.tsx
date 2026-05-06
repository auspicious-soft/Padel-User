"use client";

import React, { createContext, useContext, useState } from "react";

type LocationContextType = {
  location: string;
  setLocation: (value: string) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [location, setLocation] = useState("UK"); // default
 
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error("useLocation must be used inside LocationProvider");
  }

  return context;
};
