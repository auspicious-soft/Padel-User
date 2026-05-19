"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";
import { getUserSettingsContentService } from "@/services/admin-services";

export default function TermsByTypePage() {
  const params = useParams<{ type: string }>();
  const type = Array.isArray(params?.type) ? params.type[0] : params?.type;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPrivacy = type === "privacy-policy";
  const pageTitle = isPrivacy ? "Privacy Policy" : "Terms & Conditions";

  const mapTypeForApi = (slug?: string) => {
    if (slug === "privacy-policy") return "privacyPolicy" as const;
    return "termsAndCondition" as const;
  };

  useEffect(() => {
    if (!type) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getUserSettingsContentService(mapTypeForApi(type));
        setContent(res?.data?.data ?? "");
      } catch (err: any) {
        setError(err?.response?.data?.message ?? `Failed to fetch ${pageTitle}.`);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type]);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-5 w-full max-w-[1240px] rounded-2xl bg-[#f4f6ff] p-4 pb-10 sm:p-8 mb-5">
          <h1 className="text-center text-4xl font-medium">{pageTitle}</h1>
          {loading && <p className="mt-6 text-sm text-[#5c6585]">Loading content...</p>}
          {error && <p className="mt-6 text-sm text-[#d64567]">{error}</p>}
          <div
            className="terms-html mt-6 space-y-4 text-sm leading-7 text-[#5c6585] sm:text-base"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </section>
      </div>
      <style jsx global>{`
        .terms-html h1 {
          font-size: 2rem;
          font-weight: 500;
          color: #2e3550;
          margin: 0 0 1rem;
        }
        .terms-html h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #394267;
          margin: 1rem 0 0.5rem;
        }
        .terms-html p {
          margin: 0.5rem 0;
        }
        .terms-html ul {
          margin: 0.5rem 0 0.5rem 1rem;
          list-style: disc;
        }
        .terms-html li {
          margin: 0.25rem 0;
        }
      `}</style>
      <WebsiteFooter />
    </main>
  );
}
