"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Star, X } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

type Order = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/mock/orders", { cache: "no-store" });
      const json = await res.json();
      setOrders(json?.data ?? []);
    };
    load();
  }, []);

  const openReview = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsReviewOpen(true);
  };

  const submitReview = (e: FormEvent) => {
    e.preventDefault();
    console.log("Dummy review submit", { orderId: activeOrderId, rating, review });
    setIsReviewOpen(false);
    setReview("");
    setRating(5);
  };

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-5 w-full max-w-[1240px] pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-3xl font-medium">My Orders</h1>
            <input placeholder="Search" className="h-9 rounded-full border border-[#cfd6ea] bg-white px-4 text-sm outline-none" />
          </div>

          <div className="space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl bg-[#f6f8ff] p-3 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[170px_1fr_auto] md:items-center">
                  <Image src={order.image} alt={order.name} width={170} height={110} className="h-[110px] w-full rounded-xl object-cover" />
                  <div>
                    <h2 className="text-lg font-medium text-[#7885ff]">{order.name}</h2>
                    <p className="mt-1 text-xs leading-5 text-[#7280a3]">{order.description}</p>
                    <div className="mt-2 flex gap-4 text-xs text-[#596383]">
                      <p>Price: <span className="font-medium">${order.price.toFixed(2)}</span></p>
                      <p>Quantity: <span className="font-medium">{order.quantity}</span></p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="inline-flex rounded-full bg-[#42aa7d] px-3 py-1 text-xs text-white">{order.status}</p>
                    <button onClick={() => openReview(order.id)} className="mt-3 block text-xs text-[#8792b5] underline">
                      Leave a Review
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <WebsiteFooter />

      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/40 p-3">
          <div className="w-full max-w-[620px] rounded-[20px] bg-[#f2f2f2] p-4 sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-4xl font-medium">Leave A Review</h2>
              <button onClick={() => setIsReviewOpen(false)} className="rounded-full bg-white p-2"><X size={16} /></button>
            </div>

            <form onSubmit={submitReview}>
              <div className="mb-3 flex gap-1 text-[#f4b000]">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starValue = idx + 1;
                  return (
                    <button key={starValue} type="button" onClick={() => setRating(starValue)}>
                      <Star size={24} fill={starValue <= rating ? "currentColor" : "none"} />
                    </button>
                  );
                })}
              </div>
              <p className="mb-2 text-xs text-[#6f7696]">Type your review</p>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Loisbeck03@gmail.com"
                className="h-28 w-full rounded-xl border border-[#dce1f1] bg-[#f6f7fb] p-3 text-sm outline-none"
              />
              <button type="submit" className="mt-4 h-11 w-full rounded-full bg-[#7f8cf8] text-sm font-medium text-white">Submit</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
