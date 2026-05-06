
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getDahboardData, updateAdminDetails } from '@/services/admin-services';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useLocation } from '../context/LocationContext';
import useSWR from 'swr';

export interface LocationOption {
  id: string;
  label: string;
  countryCode: string;
}

const locations: LocationOption[] = [
  { id: 'uk', label: 'UK', countryCode: 'UK' },
  { id: 'nl', label: 'Netherlands', countryCode: 'Netherlands' },
  // { id: 'be', label: 'Belgium', countryCode: 'Belgium' },
  { id: 'es', label: 'Spain', countryCode: 'Spain' },
  { id: 'fr', label: 'France', countryCode: 'France' },
  // { id: 'in', label: 'India', countryCode: 'India' },
];

export default function LocationSelectorPage() {
  const { location, setLocation } = useLocation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log('session: ', session, 'status: ', status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  const USER_ID = session?.user?.id; // coming from auth ideally
  
  const { data } = useSWR(
    '/api/app/details?id=' + USER_ID,
    getDahboardData,
    {
      revalidateOnFocus: false,
    }
  );

  const adminCountry = data?.data?.data?.[0]?.country;

  useEffect(() => {
    if (adminCountry && adminCountry !== location) {
      setLocation(adminCountry);
    }
  }, [adminCountry]);
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const selectedCountry = locations.find(l => l.countryCode === location);

      if (!selectedCountry) return;

      const res = await updateAdminDetails('/api/app/details', {
        country: selectedCountry?.countryCode,
        _id: USER_ID,
      });

      if (res.status !== 200) {
        throw new Error('Failed to update location');
      }

      toast.success('Location updated successfully');
      router.push('/authority/home');

    } catch (err) {
      console.error(err);
      alert('Something went wrong while updating location');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center  px-4">
      <div className="absolute z-0 w-[calc(100%-100px)] h-[calc(100%-200px)] left-1/2 top-[40px] roundered-full -translate-x-1/2 bg-rose-200/20 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md text-center space-y-6">
        {
          loading && (
            <div className="absolute h-full w-full inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
            </div>)
        }

        {/* Icon */}
        <div className="flex justify-center">
          <Image
            src="/assets/reset.png"
            alt="Location"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* Title */}
        <p className="text-white text-3xl font-extrabold font-['Minork_Sans_'] leading-10">
          Where am I working today?
        </p>

        {/* Select */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500"
        >
          {locations.map((l) => (
            <option key={l.id} value={l.countryCode}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full cursor-pointer bg-rose-500 hover:bg-pink-500 disabled:opacity-60 transition text-white py-2 rounded-md text-sm font-medium"
        >
          {loading ? 'Saving...' : 'Select'}
        </button>
      </div>
    </div>
  );
}
