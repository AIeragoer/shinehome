import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCompanyPages, getCompanyPage } from "@/lib/content";

// 单一模板渲染 7 个信任页（About / Factory / QC / Certifications / OEM / Logistics / After-Sales）
// 避免复制 7 份几乎相同的代码——内容变了只改 JSON。
export async function generateStaticParams() {
  return getAllCompanyPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const p = getCompanyPage(params.slug);
  if (!p) return {};
  return {
    title: `${p.title} | ShineHome`,
    description: p.intro?.slice(0, 155),
  };
}

export default function CompanyPage({ params }) {
  const p = getCompanyPage(params.slug);
  if (!p) notFound();
  const others = getAllCompanyPages().filter((x) => x.slug !== params.slug);

  return (
    <article className="container" style={{ maxWidth: 820, paddingTop: 56 }}>
      <p style={{ letterSpacing: 3, fontSize: 12, color: "#b5651d", fontFamily: "Helvetica, sans-serif" }}>
        {p.pageType?.toUpperCase()}
      </p>
      <h1 style={{ fontSize: 36, margin: "8px 0 20px" }}>{p.title}</h1>
      <p style={{ fontSize: 19, lineHeight: 1.7, color: "#444", borderLeft: "3px solid #b5651d", paddingLeft: 18 }}>
        {p.intro}
      </p>

      {p.keyFacts?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, margin: "36px 0" }}>
          {p.keyFacts.map((f) => (
            <div key={f.label} style={{ background: "#fff", border: "1px solid #e5ddd0", borderRadius: 6, padding: 16, textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: 22, color: "#b5651d" }}>{f.value}</strong>
              <span style={{ fontSize: 12, fontFamily: "Helvetica, sans-serif", color: "#777" }}>{f.label}</span>
            </div>
          ))}
        </div>
      )}

      {p.body?.map((para, i) => (
        <p key={i} style={{ marginTop: 18, fontSize: 16.5, lineHeight: 1.85 }}>{para}</p>
      ))}

      <div style={{ background: "#fff", border: "1px solid #e5ddd0", borderRadius: 8, padding: 28, margin: "44px 0", textAlign: "center" }}>
        <h3 style={{ marginBottom: 10 }}>Ready to talk specifications?</h3>
        <p style={{ fontFamily: "Helvetica, sans-serif", fontSize: 14, color: "#666", marginBottom: 18 }}>
          Send us your SKU list or reference photos — we reply within 24 hours.
        </p>
        <Link href="/inquiry" className="btn btn-primary">Request a Quote</Link>
      </div>

      <nav style={{ borderTop: "1px solid #e5ddd0", paddingTop: 20, fontFamily: "Helvetica, sans-serif", fontSize: 14 }}>
        {others.map((o) => (
          <Link key={o.slug} href={`/${o.slug}`} style={{ marginRight: 18, color: "#b5651d" }}>{o.title}</Link>
        ))}
      </nav>
    </article>
  );
}
