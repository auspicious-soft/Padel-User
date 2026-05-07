"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Natural Hair Growth Spray",
    price: 50,
    image: "/assets/AuthImage.png",
    description: "Professional formula designed for visible growth and healthier-looking hair.",
  },
  {
    id: "2",
    name: "Herbal Volume Shampoo",
    price: 45,
    image: "/assets/Rectangle.png",
    description: "Gentle cleansing with botanical extracts to support fuller and stronger hair.",
  },
  {
    id: "3",
    name: "Daily Care Conditioner",
    price: 38,
    image: "/assets/curvedMainImg.png",
    description: "Hydrating conditioner for smooth texture and reduced hair breakage.",
  },
  {
    id: "4",
    name: "Scalp Nutrition Serum",
    price: 42,
    image: "/assets/AuthImage.png",
    description: "Lightweight serum that nourishes scalp and supports natural growth cycles.",
  },
  {
    id: "5",
    name: "Protein Hair Mask",
    price: 55,
    image: "/assets/Rectangle.png",
    description: "Weekly treatment that repairs dry and damaged strands.",
  },
  {
    id: "6",
    name: "Anti-Frizz Leave In",
    price: 35,
    image: "/assets/curvedMainImg.png",
    description: "Daily leave-in cream for better shine, softness, and control.",
  },
];

const reviews = Array.from({ length: 3 }).map((_, idx) => ({
  id: String(idx + 1),
  name: "Kathrin R",
  city: "Chandigarh",
  text: "I couldn't be happier with this hair growth spray. It arrived on time, and it has exceeded my expectations. With consistent morning and evening application, I've already witnessed a visible transformation after just 2 weeks!",
}));

export default function MerchandisePage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedId) ?? null,
    [selectedId]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => product.name.toLowerCase().includes(term));
  }, [search]);

  const moreProducts = selectedProduct
    ? products.filter((product) => product.id !== selectedProduct.id)
    : filtered;

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Merchandise" />

        <section className="mx-auto mt-4 w-full max-w-[1240px] pb-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-medium">Merchandise</h1>
            <div className="flex w-full gap-2 sm:w-auto">
              {selectedProduct && (
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="h-10 rounded-full border border-[#cfd6ea] bg-white px-4 text-sm text-[#586285]"
                >
                  Back
                </button>
              )}
              <div className="relative w-full sm:w-[240px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a3c4]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="h-10 w-full rounded-full border border-[#cfd6ea] bg-white pl-9 pr-4 text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {selectedProduct ? (
            <article className="mb-5 rounded-2xl bg-[#f6f8ff] p-3 shadow-sm md:p-4">
              <div className="grid gap-3 md:grid-cols-[220px_1fr_auto] md:items-start">
                <div className="overflow-hidden rounded-xl">
                  <Image src={selectedProduct.image} alt={selectedProduct.name} width={220} height={180} className="h-[180px] w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-[#7a85f5]">{selectedProduct.name}</h2>
                  <button
                    type="button"
                    onClick={() => setIsReviewsOpen(true)}
                    className="mt-2 flex items-center gap-2 text-left"
                  >
                    <span className="flex items-center gap-1 text-[#f4b000]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={16} fill="currentColor" />
                      ))}
                    </span>
                    <span className="text-sm text-[#5a6485]">5 Stars (46 Reviews)</span>
                  </button>
                  <p className="mt-3 text-sm leading-7 text-[#6b7596]">{selectedProduct.description}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-2xl font-semibold text-[#7a85f5]">${selectedProduct.price}</p>
                  <button className="mt-3 rounded-full bg-[#7f8cf8] px-6 py-2 text-sm font-medium text-white">Buy Now</button>
                </div>
              </div>
            </article>
          ) : null}

          <div>
            <h2 className="mb-3 text-xl text-[#7a85f5]">{selectedProduct ? "More Products" : "All Products"}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {moreProducts.map((product) => (
                <article key={product.id} className="rounded-xl bg-[#f7f9ff] p-2 shadow-sm">
                  <button type="button" onClick={() => setSelectedId(product.id)} className="block w-full text-left">
                    <Image src={product.image} alt={product.name} width={320} height={190} className="h-[150px] w-full rounded-lg object-cover" />
                    <h3 className="mt-2 text-sm font-semibold text-[#6f7ef7]">{product.name}</h3>
                    <p className="mt-1 text-[11px] leading-5 text-[#7b85a7]">{product.description}</p>
                  </button>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5a6485]">${product.price}</span>
                    <Link href="#" className="rounded-full bg-[#7f8cf8] px-3 py-1 text-xs text-white">
                      Buy Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <WebsiteFooter />

      {isReviewsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1220]/45 p-3">
          <div className="relative max-h-[90vh] w-full max-w-[820px] overflow-y-auto rounded-[24px] bg-[#f2f2f2] p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setIsReviewsOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white p-2 text-[#4d5574] shadow"
              aria-label="Close reviews"
            >
              <X size={18} />
            </button>

            <h2 className="text-3xl font-medium text-[#2f354d]">Reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl bg-[#dfe6f6] p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Image src="/assets/Logo.png" alt={review.name} width={48} height={48} className="rounded-full" />
                      <div>
                        <h3 className="text-2xl font-medium text-[#7a85f5]">{review.name}</h3>
                        <p className="text-base text-[#5f6683]">{review.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#f4b000]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-base leading-8 text-[#545c79]">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
