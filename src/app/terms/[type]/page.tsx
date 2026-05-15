"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RouteHeader from "@/app/components/RouteHeader";
import WebsiteFooter from "@/app/components/WebsiteFooter";

type TermsData = {
  title: string;
  paragraphs: string[];
};

export default function TermsByTypePage() {
  const params = useParams<{ type: string }>();
  const type = Array.isArray(params?.type) ? params.type[0] : params?.type;
  const [content, setContent] = useState<TermsData | null>(null);

  useEffect(() => {
    if (!type) return;
    const load = async () => {
      const res = await fetch(`/api/mock/terms?type=${type}`, { cache: "no-store" });
      const json = await res.json();
      setContent(json?.data ?? null);
    };
    load();
  }, [type]);

  return (
    <main className="min-h-screen bg-[#dfe4f2] text-[#2e3550]">
      <div className="px-3 pt-3">
        <RouteHeader activeItem="Membership Pass" />

        <section className="mx-auto mt-5 w-full max-w-[1240px] rounded-2xl bg-[#f4f6ff] p-4 pb-10 sm:p-8 mb-5">
          <h1 className="text-center text-4xl font-medium">{content?.title ?? "Terms & Conditions"}</h1>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[#5c6585] sm:text-base">
            {(content?.paragraphs ?? []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>
      </div>
      <WebsiteFooter />
    </main>
  );
}
