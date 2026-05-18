"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Star, X } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { products, reviews } from "@/app/merchandise/data";

export default function MerchandiseDetailPage() {
  const params = useParams<{ id: string }>();
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(3);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === params.id) ?? null,
    [params.id]
  );

  if (!selectedProduct) {
    return (
      <main className="min-h-screen bg-[#dfe4f2] px-3 pt-3 text-[#2e3550]">
        <RouteHeader activeItem="Merchandise" />
        <section className="mx-auto mt-6 w-full max-w-[1240px] rounded-2xl bg-[#f6f8ff] p-6 text-center">
          <h1 className="text-2xl text-[#1C2329]">Product not found</h1>
          <Link href="/merchandise" className="mt-4 inline-block rounded-full bg-[#848EFF] px-6 py-2 text-white">
            Back to Merchandise
          </Link>
        </section>
        <WebsiteFooter />
      </main>
    );
  }

  const moreProducts = products.filter((product) => product.id !== selectedProduct.id);
  const productGallery = [selectedProduct.image, ...moreProducts.slice(0, 5).map((item) => item.image)];
  const sizes = ["Small", "Medium", "Large", "Extra Large"];

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Merchandise" />

        <section className="mx-auto mt-4 w-full max-w-[1120px] pb-10">
          <article className="mb-5 rounded-[12px] bg-[#f6f8ff] p-3 shadow-sm md:p-4">
            <div className="grid gap-[60px] md:grid-cols-[0.7fr_1fr]">
              <div className="w-full">
                <div className="overflow-hidden rounded-[10px]">
                  <Image src={selectedProduct.image} alt={selectedProduct.name} width={350} height={250} className="h-[320px] w-full object-cover" />
                </div>
                <div className="mt-2 grid grid-cols-6 gap-1">
                  {productGallery.map((image, idx) => (
                    <button key={`${image}-${idx}`} type="button" className="overflow-hidden rounded-md border border-[#cad3ed] bg-white">
                      <Image src={image} alt={`Product view ${idx + 1}`} width={80} height={80} className="h-[50px] w-[80px] object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div >
                <h2 className="text-[31px] leading-none font-normal text-[#6f7ef7]">{selectedProduct.name}</h2>
                <p className="mt-1 text-base leading-8 text-[#7E7E8A]">
                  This printed cotton tee is perfect for tennis enthusiasts. Comfortable and stylish, it&apos;s a great addition to your sportswear collection.
                </p>
                <button type="button" onClick={() => setIsReviewsOpen(true)} className="items-center mt-3 flex gap-2 text-left">
                  <span className="flex items-center gap-1 text-[#f4b000]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star height={20} width={15} key={idx} size={12} fill="currentColor" />
                    ))}
                  </span>
                  <span className="text-sm text-[#7E7E8A]">5 Stars (46 Reviews)</span>
                </button>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[13px] text-[#7f86a3] line-through">$60.00</span>
                  <span className="text-[24px] font-medium text-[#1b223f]">${selectedProduct.price.toFixed(2)}</span>
                </div>

                <p className="mt-4 text-sm font-medium text-[#7E7E8A]">Select Size</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[76px] rounded-[3px] border px-2 py-1.5 text-zinc-800 text-sm font-medium ${
                        selectedSize === size ? "border-[#6f7ef7] bg-[#eef1ff] text-[#364064]" : "border-[#d7deee] bg-white text-[#576186]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-sm font-medium text-[#7E7E8A]">Select Quantity</p>
                <div className="mt-1 inline-flex items-center overflow-hidden rounded-[3px] border border-[#d7deee] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="h-6 w-8    text-xs text-[#5f6683]"
                  >
                    -
                  </button>
                  <span className="flex h-6 w-8 items-center justify-center border-x border-[#d7deee]  text-zinc-800 text-sm font-medium ">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((prev) => prev + 1)} className="h-6 w-8 text-xs text-[#5f6683]">
                    +
                  </button>
                </div>

                <div className="mt-5">
                  <button className="cursor-pointer w-full max-w-[500px] rounded-full bg-[#848EFF] py-2 font-semibold text-base text-white">Buy It Now</button>
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-normal rasputin text-[#848EFF]">More Products</h2>
              <Link href="/merchandise" className="rounded-full bg-[#7f8cf8] px-6 py-2 text-sm font-medium text-white">
                View All Products
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreProducts.slice(0, 3).map((product) => (
                <article key={product.id} className="rounded-[10px] bg-[#f7f9ff] p-[10px] shadow-sm">
                  <Link href={`/merchandise/${product.id}`} className="block w-full text-left">
                    <Image src={product.image} alt={product.name} width={320} height={180} className="h-[280px] w-full rounded-lg object-cover" />
                    <h3 className="mt-2 text-[20px] leading-6 font-normal text-[#6f7ef7]">{product.name}</h3>
                    <p className="mt-1 text-[9px] leading-4 text-[#7b85a7]">
                      This printed cotton tee is perfect for tennis enthusiasts. Comfortable and stylish, it&apos;s a great addition to your sportswear collection.
                    </p>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-[#7f86a3] line-through">$60.00</span>
                      <span className="text-[16px] font-medium text-[#1b223f]">${product.price.toFixed(2)}</span>
                    </div>
                    <Link href="#" className="rounded-full bg-[#848EFF] px-5 py-2 text-[10px] font-semibold text-white">
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
                      <Image src="/assets/Logo.png" alt={review.name} width={58} height={58} className="rounded-full" />
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
