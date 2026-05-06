"use client";

import Image from "next/image";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import RouteHeader from "@/app/components/RouteHeader";

const howItWorks = [
  ["Slots are scheduled", "Game slots are created for specific times with a fixed number of spots."],
  ["Check availability upfront", "Browse upcoming slots and see spots left and price per person instantly."],
  ["Join as an individual", "Book a single spot in a slot. No need to arrange a full group or book the whole court."],
  ["Slots fill as players join", "Other players join the same slot until all spots are filled."],
  ["Play more with the Pass", "Get discounted pricing on every slot with the Membership Pass."],
];

const faqItems = [
  ["Do I need to book the full court?", "No. You can book a single spot in a time slot. Other players can join the same slot until it is full."],
  ["Can I join a slot alone?", "Yes. You can join any open slot as an individual without bringing a group."],
  ["What happens if a slot isn't fully booked?", "You can still play. Slots do not require all spots to be filled to go ahead."],
  ["How is pricing calculated?", "Pricing is per person, per slot. You always see the exact price before booking."],
  ["Do I need to bring a group?", "No group is required. You can join open slots and play with others who book the same slot."],
  ["Can I join a slot alone?", "Yes. You can join any open slot as an individual without bringing a group."],
];

const whyChooseUs = [
  ["Play without organizing groups", "Join open time slots as an individual. No need to coordinate with friends or book the entire court."],
  ["Clear pricing, upfront", "See the price per slot before you book. No hidden fees and no last-minute surprises."],
  ["Works across multiple games", "The same slot-based booking works for different sports, so you do not have to learn a new system every time."],
  ["Optional membership, real savings", "Play without a pass or save more with it. Membership helps frequent players pay less per slot."],
];

