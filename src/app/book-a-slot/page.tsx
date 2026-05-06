import Image from "next/image";
import Link from "next/link";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

const venues = Array.from({ length: 4 }).map((_, i) => ({ id: i + 1, name: "Name of Court" }));
const friends = ["Yasi", "Joyan", "Kareem", "Jayan", "Jaiin"];

export default function BookASlotPage() {
  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="My Bookings" />

        <section className="mx-auto grid w-full max-w-[1240px] gap-3 lg:grid-cols-[1.05fr_1fr]">
          <div className="rounded-2xl bg-[#f1f3fb] p-3 shadow-sm">
            <h2 className="mb-2 text-xl">Venues</h2>
            <div className="space-y-2">
              {venues.map((venue) => (
                <article key={venue.id} className="rounded-2xl bg-[#7f88f8] p-2 text-white">
                  <div className="grid grid-cols-[84px_1fr] gap-3">
                    <Image src="/assets/Rectangle.png" alt="Court" width={84} height={84} className="h-[84px] w-[84px] rounded-xl object-cover" />
                    <div>
                      <p className="text-sm">{venue.name}</p>
                      <p className="mt-1 text-[11px] text-[#e5e9ff]">Book a slot and enjoy your match.</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                        <button className="rounded-full border border-white/60 px-2 py-1">View Details</button>
                        <button className="rounded-full border border-white/60 px-2 py-1">Closed Court</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <section className="rounded-2xl bg-[#f1f3fb] p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl">Tournaments</h2>
                <Link href="/book-a-slot/tournament" className="rounded-full bg-[#7f88f8] px-3 py-1 text-xs text-white">View All</Link>
              </div>
              <article className="rounded-2xl bg-white p-2">
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <Image src="/assets/Rectangle.png" alt="Tournament" width={96} height={76} className="h-[76px] w-[96px] rounded-xl object-cover" />
                  <div>
                    <p className="text-sm text-[#6d75d8]">Name of Tournament</p>
                    <p className="mt-1 text-[11px] text-[#6b728b]">Book a slot and enjoy your match.</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-[#7a84a7]">
                      <span className="rounded-full border border-[#d5dbee] px-2 py-1">View Details</span>
                      <span className="rounded-full border border-[#d5dbee] px-2 py-1">22 Dec 2024</span>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className="rounded-2xl bg-[#f1f3fb] p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl">Friends</h2>
                <button className="rounded-full bg-[#7f88f8] px-3 py-1 text-xs text-white">Add Friend</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {friends.concat(friends).map((friend, idx) => (
                  <div key={`${friend}-${idx}`} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs">
                    <span>{friend}</span>
                    <button className="rounded-full bg-[#161e33] px-2 py-1 text-[10px] text-white">View Details</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
