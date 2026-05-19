"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Star, X } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { getUserTransactionsService, postProductReviewService } from "@/services/admin-services";
import { toast } from "sonner";

type TransactionItem = {
  _id: string;
  productId?: {
    _id: string;
    name: string;
  };
  totalPrice: number;
  status: string;
  createdAt: string;
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<TransactionItem[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getUserTransactionsService("product");
      setOrders((res?.data?.data ?? []) as TransactionItem[]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openReview = (productId?: string) => {
    if (!productId) return toast.error("Product not found for review.");
    setActiveProductId(productId);
    setIsReviewOpen(true);
  };

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeProductId) return;
    if (!review.trim()) return toast.error("Please type your review.");

    setSubmittingReview(true);
    try {
      const res = await postProductReviewService({
        productId: activeProductId,
        star: rating,
        reviewDescription: review.trim(),
      });
      toast.success(res?.data?.message ?? "Review submitted.");
      setIsReviewOpen(false);
      setReview("");
      setRating(5);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((item) => item.productId?.name?.toLowerCase().includes(term));
  }, [orders, search]);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="" />

        <section className="mx-auto mt-5 w-full max-w-[1240px] pb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-3xl font-medium">My Orders</h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-9 rounded-full border border-[#cfd6ea] bg-white px-4 text-sm outline-none"
            />
          </div>

          {loading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-[#6f7696]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading orders...
            </div>
          )}

          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <article key={order._id} className="rounded-2xl bg-[#f6f8ff] p-3 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[170px_1fr_auto] md:items-center">
                  <img src="/assets/Rectangle.png" alt={order.productId?.name || "Product"} className="h-[110px] w-full rounded-xl object-cover" />
                  <div>
                    <h2 className="text-lg font-medium text-[#7885ff]">{order.productId?.name || "Product"}</h2>
                    <p className="mt-1 text-xs leading-5 text-[#7280a3]">Order ID: {order._id}</p>
                    <div className="mt-2 flex gap-4 text-xs text-[#596383]">
                      <p>
                        Amount: <span className="font-medium">${Number(order.totalPrice || 0).toFixed(2)}</span>
                      </p>
                      <p>
                        Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <p className="inline-flex rounded-full bg-[#42aa7d] px-3 py-1 text-xs text-white">{order.status}</p>
                    <button onClick={() => openReview(order.productId?._id)} className="mt-3 block text-xs text-[#8792b5] underline">
                      Leave a Review
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!loading && filteredOrders.length === 0 && <p className="mt-5 text-center text-sm text-[#6f7696]">No orders found.</p>}
        </section>
      </div>

      <WebsiteFooter />

      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1120]/40 p-3">
          <div className="w-full max-w-[620px] rounded-[20px] bg-[#f2f2f2] p-4 sm:p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-4xl font-medium">Leave A Review</h2>
              <button onClick={() => setIsReviewOpen(false)} className="rounded-full bg-white p-2">
                <X size={16} />
              </button>
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
                placeholder="Write your review"
                className="h-28 w-full rounded-xl border border-[#dce1f1] bg-[#f6f7fb] p-3 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#7f8cf8] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
