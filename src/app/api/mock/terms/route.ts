import { NextRequest, NextResponse } from "next/server";

const CONTENT: Record<string, { title: string; paragraphs: string[] }> = {
  "terms-and-conditions": {
    title: "Terms & Conditions",
    paragraphs: [
      "This website is operated by Project Play. Throughout the site, the terms \"we\", \"us\" and \"our\" refer to Project Play.",
      "By visiting our site and purchasing from us, you engage in our Service and agree to be bound by the following terms.",
      "Bookings are made as individual slots. Availability may change based on demand and venue operations.",
      "Membership pass provides discounted pricing on eligible slots as per current policy.",
      "Cancellations and refunds are subject to timing and venue policies.",
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    paragraphs: [
      "We collect basic account and booking data to provide our services.",
      "We use your information to process bookings, support your account, and improve platform reliability.",
      "We do not sell personal information. Limited sharing may occur with trusted service providers.",
      "You can request data updates or account support through our official support channels.",
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    paragraphs: [
      "Refund requests depend on booking type, cancellation window, and venue terms.",
      "Eligible refunds are initiated to the original payment method.",
      "Membership-related charges may be non-refundable after activation unless required by law.",
      "For support, contact our team with booking details and transaction references.",
    ],
  },
};

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "terms-and-conditions";
  const data = CONTENT[type] ?? CONTENT["terms-and-conditions"];

  return NextResponse.json({ success: true, data });
}
