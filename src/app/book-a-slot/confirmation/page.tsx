import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

export default function BookingConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="My Bookings" />
        <section className="mx-auto grid w-full max-w-[1240px] gap-3 lg:grid-cols-[1.5fr_0.65fr]">
          <article className="rounded-2xl bg-[#f1f3fb] p-3">
            <h2 className="text-2xl">Booking Confirmation</h2>
            <div className="mt-3 rounded-xl bg-white p-3 text-sm">Name of Venue - Name of Court - Date 22 Dec 2024 - Time 03:00 PM</div>
            <div className="mt-3 rounded-xl bg-white p-3 text-sm">Equipments Booked: Racket, Towel</div>
            <div className="mt-3 rounded-xl bg-white p-3 text-sm">Participants: You, Joyan</div>
            <div className="mt-3 rounded-xl bg-white p-3 text-xs text-[#6e7795]">Cancellation policy details shown here exactly like design card area.</div>
          </article>
          <article className="rounded-2xl bg-[#f1f3fb] p-3">
            <h3 className="text-xl text-[#6f76d8]">Payment Details</h3>
            <div className="mt-3 space-y-2 rounded-xl bg-white p-3 text-sm">
              <div className="flex justify-between"><span>Slot Price</span><span>$20.00</span></div>
              <div className="flex justify-between"><span>Tax</span><span>$2.00</span></div>
              <div className="flex justify-between"><span>Racket</span><span>$20.00</span></div>
              <div className="flex justify-between"><span>Towel</span><span>$5.00</span></div>
              <div className="flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>$80.00</span></div>
            </div>
            <button className="mt-3 w-full rounded-full bg-[#7f88f8] py-2 text-white">Proceed To Payment</button>
          </article>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
