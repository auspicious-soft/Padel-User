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

        <section className="mx-auto mt-4 w-full  ">
          <article className="relative overflow-hidden rounded-2xl pb-10">
            <Image src="/assets/bgImg1.png" alt="Membership banner" width={1240} height={840} className="h-[380px] w-full object-cover object-right md:object-right sm:h-[380px]" />
            {/* <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,24,40,0.72),rgba(10,24,40,0.18))]" /> */}
            <div className="absolute inset-0 py-16 md:py-14 mx-10 md:mx-20 max-w-[400px]">
              <h1 className=" md:max-w-[780px] text-2xl md:text-5xl font-normal rasputin text-white sm:text-4xl">Save more every time you play</h1>
              <p className="mt-4.5 max-w-[560px] text-xs leading-7 text-[#dde6ff] sm:text-sm sm:leading-7">
                The Membership Pass gives you discounted pricing on every slot you book. No changes to how you book — you just pay less.
              </p>
              <button className="cursor-pointer mt-4.5  bg-white   px-7 py-2.5 bg-White rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#848EFF] text-base font-semibold text-[#848EFF]">Get Membership Pass</button>
            </div>
          </article>

          <div className="mx-auto mt-7 grid max-w-[1240px] gap-6 px-4 pb-5 sm:px-6 md:grid-cols-[1fr_1.65fr] lg:px-8">
            {/* <div className="overflow-hidden rounded-2xl"> */}
            <Image
              src="/assets/Rectangle.png"
              alt="Padel players"
              width={600}
              height={400}
              className="h-[200px] w-full  md:h-full rounded-2xl md:w-full  object-cover"
            />
            

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

              <div className="w-full">
                <h3 className="text-4xl font-normal text-[#848EFF]  rasputin capitalize mt-4 w-full">Pricing & Membership Pass</h3>
                <div className="mt-6 rounded-[20px] border border-[#8793ff] bg-white w-full" >
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
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[1.5fr_1.65fr] md:px-8">
            <div className="overflow-hidden rounded-2xl ">
              <Image src="/assets/Image1.png" alt="Membership benefit" width={600} height={340} className="h-[350px] w-full md:h-full rounded-2xl md:w-full  object-cover"/>
            </div>

            <article className="rounded-2xl ">
              <h3 className=" text-4xl font-normal text-[#848EFF] rasputin">Pricing & Membership Pass</h3>
              <p className="mt-3 text-sm leading-6 text-[#5f6888]">The Membership Pass gives you discounted pricing on every slot you book. You still book slots the same way, join as an individual, and see prices upfront — you simply pay less each time you play. It’s optional and designed for players who play regularly.</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#5f6888]">
                <li>Same easy booking flow for all players.</li>
                <li>Lower per-slot pricing for frequent players.</li>
                <li>No hidden charges and transparent cost display.</li>
                <li>Ideal for regular matches and tournaments.</li>
                <li>Manage your bookings from one place.</li>
              </ul>
              <button className="cursor-pointer mt-3.5  bg-white   px-7 py-2.5 bg-White rounded-3xl outline outline-1 outline-offset-[-1px] outline-[#848EFF] text-base font-semibold text-[#848EFF]">Get Membership Pass</button>
            </article>
          </div>
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
