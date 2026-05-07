"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Search } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { getData } from "@/services/admin-services";

type BookingType = "tournament" | "matches";

type TeamMember = {
  teamMemberName: string;
  teamMemberImage?: string;
};

type Booking = {
  _id: string;
  venue?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
  };
  court?: {
    name?: string;
  };
  gameType?: string;
  bookingDate?: string;
  timeSlot?: string;
  bookingPrice?: number;
  totalSlots?: number;
  status?: string;
  teamMembers?: TeamMember[];
};

const TYPE_OPTIONS: { label: string; value: BookingType }[] = [
  { label: "Matches", value: "matches" },
  { label: "Tournaments", value: "tournament" },
];

const GAME_FILTERS = ["All", "Padel", "Tennis", "Badminton"];

const prettyDate = (date?: string) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function MyBookingsPage() {
  const [activeType, setActiveType] = useState<BookingType>("matches");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("All");

  useEffect(() => {
    let mounted = true;

    const loadBookings = async () => {
      try {
        setLoading(true);

        const directTypeRoute = `/api/user/booking?type=${activeType}`;
        let response = await getData(directTypeRoute);
        let data = response?.data?.data ?? [];

        if (activeType === "matches" && Array.isArray(data) && data.length === 0) {
          response = await getData("/api/user/booking?type=match");
          data = response?.data?.data ?? [];
        }

        if (!mounted) return;
        setBookings(Array.isArray(data) ? data : []);
      } catch {
        if (!mounted) return;
        setBookings([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadBookings();

    return () => {
      mounted = false;
    };
  }, [activeType]);

  const filteredBookings = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bookings.filter((booking) => {
      const venueName = booking.venue?.name ?? "";
      const courtName = booking.court?.name ?? "";
      const game = booking.gameType ?? "";

      const isGameMatch = gameFilter === "All" || game.toLowerCase() === gameFilter.toLowerCase();

      if (!term) return isGameMatch;

      return isGameMatch && [venueName, courtName, game].some((value) => value.toLowerCase().includes(term));
    });
  }, [bookings, search, gameFilter]);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="My Bookings" />

        <section className="mx-auto mt-4 w-full max-w-[1240px] pb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-medium">My Bookings</h1>
              <div className="mt-3 inline-flex rounded-full bg-white p-1 shadow-sm">
                {TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setActiveType(option.value)}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      activeType === option.value ? "bg-[#1f2432] text-white" : "text-[#5a6485] hover:bg-[#f2f4fb]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              <select
                value={gameFilter}
                onChange={(e) => setGameFilter(e.target.value)}
                className="h-10 rounded-full border border-[#cfd6ea] bg-white px-4 text-sm text-[#4d5776] outline-none"
              >
                {GAME_FILTERS.map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3c4]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="h-10 w-full rounded-full border border-[#cfd6ea] bg-white pl-9 pr-4 text-sm text-[#4d5776] outline-none placeholder:text-[#98a3c4] sm:w-[220px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {loading && (
              <div className="rounded-2xl bg-white/80 p-8 text-center text-sm text-[#6d7693] shadow-sm">
                Loading bookings...
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="rounded-2xl bg-white/80 px-6 py-16 text-center shadow-sm">
                <h2 className="text-3xl font-medium text-[#333b57]">No Bookings Found!</h2>
                <Link
                  href="/book-a-slot"
                  className="mt-5 inline-flex rounded-full border border-[#95a4ff] px-5 py-2 text-sm font-medium text-[#6f7ef7]"
                >
                  Book a Slot
                </Link>
              </div>
            )}

            {!loading &&
              filteredBookings.map((booking) => (
                <article key={booking._id} className="rounded-2xl bg-[#f8f9fd] p-3 shadow-sm sm:p-4">
                  <div className="grid gap-4 md:grid-cols-[160px_1fr_auto] md:items-center">
                    <div className="h-[118px] overflow-hidden rounded-xl bg-[#d7deef]">
                      <Image
                        src="/assets/Rectangle.png"
                        alt="Booking"
                        width={160}
                        height={118}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-lg font-medium text-[#6f7ef7]">{booking.venue?.name ?? "Venue"}</p>
                        <p className="mt-1 text-sm text-[#4c5676]">{booking.court?.name ?? "Court"}</p>
                        <p className="mt-1 text-xs text-[#6d7693]">
                          {[booking.venue?.address, booking.venue?.city, booking.venue?.state].filter(Boolean).join(", ") ||
                            "Address not available"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#5e6787]">
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays size={14} /> {prettyDate(booking.bookingDate)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={14} /> {booking.timeSlot ?? "-"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-[#4c5676]">
                        <p>
                          <span className="text-[#7d86a7]">Game: </span>
                          {booking.gameType ?? "-"}
                        </p>
                        <p>
                          <span className="text-[#7d86a7]">No. of slots: </span>
                          {booking.totalSlots ?? 0}
                        </p>
                        <p>
                          <span className="text-[#7d86a7]">Players: </span>
                          {booking.teamMembers?.length ?? 0}
                        </p>
                        <p>
                          <span className="text-[#7d86a7]">Status: </span>
                          {booking.status ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="md:text-right">
                      <span className="inline-flex rounded-full bg-[#7f8cf8] px-4 py-2 text-sm font-medium text-white">
                        ${Number(booking.bookingPrice ?? 0).toFixed(2)} Paid
                      </span>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
