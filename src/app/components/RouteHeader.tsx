"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

type RouteHeaderProps = {
  activeItem?: string;
  inHero?: boolean;
};

const navItems = [
  { label: "Home", path: "/" },
  { label: "My Bookings", path: "/my-bookings" },
  { label: "Merchandise", path: "/merchandise" },
  { label: "Membership Pass", path: "/membership-pass" },
];

export default function RouteHeader({
  activeItem = "Home",
  inHero = false,
}: RouteHeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <header
        className={`fixed left-1/2 top-3 z-[999] w-[calc(100%-14px)]  -translate-x-1/2 rounded-full   transition-all sm:w-[calc(100%-32px)] `}
      >
        <div className="flex items-center justify-between gap-3">
          
          {/* LOGO */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2  px-4 py-2 bg-indigo-400 rounded-[10.06px]  text-white"
          >
            <Image
              src="/assets/Badminton.svg"
              alt="Project Play"
              width={25}
              height={25}
            />

            <span className="text-[11px] font-medium sm:text-xs">
              Project Play
            </span>
          </Link>

          <div className="flex gap-[11px]">

          
          {/* DESKTOP NAV */}
          <nav className="hidden rounded-full bg-white/95 p-1 lg:block">
            <div className="flex items-center gap-1 ">
              {navItems.map((item) => (
                <Link key={item.label} href={item.path}>
                  <button
                    className={`rounded-full px-5 py-[10px]  text-base font-normal  transition-all ${
                      activeItem === item.label
                        ? "bg-[#858fff] text-white"
                        : "text-[#4A5C7A] hover:bg-[#F5F7FF]"
                    }`}
                  >
                    {item.label}
                  </button>
                </Link>
              ))}
            </div>
          </nav>

          {/* RIGHT BUTTONS */}
          <div className="hidden items-center gap-[6px] lg:flex">
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-[15px] text-[12px] font-medium text-[#596B88] transition hover:bg-[#f7f8fc]"
            >
              Login
            </Link>

            <Link
              href="/book-a-slot"
              className="rounded-full bg-[#7F8CFF] px-5 py-[15px] text-[12px] font-medium text-white transition hover:bg-[#6d7cff]"
            >
              Book A Slot
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A5C7A] lg:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed left-1/2 top-[78px] z-[998] w-[calc(100%-14px)] max-w-[1240px] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/10 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden ${
          mobileMenu
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`rounded-2xl px-4 py-3 text-sm transition ${
                activeItem === item.label
                  ? "bg-[#EEF1FF] font-medium text-[#5C6EFF]"
                  : "text-[#4A5C7A] hover:bg-[#F7F8FC]"
              }`}
              onClick={() => setMobileMenu(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="rounded-full bg-[#F5F7FC] px-5 py-3 text-center text-sm font-medium text-[#4A5C7A]"
            >
              Arisu Awanne
            </Link>

            <Link
              href="/book-a-slot"
              className="rounded-full bg-[#7F8CFF] px-5 py-3 text-center text-sm font-medium text-white"
            >
              Book A Slot
            </Link>
          </div>
        </div>
      </div>

      {!inHero && <div aria-hidden className="h-[70px] sm:h-[60px]" />}
    </>
  );
}
