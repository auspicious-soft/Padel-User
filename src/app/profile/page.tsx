"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
};

type ProfileData = {
  name: string;
  role: string;
  email: string;
  location: string;
  lastVisit: string;
  stats: {
    matchesPlayed: number;
    tournamentsJoined: number;
    trainingSessions: number;
  };
  transactions: Transaction[];
};

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/mock/profile", { cache: "no-store" });
      const json = await res.json();
      setData(json?.data ?? null);
    };
    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-5 w-full max-w-[1240px] pb-10">
          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-full border-4 border-white shadow-md">
              <Image src="/assets/Logo.png" alt="Profile" width={280} height={280} className="h-full w-full object-cover" />
            </div>

            <div className="rounded-2xl bg-[#f4f6ff] p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-4xl font-medium text-[#7885ff]">{data?.name ?? "-"}</h1>
                  <p className="mt-1 text-sm text-[#9aa4c4]">{data?.role ?? "-"}</p>
                </div>
                <button className="rounded-full bg-[#7f8cf8] px-5 py-2 text-sm text-white">Edit Profile</button>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-[#5d6687] sm:grid-cols-3">
                <p><span className="text-[#8f99b8]">Email Address</span><br />{data?.email ?? "-"}</p>
                <p><span className="text-[#8f99b8]">Location</span><br />{data?.location ?? "-"}</p>
                <p><span className="text-[#8f99b8]">Last Visit</span><br />{data?.lastVisit ?? "-"}</p>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl bg-[#7f8cf8] p-3 text-white sm:grid-cols-3">
                <div><p className="text-xs text-[#dce2ff]">Matches Played</p><p className="text-xl">{data?.stats.matchesPlayed ?? 0}</p></div>
                <div><p className="text-xs text-[#dce2ff]">Tournaments Joined</p><p className="text-xl">{data?.stats.tournamentsJoined ?? 0}</p></div>
                <div><p className="text-xs text-[#dce2ff]">Training Sessions</p><p className="text-xl">{data?.stats.trainingSessions ?? 0}</p></div>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-4xl font-medium text-[#7885ff]">Recent Transactions</h2>
          <div className="mt-3 overflow-x-auto rounded-xl bg-[#10182a]">
            <table className="w-full min-w-[760px] text-left text-sm text-white">
              <thead className="bg-[#7f8cf8]">
                <tr>
                  <th className="px-4 py-2">Sr No.</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Name/Description</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.transactions ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-white/10 text-[#d7def5]">
                    <td className="px-4 py-2">{row.id}</td>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.description}</td>
                    <td className="px-4 py-2">${row.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
