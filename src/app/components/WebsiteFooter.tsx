import Link from "next/link";

const exploreLinks = ["Home", "My Bookings", "Memberships"];
const merchLinks = ["Merchandise", "My Orders", "Return Policy"];
const termLinks = ["Terms & Conditions", "Privacy Policy", "Refund Policy"];

export default function WebsiteFooter() {
  return (
    <footer className="bg-[radial-gradient(circle_at_right,rgba(127,140,248,0.2),transparent_35%),linear-gradient(180deg,#061320_0%,#030a12_100%)] px-4 py-12 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div className="rounded-2xl bg-white/10 p-6">
          <p className="inline-flex items-center rounded-lg bg-[#7f8cf8] px-3 py-2 text-sm">Project Play</p>
          <h4 className="mt-5 text-4xl font-light">Let&apos;s Get Started</h4>
          <p className="mt-3 text-sm leading-7 text-[#d0d9e8]">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email Address"
              className="h-11 rounded-full border border-white/25 bg-transparent px-4 text-sm outline-none placeholder:text-white/70"
            />
            <button className="h-11 rounded-full bg-[#7f8cf8] px-6 text-sm">Sign Up</button>
          </div>
        </div>

        <FooterColumn title="Explore" links={exploreLinks} />
        <FooterColumn title="Merch" links={merchLinks} />
        <FooterColumn title="Terms" links={termLinks} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h5 className="text-4xl font-light">{title}</h5>
      <ul className="mt-3 space-y-2 text-sm text-[#d3dcea]">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="hover:text-white">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
