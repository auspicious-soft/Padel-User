"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncAuthState = () => {
      const token = localStorage.getItem("accessToken");
      const rawUserDetails = localStorage.getItem("userDetails");

      if (!token || !rawUserDetails) {
        setIsLoggedIn(false);
        setFullName("");
        return;
      }

      try {
        const parsed = JSON.parse(rawUserDetails) as { fullName?: string };
        setIsLoggedIn(true);
        setFullName(parsed?.fullName?.trim() || "User");
      } catch {
        setIsLoggedIn(true);
        setFullName("User");
      }
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
    };
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setShowUserMenu(false);
    setMobileMenu(false);
    setIsLoggedIn(false);
    setFullName("");
    router.replace("/");
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    setShowLogoutConfirm(true);
  };

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
                    className={`rounded-full px-5 py-[10px] cursor-pointer text-base font-normal  transition-all ${
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
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="cursor-pointer rounded-full bg-white px-5 py-[15px] text-[12px] font-medium text-[#596B88] transition hover:bg-[#f7f8fc]"
                >
                  {fullName}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-[52px] w-[130px] rounded-xl border border-[#e7ebfb] bg-white p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={handleLogoutClick}
                      className="cursor-pointer w-full rounded-lg px-3 py-2 text-left text-sm text-[#4A5C7A] hover:bg-[#f5f7ff]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-white px-5 py-[15px] text-[12px] font-medium text-[#596B88] transition hover:bg-[#f7f8fc]"
              >
                Login
              </Link>
            )}

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
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A5C7A] lg:hidden"
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
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="cursor-pointer rounded-full bg-[#F5F7FC] px-5 py-3 text-center text-sm font-medium text-[#4A5C7A]"
                >
                  {fullName}
                </button>
                {showUserMenu && (
                  <button
                    type="button"
                    onClick={handleLogoutClick}
                    className="cursor-pointer rounded-full bg-white px-5 py-3 text-center text-sm font-medium text-[#4A5C7A]"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#F5F7FC] px-5 py-3 text-center text-sm font-medium text-[#4A5C7A]"
              >
                Login
              </Link>
            )}

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

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-medium text-[#2e3550]">Confirm Logout</h3>
            <p className="mt-2 text-sm text-[#66708f]">Are you sure you want to logout?</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full border border-[#d8dff4] px-4 py-2 text-sm text-[#4A5C7A]"
              >
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="rounded-full bg-[#7F8CFF] px-4 py-2 text-sm font-medium text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
