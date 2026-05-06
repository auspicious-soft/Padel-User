import Image from "next/image";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

export default function CourtBookingPage() {
  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="My Bookings" />
        <section className="mx-auto grid w-full max-w-[1240px] gap-3 lg:grid-cols-[0.95fr_1.35fr]">
          <article className="rounded-2xl bg-[#f1f3fb] p-3">
            <h2 className="text-2xl">Court Information</h2>
            <p className="mt-2 text-sm text-[#69728f]">Name of Venue</p>
            <Image src="/assets/Rectangle.png" alt="Court" width={500} height={280} className="mt-3 h-[220px] w-full rounded-xl object-cover" />
            <p className="mt-2 text-xs text-[#717998]">Address - E 2858, Phezer Board Road, CA</p>
          </article>

          <article className="rounded-2xl bg-[#f1f3fb] p-3">
            <h2 className="text-2xl">Book Your Game</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <input className="rounded-xl border border-[#d6dced] bg-white px-3 py-2 text-xs" placeholder="Select Game" />
              <input className="rounded-xl border border-[#d6dced] bg-white px-3 py-2 text-xs" placeholder="Select Date" />
              <input className="rounded-xl border border-[#d6dced] bg-white px-3 py-2 text-xs" placeholder="Day" />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[1,2,3,4].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl border border-[#d6dced] bg-white px-3 py-2 text-xs">
                  <span>Name of Court</span>
                  <button className="rounded-full bg-[#eef1fb] px-2 py-1">View Details</button>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs">
              {["09:00","07:00","08:00","10:00","11:00","03:00","04:00","05:00","06:00","07:00"].map((time, idx) => (
                <button key={`${time}-${idx}`} className={idx===2 ? "rounded-lg bg-[#7f88f8] py-2 text-white" : "rounded-lg bg-white py-2"}>{time}</button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3 py-2 text-xs">You</div>
              <div className="rounded-xl bg-white px-3 py-2 text-xs">Joyan</div>
            </div>
            <button className="mt-4 w-full rounded-full bg-[#7f88f8] py-2 text-sm text-white">Continue</button>
          </article>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
