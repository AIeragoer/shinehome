"use client";

import { useState } from "react";

// 设计灵感库（Furnipedia 语义搜索）
// 客户描述想要的风格 → 返回全球设计参考 → 一键询盘复刻同款

const PRESETS = [
  "Mid century leather sofa",
  "Old-money armchair",
  "French-chinoiserie sideboard",
  "Bauhaus floor lamp",
  "Art Deco dining table",
  "Curved bouclé sofa",
  "Italian velvet lounge chair",
  "Walnut cabinet mid century",
];

export default function InspirationPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function search(query) {
    const text = (query ?? q).trim();
    if (text.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inspiration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, limit: 12 }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Search failed, please try again.");
        setData(null);
      } else {
        setData(json);
      }
    } catch {
      setError("Network error, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <p style={{ letterSpacing: 3, fontSize: 12, color: "#b5651d", fontFamily: "Helvetica, sans-serif" }}>
          DESIGN INSPIRATION LIBRARY
        </p>
        <h1 style={{ fontSize: 34, margin: "8px 0 12px" }}>Find a Design. We Replicate It.</h1>
        <p style={{ fontFamily: "Helvetica, sans-serif", fontSize: 15, color: "#666" }}>
          Search 150,000+ iconic designs by style, era or scene — then request a factory quote for your own replica version.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, maxWidth: 680, margin: "28px auto 12px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder='e.g. "mid century leather sofa"'
          style={{ flex: 1, padding: "12px 16px", border: "1px solid #d8d0c2", borderRadius: 6, fontSize: 15 }}
        />
        <button onClick={() => search()} className="btn btn-primary" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 760, margin: "0 auto" }}>
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => { setQ(p); search(p); }}
            style={{
              padding: "6px 14px", borderRadius: 20, border: "1px solid #d8d0c2", background: "#fff",
              fontSize: 13, fontFamily: "Helvetica, sans-serif", cursor: "pointer", color: "#555",
            }}
          >{p}</button>
        ))}
      </div>

      {error && (
        <p style={{ textAlign: "center", color: "#a33", fontFamily: "Helvetica, sans-serif", marginTop: 24 }}>{error}</p>
      )}

      {data && (
        <>
          <p style={{ textAlign: "center", fontFamily: "Helvetica, sans-serif", fontSize: 13, color: "#8a7a63", margin: "28px 0 0" }}>
            {data.total} designs found for "{data.query}" {data.cached ? "· cached" : ""}
          </p>
          <div className="grid">
            {(data.results || []).map((r) => (
              <div key={r.id} className="card">
                {r.image && (
                  <img
                    src={r.image}
                    alt={r.name}
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                )}
                <div className="card-body">
                  <div className="tag">{r.brand}{r.year ? ` · ${r.year}` : ""}</div>
                  <h3 style={{ fontSize: 15, lineHeight: 1.4 }}>{r.name}</h3>
                  <a
                    href={`/inquiry?ref=${encodeURIComponent(`${r.name} (${r.brand}, ${r.year || "n/a"}) — design reference: ${r.image || ""}`)}`}
                    className="btn btn-outline"
                    style={{ display: "block", textAlign: "center", marginTop: 12, fontSize: 13 }}
                  >Request a Replica Quote</a>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontFamily: "Helvetica, sans-serif", fontSize: 11, color: "#aaa", paddingBottom: 24 }}>
            Design references indexed by Furnipedia. All designs belong to their original brands — ShineHome manufactures replica versions for wholesale.
          </p>
        </>
      )}

      {!data && !loading && !error && (
        <p style={{ textAlign: "center", fontFamily: "Helvetica, sans-serif", color: "#999", marginTop: 48 }}>
          Try one of the style tags above, or describe what you need.
        </p>
      )}
    </div>
  );
}