export default function HomePage() {
  return (
    <main className="bg-[#f0eef7] text-[#1f304c]">
    {/* <main className="bg-[#f0eef7] bg-[url('/assets/ChatGPT.png')] bg-cover bg-center text-[#1f304c]"> */}
      <section className="relative isolate overflow-hidden text-white">
        <Image
          src="/assets/ChatGPT.png"
          alt="Project Play hero background"
          fill
          priority
          className="object-cover object-[64%_28%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,38,66,0.2)_0%,rgba(55,105,166,0.2)_100%)]" />
        <div className="relative z-10 mx-auto min-h-[520px] max-w-[1240px] px-4 pb-16 pt-5 sm:min-h-[600px] sm:px-6 lg:min-h-[640px] lg:px-8 lg:pb-24">
          <RouteHeader activeItem="Home" inHero />

          {/* <h1 className="mt-8 text-center font-heading text-5xl font-extrabold leading-none tracking-tight text-[#bdd0e8] drop-shadow-[0_6px_16px_rgba(16,40,74,0.4)] sm:mt-10 sm:text-7xl lg:text-8xl">
            Project Play
          </h1> */}

          <div className="relative top-35 mt-6 grid items-end gap-8 lg:mt-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="z-10">
              <h2 className="max-w-[520px] text-4xl font-light leading-[1.15] sm:text-5xl lg:text-[52px]">
                Start Your Playing Journey Today!
              </h2>
              <p className="mt-4 max-w-[500px] text-sm leading-7 text-[#e2ebfa]">
                Choose a time slot, book as an individual, and pay per slot. No full-court booking required.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button className="rounded-full bg-[#7f8cf8] px-6 py-3 text-sm font-semibold text-white">
                  Book A Slot
                </button>
                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#7b82f7]">
                  Get Membership Pass
                </button>
              </div>
            </div>

            <div className="relative">
              {/* <Image
                src="/assets/ChatGPT.png"
                alt="Padel player in action"
                width={700}
                height={600}
                priority
                className="mx-auto h-auto w-full"
              /> */}
              <div className="mx-auto mt-2 max-w-[310px] text-center lg:absolute lg:bottom-10 lg:right-0 lg:mx-0 lg:text-left">
                <h3 className="text-[38px] font-light leading-none">Play Beyond Limits</h3>
                <p className="mt-3 text-sm leading-7 text-[#dce8f9]">
                  Train, compete, and connect in a space built for movement and momentum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-10">
          <div>
            <h3 className="text-[40px] font-light text-[#7885ff]">A Simpler Way To Play</h3>
            <p className="mt-4 max-w-[360px] text-sm leading-7 text-[#6d7891]">
              Instead of booking an entire court, you join open time slots as an individual. Each slot has limited spots, clear pricing, and fills up as players join.
            </p>
            <button className="mt-7 inline-flex items-center gap-2 text-[44px] font-light text-[#7885ff]">
              How It Works <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#8792ff] text-base text-white">?</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map(([title, description]) => (
              <article key={title} className="rounded-2xl border border-[#e4e7f8] bg-white p-5">
                <p className="mb-3 text-right text-[#98a6ff]">?</p>
                <h4 className="text-base font-medium text-[#7885ff]">{title}</h4>
                <p className="mt-3 text-sm leading-7 text-[#7d889f]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.65fr] lg:px-8">
        <div className="overflow-hidden rounded-[20px]">
          <Image
            src="/assets/Rectangle.png"
            alt="Padel players"
            width={620}
            height={430}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h3 className="text-[48px] font-light text-[#7885ff]">Pricing & Membership Pass</h3>
          <div className="mt-5 rounded-[20px] border border-[#8793ff] bg-white">
            <div className="grid grid-cols-3 border-b border-[#e9ecff] px-4 py-4 text-xs text-[#7a84a0] sm:px-7 sm:text-sm">
              <p>Feature</p>
              <p>Without Pass</p>
              <p className="rounded-xl bg-[#7f8cf8] px-3 py-1 text-center text-white">Project Play Pass</p>
            </div>

            {[
              ["Join open game slots", "Yes", "Yes"],
              ["Book as an individual", "Yes", "Yes"],
              ["Pay per slot", "Yes", "Yes"],
              ["Discounted slot pricing", "No", "Yes"],
              ["Better value for frequent players", "No", "Yes"],
            ].map(([feature, withoutPass, withPass]) => (
              <div key={feature} className="grid grid-cols-3 border-b border-[#eef0ff] px-4 py-3 text-xs text-[#36435c] last:border-b-0 sm:px-7 sm:text-sm">
                <p className="font-semibold">{feature}</p>
                <p>{withoutPass}</p>
                <p>{withPass}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-[50px] font-light text-[#7885ff]">Frequently Asked Questions</h3>
          <button className="w-fit rounded-full bg-[#7f8cf8] px-6 py-2 text-sm text-white">View All FAQs</button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqItems.map(([question, answer], index) => (
            <details key={`${question}-${index}`} className="rounded-2xl bg-white px-5 py-4 text-[#66728d]">
              <summary className="cursor-pointer list-none text-sm text-[#7381ff] sm:text-base">{question}</summary>
              <p className="mt-2 text-sm leading-7">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[50px] font-light text-[#7885ff]">What People Say</h3>
          <p className="hidden rounded-full bg-white px-3 py-1 text-sm text-[#7c87a0] md:block">+2,500 happy players</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <article key={item} className="rounded-2xl bg-white px-6 py-7 text-center">
              <p className="text-sm leading-7 text-[#6f7b94]">
                I usually skip games because getting a full group together is a hassle. Slot booking makes it easy to just show up and play.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <Image src="/assets/Logo.png" alt="Player avatar" width={38} height={38} className="rounded-full" />
                <div className="text-left">
                  <p className="text-sm text-[#7e89ff]">Beck Alves</p>
                  <p className="text-xs text-[#90a0b6]">Sydney, Australia</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-20 sm:px-6 lg:px-8">
        <h3 className="text-[50px] font-light text-[#7885ff]">Why Choose Us</h3>
        <p className="mt-2 max-w-[700px] text-sm leading-7 text-[#707b94]">
          Instead of booking full courts or spending time coordinating groups, you can join open time slots as an individual.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map(([title, description]) => (
            <article key={title} className="rounded-2xl bg-[#7f8cf8] p-6 text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#7f8cf8]">?</span>
              <h4 className="mt-4 text-[30px] font-light leading-tight">{title}</h4>
              <p className="mt-3 text-sm leading-7 text-[#e9ecff]">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <WebsiteFooter />
    </main>
  );
}
