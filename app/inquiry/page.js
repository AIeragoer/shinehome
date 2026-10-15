export const metadata = { title: "Request a Quote — ShineHome" };

export default function InquiryPage() {
  return (
    <div className="inquiry-page">
      <h1 style={{ marginBottom: 8 }}>Get a Wholesale Quote</h1>
      <p style={{ fontFamily: "Helvetica, sans-serif", fontSize: 14, color: "#666", marginBottom: 24 }}>
        Tell us what you need. Our export team replies within 24 hours with pricing, MOQ and shipping options.
      </p>
      <div className="form-panel">
        <form action="/api/inquiry" method="post">
          <label>Your name *</label>
          <input name="name" required />
          <label>Business email *</label>
          <input name="email" type="email" required />
          <label>Company</label>
          <input name="company" />
          <label>Country / Market</label>
          <input name="country" placeholder="e.g. United States" />
          <label>Products of interest</label>
          <input name="product" placeholder="SKU / category / link" />
          <label>Message</label>
          <textarea name="message" rows="4" placeholder="Quantity, timeline, customization needs..."></textarea>
          <button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Send Inquiry</button>
        </form>
      </div>
    </div>
  );
}
