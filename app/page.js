import Link from "next/link";
import { facets, products } from "@/lib/products";

export default function Home() {
  const featured = products.slice(0, 8);
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Premium Replica Furniture, Factory Direct</h1>
          <p>2000+ SKUs across iconic mid-century & contemporary designs. Built for retailers, interior designers and hospitality projects worldwide.</p>
          <Link href="/inquiry" className="btn btn-primary">Request a Quote</Link>
          <div className="stats">
            <div><strong>2,000+</strong>SKUs in production</div>
            <div><strong>MOQ 10</strong>pcs per design</div>
            <div><strong>30 days</strong>average lead time</div>
            <div><strong>40+</strong>export countries</div>
          </div>
        </div>
      </section>

      <div className="container">
        <h2 className="section-title">Featured Pieces</h2>
        <div className="grid">
          {featured.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
    </>
  );
}

export function ProductCard({ p }) {
  return (
    <Link href={`/products/${p.slug}`} className="card">
      <div className="card-thumb">{p.brand.toUpperCase()} · {p.category.toUpperCase()}</div>
      <div className="card-body">
        <div className="tag">{p.brand} · {p.series}</div>
        <h3>{p.name}</h3>
        <div className="card-meta">
          <span>FOB {p.fobPrice}</span>
          <span>MOQ {p.moq}</span>
        </div>
      </div>
    </Link>
  );
}
