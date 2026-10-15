import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllBrands, getBrand } from "@/lib/content";
import { products } from "@/lib/products";
import { ProductCard } from "../../page";

export async function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const b = getBrand(params.slug);
  if (!b) return {};
  return {
    title: `${b.name} — Designer Replica Furniture | ShineHome`,
    description: b.tagline,
  };
}

export default function BrandPage({ params }) {
  const b = getBrand(params.slug);
  if (!b) notFound();
  const pieces = products.filter((p) => p.brand === b.name).slice(0, 8);

  return (
    <>
      <section className="hero" style={{ padding: "80px 0" }}>
        <div className="container">
          <p style={{ letterSpacing: 3, fontSize: 12, opacity: 0.7 }}>{b.origin.toUpperCase()} · {b.eraStyle}</p>
          <h1>{b.name}</h1>
          <p>{b.tagline}</p>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 780, paddingTop: 48 }}>
        <h2>Design Story</h2>
        {b.story.map((para, i) => (
          <p key={i} style={{ marginTop: 16, fontSize: 17, lineHeight: 1.8 }}>{para}</p>
        ))}

        <table className="spec" style={{ marginTop: 32 }}>
          <tbody>
            <tr><td>Design Origin</td><td>{b.origin}</td></tr>
            <tr><td>Era & Style</td><td>{b.eraStyle}</td></tr>
            <tr><td>Price Band</td><td>{b.priceBand}</td></tr>
            <tr><td>Best For</td><td>{b.targetBuyers.join(" · ")}</td></tr>
          </tbody>
        </table>

        <p style={{ marginTop: 32 }}>
          <Link href={`/products?brand=${encodeURIComponent(b.name)}`} className="btn btn-outline">
            Browse all {b.name} pieces →
          </Link>
        </p>
      </div>

      <div className="container">
        <h2 className="section-title">Signature Pieces</h2>
        <div className="grid">
          {pieces.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
    </>
  );
}
