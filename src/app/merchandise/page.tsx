"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { getUserProductsService, getUserVenuesService } from "@/services/admin-services";
import { toast } from "sonner";

type Product = {
  _id: string;
  name: string;
  price: number;
  discountedPrice: number;
  images: string[];
  productDescription: string;
  inStock: boolean;
  totalQuantity: number;
};

type Venue = {
  _id: string;
  name: string;
};

export default function MerchandisePage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingVenues, setLoadingVenues] = useState(false);

  const loadProducts = async (searchValue: string, venueId: string, isSearch = false) => {
    if (!venueId) return;
    if (isSearch) setLoadingSearch(true);
    else setLoading(true);

    try {
      const res = await getUserProductsService({
        venueId,
        search: searchValue.trim() || undefined,
      });
      setProducts((res?.data?.data ?? []) as Product[]);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch products.");
    } finally {
      if (isSearch) setLoadingSearch(false);
      else setLoading(false);
    }
  };

  const loadVenues = async () => {
    setLoadingVenues(true);
    try {
      const res = await getUserVenuesService();
      const venueList = (res?.data?.data ?? []) as Venue[];
      setVenues(venueList);
      if (venueList.length > 0) {
        setSelectedVenueId(venueList[0]._id);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch venues.");
    } finally {
      setLoadingVenues(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    if (!selectedVenueId) return;
    loadProducts(search, selectedVenueId);
  }, [selectedVenueId]);

  useEffect(() => {
    if (!selectedVenueId) return;
    const timeoutId = setTimeout(() => {
      loadProducts(search, selectedVenueId, true);
    }, 450);
    return () => clearTimeout(timeoutId);
  }, [search, selectedVenueId]);

  const hasProducts = useMemo(() => products.length > 0, [products]);

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
                className="h-9 w-full rounded-full border border-[#d1d8ee] bg-white px-4 text-sm outline-none sm:w-[220px]"
              />
              <select
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                disabled={loadingVenues || venues.length === 0}
                className="h-9 w-full rounded-full border border-[#d1d8ee] bg-white px-4 text-sm text-[#4f5877] outline-none sm:w-[220px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {venues.length === 0 && <option value="">No venues found</option>}
                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(loading || loadingSearch) && (
            <div className="mb-4 flex items-center gap-2 text-sm text-[#6f7695]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const primaryImage = product.images?.[0] || "/assets/Rectangle.png";
              return (
                <article key={product._id} className="rounded-[10px] bg-[#f7f9ff] p-[10px] shadow-sm">
                  <Link href={`/merchandise/${product._id}`} className="block w-full text-left">
                    <img src={primaryImage} alt={product.name} className="h-[220px] w-full rounded-lg object-cover" />
                    <h3 className="mt-2 text-[18px] leading-6 font-normal text-[#6f7ef7]">{product.name}</h3>
                    <p className="mt-1 line-clamp-3 text-[10px] leading-4 text-[#7b85a7]">{product.productDescription || "-"}</p>
                  </Link>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] text-[#7f86a3] line-through">${Number(product.price || 0).toFixed(2)}</span>
                      <span className="text-[16px] font-medium text-[#1b223f]">${Number(product.discountedPrice || product.price || 0).toFixed(2)}</span>
                    </div>
                    <Link href={`/merchandise/${product._id}`} className="rounded-full bg-[#848EFF] px-5 py-2 text-[10px] font-semibold text-white">
                      Buy Now
                    </Link>
                  </div>
                  <p className={`mt-2 text-xs ${product.inStock ? "text-[#2f9760]" : "text-[#d64567]"}`}>
                    {product.inStock ? `In stock (${product.totalQuantity})` : "Out of stock"}
                  </p>
                </article>
              );
            })}
          </div>

          {!loading && !loadingSearch && !hasProducts && (
            <p className="mt-6 text-center text-sm text-[#6f7695]">No products found.</p>
          )}
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
