"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { products } from "@/app/merchandise/data";

export default function MerchandisePage() {
  const [search, setSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("All Venues");
  const venueOptions = ["All Venues", "Sky Padel", "Downtown Court", "Green Arena"];

  const productsWithVenue = useMemo(
    () =>
      products.map((product, idx) => ({
        ...product,
        venue: venueOptions[(idx % (venueOptions.length - 1)) + 1],
      })),
    []
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return productsWithVenue.filter((product) => {
      const matchesSearch = !term || product.name.toLowerCase().includes(term);
      const matchesVenue = selectedVenue === "All Venues" || product.venue === selectedVenue;
      return matchesSearch && matchesVenue;
    });
  }, [productsWithVenue, search, selectedVenue]);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Merchandise" />

        <section className="mx-auto mt-4 w-full max-w-[1240px] pb-10">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[30px] font-normal text-[#1C2329]">Merchandise</h1>

            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="h-9 w-full rounded-full border border-[#d1d8ee] bg-white px-4 text-sm outline-none sm:w-[180px]"
              />
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="h-9 w-full rounded-full border border-[#d1d8ee] bg-white px-4 text-sm text-[#4f5877] outline-none sm:w-[170px]"
              >
                {venueOptions.map((venue) => (
                  <option key={venue} value={venue}>
                    {venue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-[10px] bg-[#f7f9ff] p-[10px] shadow-sm">
                <Link href={`/merchandise/${product.id}`} className="block w-full text-left">
                  <Image src={product.image} alt={product.name} width={320} height={180} className="h-[220px] w-full rounded-lg object-cover" />
                  <h3 className="mt-2 text-[18px] leading-6 font-normal text-[#6f7ef7]">{product.name}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-[#7b85a7]">
                    This printed cotton tee is perfect for tennis enthusiasts. Comfortable and stylish, it&apos;s a great addition to your sportswear collection.
                  </p>
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-[#7f86a3] line-through">$65.00</span>
                    <span className="text-[16px] font-medium text-[#1b223f]">${product.price.toFixed(2)}</span>
                  </div>
                  <Link href={`/merchandise/${product.id}`} className="rounded-full bg-[#848EFF] px-5 py-2 text-[10px] font-semibold text-white">
                    Buy Now
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="mt-6 text-center text-sm text-[#6f7695]">No products found for this search and venue.</p>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#8b93b2]">
            <button className="rounded bg-white px-2 py-1 shadow-sm">Prev</button>
            <button className="rounded bg-[#848EFF] px-2 py-1 text-white">1</button>
            <button className="rounded bg-white px-2 py-1 shadow-sm">2</button>
            <button className="rounded bg-white px-2 py-1 shadow-sm">3</button>
            <button className="rounded bg-white px-2 py-1 shadow-sm">Next</button>
          </div>
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
