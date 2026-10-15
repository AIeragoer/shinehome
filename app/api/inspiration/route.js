// Furnipedia 灵感搜索代理（App Router：Web Response API）
// - API key 只存服务端（Vercel 环境变量 / 本地 .env.local）
// - 内存缓存：同一搜索词 24h 内直接返回缓存，节省 API 额度
//   （Furnipedia 免费层仅 20 次/月；生产建议升级 Pro/Ultra）

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h
const cache = new Map(); // key: query+limit -> {t, data}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export async function POST(req) {
  const { q, limit = 12 } = await req.json().catch(() => ({}));
  if (!q || typeof q !== "string" || q.trim().length < 2)
    return json({ error: "q (search text) is required" }, 400);

  const apiKey = process.env.FURNIPEDIA_API_KEY;
  if (!apiKey) return json({ error: "FURNIPEDIA_API_KEY not configured" }, 500);

  const cacheKey = `${q.trim().toLowerCase()}|${limit}`;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.t < CACHE_TTL) {
    return json({ ...hit.data, cached: true });
  }

  try {
    const upstream = await fetch("https://furnipedia.top/api/v1/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ q: q.trim(), limit: Math.min(parseInt(limit, 10) || 12, 20) }),
    });

    if (upstream.status === 429) {
      return json({ error: "API quota exceeded — upgrade plan or retry later" }, 429);
    }
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return json({ error: `Upstream error ${upstream.status}`, detail: text.slice(0, 300) }, 502);
    }

    const data = await upstream.json();
    const max = Math.min(parseInt(limit, 10) || 12, 20);
    const results = (data.results || []).slice(0, max).map((r) => ({
      id: r.id,
      name: r.name,
      brand: r.brand,
      category: r.category,
      year: r.year,
      image: r.image,
    }));
    const payload = { query: data.query || q, total: data.count ?? results.length, results };
    cache.set(cacheKey, { t: Date.now(), data: payload });
    return json(payload);
  } catch (e) {
    console.error("inspiration search error:", e);
    return json({ error: "Search failed" }, 502);
  }
}
