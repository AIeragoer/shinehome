// SKU 文案生成器 —— 解决 2000 个产品详情页"内容空洞"的问题
// 核心思路：组合式文案。按 系列 × 材质 × 品类 三个维度拼接可复用段落，
// 再叠加该 SKU 独有的 sellingPoints / applications，避免逐条手写，
// 又避免 2000 个页面完全雷同（对 SEO 致命）。

// ============ 1. 材质段落库 ============
const MATERIAL_COPY = {
  "Top-grain Italian Leather": {
    paragraph:
      "Upholstered in top-grain Italian leather — the layer just below the surface, retaining the natural grain and much of the hide's durability. It softens and develops a patina with use rather than cracking, which is why it is the standard for commercial seating that has to look good after five years of daily use.",
    care: "Dust weekly with a dry cloth; condition every 6–12 months with a pH-neutral leather cream. Blot spills immediately — never rub. Keep out of direct sunlight to avoid uneven fading.",
    commercial: "Rated for commercial use with a 5-year structural warranty.",
  },
  "Full-grain Aniline Leather": {
    paragraph:
      "Full-grain aniline leather, dyed through rather than surface-coated. This is the most natural and most expensive grade of leather: the entire grain is intact, so it breathes, ages gracefully, and shows the character of the hide. Minor variation in tone between pieces is a feature of aniline finishing, not a defect.",
    care: "Clean with a soft dry cloth. Avoid silicone-based cleaners and direct sun. Aniline leather will darken and mark naturally with use — this is expected and reversible with professional cleaning.",
    commercial: "Recommended for residential and low-traffic commercial settings; not advised for high-abuse contract use.",
  },
  "Cashmere-Wool Blend": {
    paragraph:
      "A cashmere-wool blend chosen for softness without sacrificing the abrasion resistance required in commercial seating. Wool naturally resists soiling and holds its shape, while the cashmere content gives the surface the tactile quality that customers notice when they sit down — a decisive advantage in a showroom.",
    care: "Vacuum with a soft brush attachment monthly. Rotate cushions to even out wear. Professional dry cleaning for deeper cleaning.",
    commercial: "Tested to 30,000+ Martindale cycles — suitable for contract and hospitality use.",
  },
  "Bouclé Fabric": {
    paragraph:
      "Bouclé — a looped, textured weave that reads as both soft and sculptural. It is one of the most photographed upholstery options in contemporary interiors, which makes it a strong performer in catalogs and online listings. We specify a tightly looped construction so the surface resists pilling under regular use.",
    care: "Vacuum gently with an upholstery attachment. Snag any loose loop with scissors rather than pulling. Professional cleaning recommended.",
    commercial: "Tested to 25,000+ Martindale cycles — suitable for residential and light contract use.",
  },
  "Solid Ash Wood": {
    paragraph:
      "Kiln-dried solid ash — a hardwood with a tight, even grain that takes a matte finish beautifully. Ash is chosen for its dimensional stability and its resistance to the warping that plagues softer timbers in humid climates, which matters when goods travel by sea and land in a different hemisphere.",
    care: "Wipe with a damp cloth and mild soap. Re-oil annually with a hardwax oil to maintain the matte finish. Use coasters under hot and wet items.",
    commercial: "Solid hardwood construction; tested to CATAS-equivalent structural standards.",
  },
  "Walnut Veneer": {
    paragraph:
      "Walnut veneer over a stable engineered substrate. Walnut's deep, figured grain gives a piece weight and warmth that no laminate reproduces convincingly, while the engineered core prevents the seasonal movement that a solid walnut panel would experience.",
    care: "Dust with a soft cloth. Avoid abrasive cleaners and standing water. Re-oil every 12–18 months.",
    commercial: "Engineered substrate with hardwood veneer; suitable for residential and contract interiors.",
  },
  "Brushed Stainless Steel": {
    paragraph:
      "Brushed stainless steel detailing — a directional grain finish that hides fingerprints far better than polished chrome, which matters in hospitality settings where hardware is handled constantly.",
    care: "Wipe with a soft damp cloth along the grain direction. Avoid abrasive pads.",
    commercial: "Corrosion-resistant; suitable for food-service and hospitality environments.",
  },
};

