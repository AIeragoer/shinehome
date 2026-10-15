import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, products } from "@/lib/products";
import { buildProductCopy } from "@/lib/copywriter";
import { getBrand } from "@/lib/content";
import { ProductCard } from "../../page";

export async function generateStaticParams() {
  // 2000+ SKU 全量 ISR；也可仅返回前 N 个热门页，其余按需生成
  return products.slice(0, 200).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getProduct(params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.category} Replica Wholesale | ShineHome`,
    description: `${p.name} in ${p.material}. FOB from ${p.fobPrice}, MOQ ${p.moq} pcs, ${p.leadTime} lead time. Custom sizes and finishes available. Request a quote.`,
  };
}

export default async function ProductDetail({ params }) {
  const p = getProduct(params.slug);
  if (!p) notFound();

  const copy = buildProductCopy(p);
  const brand = getBrand(p.brand.toLowerCase().replace(/\s+/g, "-"));
  const related = products
    .filter((x) => x.series === p.series && x.slug !== p.slug)
    .slice(0, 4);

  return (
    <div className="container">
      <div className="detail">
        <div className="detail-img">{p.brand.toUpperCase()} · PRODUCT PHOTO</div>
        <div className="detail-info">
          <h1>{p.name}</h1>
          <div className="sku">SKU: {p.sku} · {p.brand} · {p.series} Collection</div>

          {/* L2 生成文案：短描述 + 卖点 */}
          <p style={{ fontSize: 16.5, lineHeight: 1.75 }}>{copy.shortDescription}</p>

          <table className="spec">
            <tbody>
              <tr><td>Material</td><td>{p.material}</td></tr>
              <tr><td>Color</td><td>{p.color}</td></tr>
              <tr><td>Dimensions</td><td>{p.dimensions}</td></tr>
              <tr><td>FOB Price</td><td>{p.fobPrice} / pc</td></tr>
              <tr><td>MOQ</td><td>{p.moq} pcs</td></tr>
              <tr><td>Lead Time</td><td>{p.leadTime}</td></tr>
              <tr><td>Warranty</td><td>5-year commercial use</td></tr>
            </tbody>
          </table>

          <h3 style={{ marginTop: 24 }}>Why This Piece</h3>
          <ul style={{ paddingLeft: 20, fontSize: 15, lineHeight: 1.9 }}>
            {copy.sellingPoints.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <h3 style={{ marginTop: 20 }}>Best For</h3>
          <p style={{ fontSize: 15, color: "#555" }}>{copy.applications.join(" · ")}</p>

          <h3 style={{ marginTop: 20 }}>Care & Maintenance</h3>
          <p style={{ fontSize: 15, color: "#555" }}>{copy.careGuide}</p>

          {brand && (
            <p style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid #eee5d8", fontSize: 15 }}>
              Part of the <b>{brand.name}</b> collection — {brand.tagline}.{" "}
              <Link href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, "-")}`} style={{ color: "#b5651d" }}>
                Read the design story →
              </Link>
            </p>
          )}

          <div className="form-panel">
            <h3>Request Wholesale Pricing</h3>
            <form action="/api/inquiry" method="post">
              <input name="name" placeholder="Your name *" required />
              <input name="email" type="email" placeholder="Business email *" required />
              <input name="company" placeholder="Company name" />
              <input name="product" value={`${p.name} (${p.sku})`} readOnly />
              <textarea name="message" rows="3" placeholder="Quantity, target market, questions..."></textarea>
              <button className="btn btn-primary" type="submit">Send Inquiry</button>
            </form>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="section-title">More from the {p.series} Collection</h2>
          <div className="grid">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}
