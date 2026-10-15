import Link from "next/link";
import { facets, filterProducts } from "@/lib/products";
import { ProductCard } from "../page";

export const metadata = { title: "Products — ShineHome" };

export default async function ProductsPage({ searchParams }) {
  const { brand, category, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || "1", 10);
  const { items, total } = filterProducts({ brand, category, page });

  const qs = (extra) => {
    const sp = new URLSearchParams();
    if (brand) sp.set("brand", brand);
    if (category) sp.set("category", category);
    if (extra) sp.set("page", extra);
    return `/products${sp.toString() ? "?" + sp.toString() : ""}`;
  };
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="container">
      <div className="filters">
        <Link href="/products" className={!brand && !category ? "active" : ""}>All ({2048})</Link>
        {facets.brands.map((b) => (
          <Link key={b} href={`/products?brand=${encodeURIComponent(b)}`} className={brand === b ? "active" : ""}>{b}</Link>
        ))}
        {facets.categories.map((c) => (
          <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className={category === c ? "active" : ""}>{c}</Link>
        ))}
      </div>
      <p style={{ marginTop: 16, fontFamily: "Helvetica, sans-serif", fontSize: 13, color: "#8a7a63" }}>
        {total} products{brand ? ` · ${brand}` : ""}{category ? ` · ${category}` : ""}
      </p>
      <div className="grid">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      <div className="pager">
        {page > 1 && <Link href={qs(page - 1)}>← Prev</Link>}
        <span style={{ padding: "8px 0", fontSize: 13 }}>Page {page} / {totalPages}</span>
        {page < totalPages && <Link href={qs(page + 1)}>Next →</Link>}
      </div>
    </div>
  );
}