// ============ 2. 品类段落库 ============
const CATEGORY_COPY = {
  "Sofa": {
    intro: "A seating piece designed around real-world use: generous seat depth, supportive but not rigid cushioning, and a frame engineered to stay tight over years of daily sitting.",
    engineering:
      "Frame: kiln-dried solid hardwood with corner-blocked and screwed joinery — not stapled. Suspension: webbed or sinuous spring, matched to the seat geometry so there is no sagging at the front edge. Cushioning: high-resilience foam cores with a fibre wrap, which gives the initial softness customers expect without losing shape.",
    bestFor: "Hotel lobbies and suites, residential living rooms, showroom and reception areas.",
  },
  "Lounge Chair": {
    intro: "A lounge chair lives or dies on its angle. Ours are matched to a reclined but not slumped posture — comfortable for a twenty-minute conversation, not so deep that a guest cannot get out of it.",
    engineering:
      "Frame: solid hardwood with reinforced arm joints, the highest-stress area on any lounge chair. Cushioning: HR foam with a shaped seat, avoiding the flat slab that flattens after a season. Base options: fixed timber, metal sled, or swivel with a return mechanism.",
    bestFor: "Lobby and waiting areas, hotel rooms, reading corners, office reception.",
  },
  "Dining Chair": {
    intro: "The hardest-working chair in any project — moved, stacked, dragged and sat on for hours. We build it for that.",
    engineering:
      "Frame: solid hardwood, corner-blocked at the seat rails and tested with repeated side-load cycles. Seat: shaped to distribute pressure over long dinners. Upholstery: tight-seat construction so no cushion shifts out of place. Optional contract-grade foam and fabric for high-turnover venues.",
    bestFor: "Restaurants and cafés, hotel F&B, residential dining, co-working and conference rooms.",
  },
  "Coffee Table": {
    intro: "A coffee table is the piece guests touch most and inspect closest. Surface quality and edge detail are what separate a good one from a cheap one.",
    engineering:
      "Top: solid hardwood, hardwood veneer, or stone, finished with a hardwax oil or lacquer rated for resistance to water rings and heat. Base: solid timber or metal with adjustable glides to compensate for uneven floors. Edge profile: hand-finished, not raw-sawn.",
    bestFor: "Residential living rooms, hotel suites, lounge areas, showrooms.",
  },
  "Dining Table": {
    intro: "Built to stay flat. The single biggest failure in dining tables is a top that warps or splashes — ours are engineered against it.",
    engineering:
      "Top: solid hardwood with breadboard ends or an engineered core, depending on span, so the panel can move without bowing. Base: solid timber or metal trestle with levelling glides. Finish: hardwax oil or conversion lacquer for real-world spill and heat resistance.",
    bestFor: "Hospitality dining, residential, conference and boardroom tables.",
  },
  "Lighting": {
    intro: "Lighting is the most photographed product category and the easiest to get wrong on compliance. Ours ship with the certification your market requires.",
    engineering:
      "Electrical: wired to destination-market standards (UL for US/CA, CE for EU/UK, SAA for AU/NZ, with plug type matched to your market) — no adapters required. Finish: powder-coated with hand-finished details. Compatibility options for E26/E27/E12 and integrated LED.",
    bestFor: "Restaurants and bars, hotels, residential, retail environments.",
  },
  "Cabinet": {
    intro: "Case goods that hold their doors, drawers and alignment after years of use.",
    engineering:
      "Body: CARB Phase 2 / EPA TSCA Title VI compliant panels, which is a hard requirement for US imports. Hardware: soft-close hinges and full-extension runners rated for [50,000] cycles. Backs: full panels, not stapled hardboard. Interior: adjustable shelving with a durable finish.",
    bestFor: "Residential storage, hotel case goods, office and retail fit-outs.",
  },
};

