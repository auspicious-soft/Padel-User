"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { getUserMembershipsService, purchaseUserMembershipService } from "@/services/admin-services";
import { toast } from "sonner";

type MembershipFeature = {
  key: string;
  value: string | number | boolean;
};

type Membership = {
  _id: string;
  name: string;
  price: number;
  duration: string;
  status: string;
  discount: number;
  discountType: string;
  maxBookingPerDay: number;
  features: MembershipFeature[];
  description: string;
  image: string;
};

export default function MembershipPassPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const currentMembership = memberships[0] ?? null;
  const membershipImage = currentMembership?.image || "/assets/Rectangle.png";
  const isExternalMembershipImage = membershipImage.startsWith("http");

  const featureRows = useMemo(() => {
    return (currentMembership?.features ?? []).map((feature) => {
      const label = feature.key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (m) => m.toUpperCase())
        .trim();
      const withPass =
        typeof feature.value === "boolean"
          ? feature.value
            ? "Yes"
            : "No"
          : String(feature.value);

      return {
        feature: label,
        withoutPass: "No",
        withPass,
      };
    });
  }, [currentMembership]);

  const loadMemberships = async () => {
    setLoading(true);
    try {
      const res = await getUserMembershipsService();
      const list = (res?.data?.data ?? []) as Membership[];
      setMemberships(list);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to fetch memberships.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseMembership = async () => {
    if (!currentMembership?._id) {
      toast.error("No membership available to purchase.");
      return;
    }

    setPurchasing(true);
    try {
      const res = await purchaseUserMembershipService({ membershipId: currentMembership._id });
      toast.success(res?.data?.message ?? "Membership purchased successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Failed to purchase membership.");
    } finally {
      setPurchasing(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, []);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-4 w-full">
          <article className="relative overflow-hidden rounded-2xl pb-10">
            <Image src="/assets/bgImg1.png" alt="Membership banner" width={1240} height={840} className="h-[380px] w-full object-cover object-right sm:h-[380px] md:object-right" />
            <div className="absolute inset-0 mx-10 max-w-[400px] py-16 md:mx-20 md:py-14">
              <h1 className="rasputin text-2xl font-normal text-white sm:text-4xl md:max-w-[780px] md:text-5xl">Save more every time you play</h1>
              <p className="mt-4.5 max-w-[560px] text-xs leading-7 text-[#dde6ff] sm:text-sm sm:leading-7">
                The Membership Pass gives you discounted pricing on every slot you book. No changes to how you book - you just pay less.
              </p>
              <button
                type="button"
                disabled={purchasing || loading || !currentMembership}
                onClick={handlePurchaseMembership}
                className="mt-4.5 inline-flex cursor-pointer items-center gap-2 rounded-3xl bg-white px-7 py-2.5 text-base font-semibold text-[#848EFF] outline outline-1 outline-offset-[-1px] outline-[#848EFF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Get Membership Pass
              </button>
            </div>
          </article>

          <div className="mx-auto mt-7 grid max-w-[1240px] gap-6 px-4 pb-5 sm:px-6 md:grid-cols-[1fr_1.65fr] lg:px-8">
            {isExternalMembershipImage ? (
              <img
                src={membershipImage}
                alt="Membership"
                className="h-[200px] w-full rounded-2xl object-cover md:h-full md:w-full"
              />
            ) : (
              <Image
                src={membershipImage}
                alt="Membership"
                width={600}
                height={400}
                className="h-[200px] w-full rounded-2xl object-cover md:h-full md:w-full"
              />
            )}

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div className="w-full">
                <h3 className="rasputin mt-4 w-full text-4xl font-normal capitalize text-[#848EFF]">Pricing & Membership Pass</h3>
                <div className="mt-6 w-full rounded-[20px] border border-[#8793ff] bg-white">
                  <div className="grid grid-cols-3 border-b border-[#e9ecff] px-4 py-4 text-xs text-[#7a84a0] sm:px-7 sm:text-sm">
                    <p>Feature</p>
                    <p>Without Pass</p>
                    <p className="rounded-xl bg-[#7f8cf8] px-3 py-1 text-center text-white">Project Play Pass</p>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center px-4 py-10 sm:px-7">
                      <Loader2 className="h-5 w-5 animate-spin text-[#596086]" />
                    </div>
                  )}

                  {!loading &&
                    featureRows.map((row) => (
                      <div key={row.feature} className="grid grid-cols-3 border-b border-[#eef0ff] px-4 py-3 text-xs text-[#36435c] last:border-b-0 sm:px-7 sm:text-sm">
                        <p className="font-semibold">{row.feature}</p>
                        <p>{row.withoutPass}</p>
                        <p>{row.withPass}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-[1240px] gap-10 px-4 pb-16 sm:px-6 md:grid-cols-[1.5fr_1.65fr] md:px-8">
            <div className="overflow-hidden rounded-2xl">
              <Image src="/assets/Image1.png" alt="Membership benefit" width={600} height={340} className="h-[350px] w-full rounded-2xl object-cover md:h-full md:w-full" />
            </div>

            <article className="rounded-2xl">
              <h3 className="rasputin text-4xl font-normal text-[#848EFF]">Pricing & Membership Pass</h3>
              <div
                className="mt-3 text-sm leading-6 text-[#5f6888]"
                dangerouslySetInnerHTML={{
                  __html:
                    currentMembership?.description ||
                    "<p>The Membership Pass gives you discounted pricing on every slot you book. You still book slots the same way, join as an individual, and see prices upfront - you simply pay less each time you play. It is optional and designed for players who play regularly.</p>",
                }}
              />
              <button
                type="button"
                disabled={purchasing || loading || !currentMembership}
                onClick={handlePurchaseMembership}
                className="mt-3.5 inline-flex cursor-pointer items-center gap-2 rounded-3xl bg-white px-7 py-2.5 text-base font-semibold text-[#848EFF] outline outline-1 outline-offset-[-1px] outline-[#848EFF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {purchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Get Membership Pass
              </button>
            </article>
          </div>
        </section>
      </div>

      <WebsiteFooter />
    </main>
  );
}
