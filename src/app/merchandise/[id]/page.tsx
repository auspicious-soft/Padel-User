"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Star, X } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { buyUserProductService, getProductReviewsService, getUserProductByIdService, getUserProductsService } from "@/services/admin-services";
import { toast } from "sonner";

type ProductSize = {
  size: string;
  quantity: number;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  discountedPrice: number;
  images: string[];
  productDescription: string;
  sizes?: ProductSize[];
  totalQuantity?: number;
  avgRating?: number;
  totalReviews?: number;
};

type ProductReview = {
  _id: string;
  star: number;
  reviewDescription: string;
  userId?: {
    fullName?: string;
    image?: string;
  };
};

const DEFAULT_VENUE_ID = "69cf41b16ee1f567f46f3c80";

export default function MerchandiseDetailPage() {
  const params = useParams<{ id: string }>();
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [moreProducts, setMoreProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(false);

  const productId = String(params?.id || "");

  const loadProduct = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const [productRes, productsRes, reviewRes] = await Promise.all([
        getUserProductByIdService({ productId, venueId: DEFAULT_VENUE_ID }),
        getUserProductsService({ venueId: DEFAULT_VENUE_ID }),
        getProductReviewsService(productId),
      ]);

      const selected = (productRes?.data?.data ?? null) as Product | null;
      const productList = (productsRes?.data?.data ?? []) as Product[];
      const reviewList = (reviewRes?.data?.data ?? []) as ProductReview[];

      setProduct(selected);
      setMoreProducts(productList.filter((item) => item._id !== productId));
      setReviews(reviewList);
      setActiveImage(selected?.images?.[0] || "/assets/Rectangle.png");
      setSelectedSize(selected?.sizes?.[0]?.size || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const gallery = useMemo(() => product?.images ?? [], [product]);

  const handleBuyNow = async () => {
    if (!product?._id) return;
    if (!selectedSize) {
      toast.error("Please select a size.");
      return;
    }

    setBuying(true);
    try {
      const res = await buyUserProductService({
        productId: product._id,
        venueId: DEFAULT_VENUE_ID,
        productSize: selectedSize,
        quantity,
      });
      toast.success(res?.data?.data?.message ?? "Product purchased successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to purchase product.");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
        <div className="flex min-h-[calc(100vh-60px)] items-center justify-center">
          <RouteHeader activeItem="Merchandise" />
          
          <Loader2 className="h-8 w-8 animate-spin text-[#596086]" />
        </div>
          <WebsiteFooter />
      </main>
    );
  }

  if (!product) {
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

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Merchandise" />

        <section className="mx-auto mt-4 w-full max-w-[1120px] pb-10">
          <article className="mb-5 rounded-[12px] bg-[#f6f8ff] p-3 shadow-sm md:p-4">
            <div className="grid gap-[60px] md:grid-cols-[0.7fr_1fr]">
              <div className="w-full">
                <div className="overflow-hidden rounded-[10px]">
                  <img src={activeImage || "/assets/Rectangle.png"} alt={product.name} className="h-[320px] w-full object-cover" />
                </div>
                <div className="mt-2 grid grid-cols-6 gap-1">
                  {gallery.map((image, idx) => (
                    <button key={`${image}-${idx}`} type="button" onClick={() => setActiveImage(image)} className="overflow-hidden rounded-md border border-[#cad3ed] bg-white">
                      <img src={image} alt={`Product view ${idx + 1}`} className="h-[50px] w-[80px] object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-[31px] leading-none font-normal text-[#6f7ef7]">{product.name}</h2>
                <p className="mt-1 text-base leading-8 text-[#7E7E8A]">{product.productDescription || "-"}</p>
                <button type="button" onClick={() => setIsReviewsOpen(true)} className="mt-3 flex items-center gap-2 text-left">
                  <span className="flex items-center gap-1 text-[#f4b000]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star height={20} width={15} key={idx} size={12} fill={idx < Math.round(product.avgRating || 0) ? "currentColor" : "none"} />
                    ))}
                  </span>
                  <span className="text-sm text-[#7E7E8A]">{(product.avgRating || 0).toFixed(1)} Stars ({product.totalReviews || reviews.length} Reviews)</span>
                </button>

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[13px] text-[#7f86a3] line-through">${Number(product.price || 0).toFixed(2)}</span>
                  <span className="text-[24px] font-medium text-[#1b223f]">${Number(product.discountedPrice || product.price || 0).toFixed(2)}</span>
                </div>

                <p className="mt-4 text-sm font-medium text-[#7E7E8A]">Select Size</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(product.sizes ?? []).map((item) => (
                    <button
                      key={item.size}
                      type="button"
                      onClick={() => setSelectedSize(item.size)}
                      className={`min-w-[76px] rounded-[3px] border px-2 py-1.5 text-sm font-medium ${
                        selectedSize === item.size ? "border-[#6f7ef7] bg-[#eef1ff] text-[#364064]" : "border-[#d7deee] bg-white text-[#576186]"
                      }`}
                    >
                      {item.size}
                    </button>
                  ))}
                </div>

                <p className="mt-4 text-sm font-medium text-[#7E7E8A]">Select Quantity</p>
                <div className="mt-1 inline-flex items-center overflow-hidden rounded-[3px] border border-[#d7deee] bg-white">
                  <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="h-6 w-8 text-xs text-[#5f6683]">
                    -
                  </button>
                  <span className="flex h-6 w-8 items-center justify-center border-x border-[#d7deee] text-sm font-medium text-zinc-800">{quantity}</span>
                  <button type="button" onClick={() => setQuantity((prev) => prev + 1)} className="h-6 w-8 text-xs text-[#5f6683]">
                    +
                  </button>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    disabled={buying}
                    onClick={handleBuyNow}
                    className="inline-flex w-full max-w-[500px] items-center justify-center gap-2 rounded-full bg-[#848EFF] py-2 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Buy It Now
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="rasputin text-3xl font-normal text-[#848EFF]">More Products</h2>
              <Link href="/merchandise" className="rounded-full bg-[#7f8cf8] px-6 py-2 text-sm font-medium text-white">
                View All Products
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {moreProducts.slice(0, 3).map((item) => (
                <article key={item._id} className="rounded-[10px] bg-[#f7f9ff] p-[10px] shadow-sm">
                  <Link href={`/merchandise/${item._id}`} className="block w-full text-left">
                    <img src={item.images?.[0] || "/assets/Rectangle.png"} alt={item.name} className="h-[280px] w-full rounded-lg object-cover" />
                    <h3 className="mt-2 text-[20px] leading-6 font-normal text-[#6f7ef7]">{item.name}</h3>
                    <p className="mt-1 line-clamp-3 text-[9px] leading-4 text-[#7b85a7]">{item.productDescription || "-"}</p>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-[#7f86a3] line-through">${Number(item.price || 0).toFixed(2)}</span>
                      <span className="text-[16px] font-medium text-[#1b223f]">${Number(item.discountedPrice || item.price || 0).toFixed(2)}</span>
                    </div>
                    <Link href={`/merchandise/${item._id}`} className="rounded-full bg-[#848EFF] px-5 py-2 text-[10px] font-semibold text-white">
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
            <button type="button" onClick={() => setIsReviewsOpen(false)} className="absolute right-4 top-4 rounded-full bg-white p-2 text-[#4d5574] shadow" aria-label="Close reviews">
              <X size={18} />
            </button>

            <h2 className="text-3xl font-medium text-[#2f354d]">Reviews</h2>
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-2xl bg-[#dfe6f6] p-4 md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={review.userId?.image || "/assets/defaultProfile.png"} alt={review.userId?.fullName || "User"} className="h-[58px] w-[58px] rounded-full object-cover" />
                      <div>
                        <h3 className="text-2xl font-medium text-[#7a85f5]">{review.userId?.fullName || "User"}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[#f4b000]">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={16} fill={idx < review.star ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-base leading-8 text-[#545c79]">{review.reviewDescription}</p>
                </article>
              ))}
              {reviews.length === 0 && <p className="text-sm text-[#5f6683]">No reviews yet.</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