// ============ 3. 系列段落库 ============
const SERIES_COPY = {
  "Classic": "Classic in our catalog means the silhouette everyone recognises, executed to a commercial standard. These are the designs that photograph well from any angle and that buyers can stock with confidence because someone has already proven the demand.",
  "Modern": "Modern is our response to how people live now: smaller footprints, harder-working rooms, and clients who want a considered look without waiting six months for a European delivery.",
  "Heritage": "Heritage pieces draw on documented mid-century originals — proportions and joinery details that were resolved by hand decades ago and are still the reference point for the category. We preserve the important geometry and upgrade the parts that time has shown to be weaknesses.",
  "Minimal": "Minimal is the hardest aesthetic to manufacture, because there is nothing to hide behind. Every joint, edge and finish is exposed to inspection. This is where in-house production shows its value — the tolerance standards here are not achievable through outsourced assembly.",
  "Art Deco": "Art Deco brings back the era of geometry as decoration: contrasting veneers, stepped forms, and metal detailing used as a feature rather than an afterthought. A strong performer in hospitality and retail interiors where a room needs a focal point.",
};

// ============ 4. 材质 × 品类 合法性约束 ============
// 重要：随机组合会产生荒谬产品（如"全粒面皮革做的灯具"）。
// 生产环境中 CMS 应通过 validation 阻止这类组合；这里在生成层做同样的事。
const CATEGORY_ALLOWED_MATERIALS = {
  "Sofa": ["Top-grain Italian Leather", "Full-grain Aniline Leather", "Cashmere-Wool Blend", "Bouclé Fabric"],
  "Lounge Chair": ["Top-grain Italian Leather", "Full-grain Aniline Leather", "Cashmere-Wool Blend", "Bouclé Fabric"],
  "Dining Chair": ["Top-grain Italian Leather", "Cashmere-Wool Blend", "Bouclé Fabric", "Solid Ash Wood"],
  "Coffee Table": ["Solid Ash Wood", "Walnut Veneer", "Brushed Stainless Steel"],
  "Dining Table": ["Solid Ash Wood", "Walnut Veneer", "Brushed Stainless Steel"],
  "Lighting": ["Brushed Stainless Steel", "Solid Ash Wood", "Walnut Veneer"],
  "Cabinet": ["Walnut Veneer", "Solid Ash Wood", "Brushed Stainless Steel"],
};

/** 品类 × 材质 是否合法 */
export function isMaterialValidForCategory(category, material) {
  const allowed = CATEGORY_ALLOWED_MATERIALS[category];
  return !allowed || allowed.includes(material);
}

// ============ 5. 组装函数 ============
/**
 * 为一个 SKU 生成填充好的四段内容
 * @param {{name,brand,series,category,material,color,moq,leadTime,sku}} product
 * @returns {{shortDescription,sellingPoints,applications,careGuide}}
 */
export function buildProductCopy(product) {
  const cat = CATEGORY_COPY[product.category] || {};
  const mat = MATERIAL_COPY[product.material] || {};
  const seriesText = SERIES_COPY[product.series] || "";

  const shortDescription =
    `${product.name} — ${(cat.intro || "").split(".")[0]}. ${seriesText.split(".")[1] ? seriesText.split(".")[1].trim() + "." : ""} ` +
    `Available ${product.moq} pcs minimum, ${product.leadTime} production.`.trim();

  // 取完整句子而非按字符截断，避免出现半句话
  const firstSentence = (text) => {
    if (!text) return "";
    const m = text.match(/^[^.]*\./);
    return m ? m[0].trim() : text.trim();
  };

  const sellingPoints = [
    cat.engineering ? firstSentence(cat.engineering) : "",
    firstSentence(mat.paragraph),
    mat.commercial || "",
    `Finish: ${product.color}. Custom sizes, leathers and fabrics available on request.`,
    `MOQ ${product.moq} pcs · ${product.leadTime} lead time · FOB pricing with CIF/DDP options.`,
  ].filter(Boolean);

  const applications = (cat.bestFor || "").split(/,\s*/).filter(Boolean);

  const careGuide = mat.care || "";

  return { shortDescription, sellingPoints, applications, careGuide };
}

// 导出供 CMS 批量导入使用
export { MATERIAL_COPY, CATEGORY_COPY, SERIES_COPY };
