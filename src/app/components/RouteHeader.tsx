import Link from "next/link";

type RouteHeaderProps = {
  activeItem?: string;
  inHero?: boolean;
};

const navItems = ["Home", "My Bookings", "Merchandise", "Membership Pass"];

export default function RouteHeader({ activeItem = "Home", inHero = false }: RouteHeaderProps) {
  return (
    <header className={`mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-3 px-1 py-1 ${inHero ? "" : "rounded-2xl bg-[#e8ecf8]"}`}>
      <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#7f8cf8] px-4 py-2 text-sm font-medium text-white">
        <span>Project Play</span>
      </div>

      <nav className="mx-auto rounded-full bg-white p-1">
        <div className="flex flex-wrap items-center justify-center gap-1 text-xs text-[#2d3c58] sm:text-sm">
          {navItems.map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 transition ${activeItem === item ? "bg-[#7f8cf8] text-white" : "hover:bg-[#f4f5ff]"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/login" className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#2f3d57]">
          Login
        </Link>
        <Link href="/book-a-slot" className="rounded-full bg-[#7f8cf8] px-6 py-2 text-sm font-semibold text-white">
          Book A Slot
        </Link>
      </div>
    </header>
  );
}
