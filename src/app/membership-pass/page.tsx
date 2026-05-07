"use client";

import Image from "next/image";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

const planRows = [
  ["Join open game slots", "Yes", "Yes"],
  ["Book as an individual", "Yes", "Yes"],
  ["Pay per slot", "Yes", "Yes"],
  ["Discounted slot pricing", "No", "Yes"],
  ["Better value for frequent players", "No", "Yes"],
];

export default function MembershipPassPage() {
  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-4 w-full max-w-[1240px] pb-10">
          <article className="relative overflow-hidden rounded-2xl">
            <Image src="/assets/ChatGPT.png" alt="Membership banner" width={1240} height={340} className="h-[230px] w-full object-cover sm:h-[280px]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,40,0.72),rgba(10,24,40,0.18))]" />
            <div className="absolute inset-0 p-5 sm:p-8">
              <h1 className="max-w-[540px] text-2xl font-medium text-white sm:text-4xl">Save more every time you play</h1>
              <p className="mt-3 max-w-[560px] text-xs leading-6 text-[#dde6ff] sm:text-sm sm:leading-7">
                Membership Pass helps frequent players pay less per slot while keeping the same smooth booking experience.
              </p>
              <button className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-medium text-[#6f7ef7]">Get Membership Pass</button>
            </div>
          </article>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden rounded-2xl">
              <Image src="/assets/Rectangle.png" alt="Padel players" width={600} height={340} className="h-full w-full object-cover" />
            </div>

            <article className="rounded-2xl border border-[#8793ff] bg-white p-3 sm:p-5">
              <h2 className="text-2xl font-medium text-[#7986f6]">Pricing & Membership Pass</h2>

              <div className="mt-4 overflow-hidden rounded-xl border border-[#e8ecff]">
                <div className="grid grid-cols-3 bg-[#f6f8ff] px-3 py-3 text-[11px] text-[#7a84a0] sm:text-sm">
                  <p>Feature</p>
                  <p>Without Pass</p>
                  <p className="rounded-lg bg-[#7f8cf8] px-2 py-1 text-center text-white">Project Play Pass</p>
                </div>

                {planRows.map(([feature, withoutPass, withPass]) => (
                  <div key={feature} className="grid grid-cols-3 border-t border-[#edf0ff] px-3 py-2 text-[11px] text-[#33405b] sm:text-sm">
                    <p className="font-medium">{feature}</p>
                    <p>{withoutPass}</p>
                    <p>{withPass}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden rounded-2xl">
              <Image src="/assets/AuthImage.png" alt="Membership benefit" width={600} height={340} className="h-full w-full object-cover" />
            </div>

            <article className="rounded-2xl bg-[#f6f8ff] p-4 sm:p-6">
              <h3 className="text-2xl font-medium text-[#7986f6]">Pricing & Membership Pass</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5f6888]">
                <li>Same easy booking flow for all players.</li>
                <li>Lower per-slot pricing for frequent players.</li>
                <li>No hidden charges and transparent cost display.</li>
                <li>Ideal for regular matches and tournaments.</li>
                <li>Manage your bookings from one place.</li>
              </ul>
              <button className="mt-5 rounded-full border border-[#95a4ff] px-5 py-2 text-sm font-medium text-[#6f7ef7]">Get Membership Pass</button>
            </article>
          </div>
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
