import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      name: "Julia Snorikova",
      role: "Pro Athlete",
      email: "julia@example.com",
      location: "E 288, Power Board Road, CA",
      lastVisit: "27 Dec 2025",
      stats: {
        matchesPlayed: 240,
        tournamentsJoined: 120,
        trainingSessions: 130,
      },
      transactions: [
        { id: "4364", date: "2025-10-02", description: "Padel Slot Booking", amount: 199.0, status: "Refunded" },
        { id: "0732", date: "2025-07-02", description: "Membership Pass", amount: 76.0, status: "Paid" },
        { id: "5780", date: "2025-03-01", description: "Padel Slot Booking", amount: 89.75, status: "Refunded" },
        { id: "0560", date: "2025-01-04", description: "Padel Slot Booking", amount: 85.5, status: "Paid" },
        { id: "6216", date: "2025-04-10", description: "Padel Slot Booking", amount: 110.0, status: "Refunded" },
      ],
    },
  });
}
