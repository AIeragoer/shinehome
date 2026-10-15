import Link from "next/link";

export const metadata = { title: "Inquiry Received — ShineHome" };

export default function InquirySuccessPage() {
  return (
    <div className="inquiry-page" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 8 }}>✓</div>
      <h1 style={{ marginBottom: 12 }}>Inquiry Received</h1>
      <p style={{ fontFamily: "Helvetica, sans-serif", fontSize: 15, color: "#666", lineHeight: 1.8 }}>
        Thank you — a confirmation email is on its way to your inbox.<br />
        Our export team will reply with pricing, MOQ and shipping options <b>within 24 hours</b>.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 28 }}>
        <Link href="/products" className="btn btn-outline">Continue Browsing</Link>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </div>
  );
}
