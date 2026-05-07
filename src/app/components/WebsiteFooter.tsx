import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Memberships", href: "/membership-pass" },
];

const merchLinks = [
  { label: "Merchandise", href: "/merchandise" },
  { label: "My Orders", href: "/my-orders" },
  { label: "Return Policy", href: "/terms/refund-policy" },
];

const termLinks = [
  { label: "Terms & Conditions", href: "/terms/terms-and-conditions" },
  { label: "Privacy Policy", href: "/terms/privacy-policy" },
  { label: "Refund Policy", href: "/terms/refund-policy" },
];

export default function WebsiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#02111d] bg-[url('/assets/footerImg.png')] bg-cover bg-center bg-no-repeat px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[420px_1fr]">
        
        {/* LEFT CARD */}
        <div className="rounded-[20px] border border-white/5 bg-[#182431]/80 p-6 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#7E8BFF] px-3 py-1 text-[11px] font-medium text-white">
            <Image
              src="/assets/Badminton.svg"
              alt="Project Play"
              width={14}
              height={14}
            />
            Project Play
          </div>

          <h2 className="mt-5 text-[34px] font-light leading-[1.1] tracking-[-0.02em]">
            Let&apos;s Get Started
          </h2>

          <p className="mt-4 max-w-[320px] text-[12px] leading-6 text-[#C9D3E0]">
            Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry&apos;s
            standard dummy text ever since the 1500s.
          </p>

          <div className="mt-6 flex items-center rounded-full border border-white/10 bg-[#0f1a25] p-1">
            <input
              type="email"
              placeholder="Email Address"
              className="h-10 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-[#AEB8C5]"
            />

            <button className="rounded-full bg-[#7E8BFF] px-6 py-3 text-xs font-medium text-white transition hover:bg-[#909bff]">
              Sign Up
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-between">
          
          {/* LINKS */}
          <div className="grid grid-cols-3 gap-8 lg:gap-16">
            <FooterColumn title="Explore" links={exploreLinks} />
            <FooterColumn title="Merch" links={merchLinks} />
            <FooterColumn title="Terms" links={termLinks} />
          </div>

          {/* CONTACT INFO */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7E8BFF]">
                <Mail size={16} />
              </div>

              <div>
                <p className="text-[12px] leading-5 text-[#D6DFEB]">
                  Talk to an Experts Toll Free
                </p>

                <p className="mt-1 text-[12px] text-white">
                  info@example.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7E8BFF]">
                <MapPin size={16} />
              </div>

              <p className="max-w-[260px] text-[12px] leading-5 text-[#D6DFEB]">
                684 West College St. Sun City, United States of America.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[28px] font-light tracking-[-0.02em] text-white">
        {title}
      </h4>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[12px] text-[#C8D2DE] transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
