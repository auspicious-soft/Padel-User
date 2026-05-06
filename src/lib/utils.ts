// "use client"
import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToDDMMYYYY(isoString: string): string {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


export function useDebounce<T>(value: T, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function formatDateTime(isoString: string): string {
  const date: Date = new Date(isoString);
  const now: Date = new Date();

  // Remove time part for comparison
  const stripTime = (d: Date): Date =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const inputDay: Date = stripTime(date);
  const today: Date = stripTime(now);

  const diffDays: number = Math.floor(
    (today.getTime() - inputDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Today → show time (1:01 PM)
  if (diffDays === 0) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday";
  }

  // Other days → weekday
  return date.toLocaleDateString([], { weekday: "long" });
}

export const formatDateTimeInSegments = (isoString: string) => {
  const date = new Date(isoString);

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};
export const formatTime = (isoString: string) => {
  const date = new Date(isoString);

  // const month = String(date.getMonth() + 1).padStart(2, '0');
  // const day = String(date.getDate()).padStart(2, '0');
  // const year = String(date.getFullYear()).slice(-2);

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

// export function formatPhoneNumber(number, country) {
//   const digits = number.replace(/\D/g, "");
//   const c = country.toLowerCase();

//   switch (c) {
//     case "netherlands":
//       // +31 6 12345678
//       return `+31 ${digits.slice(0, 1)} ${digits.slice(1, 9)}`;

//     case "belgium":
//       // +32 123 123456
//       return `+32 ${digits.slice(0, 3)} ${digits.slice(3, 9)}`;

//     case "spain":
//       // +34 123 456 789
//       return `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;

//     case "uk":
//       // +44 1234 123456
//       return `+44 ${digits.slice(0, 4)} ${digits.slice(4, 10)}`;

//     case "france":
//       // +33 01 12 12 12 12
//       return `+33 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;

//     default:
//       return "Unsupported country";
//   }
// }


export function formatPhoneNumber(number, country) {
  const digits = number.replace(/\D/g, "");
  const c = country.toLowerCase();

  switch (c) {
    case "netherlands":
      // +31 6 12345678
      return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 11)}`;

    case "belgium":
      // +32 123 123456
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 11)}`;

    case "spain":
      // +34 123 456 789
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;

    case "uk":
      // +44 1234 123456
      return `+${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6, 12)}`;

    case "france":
      // +33 01 12 12 12 12
      return `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;

    default:
      return "Unsupported country";
  }
}
