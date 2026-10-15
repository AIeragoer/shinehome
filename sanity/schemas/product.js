// Sanity Schema: 产品（2000+ SKU 主体）
// 放置于 Sanity Studio 的 schemas 目录，导入后即可在后台建 2000 个产品

export default {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    { name: "name", title: "Product Name", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (R) => R.required() },
    { name: "sku", title: "SKU", type: "string", validation: (R) => R.required() },
    { name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] },
    { name: "series", title: "Series", type: "reference", to: [{ type: "series" }] },
    { name: "category", title: "Category", type: "string",
      options: { list: ["Sofa", "Lounge Chair", "Dining Chair", "Coffee Table", "Dining Table", "Lighting", "Cabinet"] } },

    // —— 结构与规格（B2B 买家最看重）——
    { name: "material", title: "Primary Material", type: "string" },
    { name: "materialDetail", title: "Material Spec", type: "text", rows: 2,
      description: "例：1.2mm 全粒面苯胺革，密度 35D 高回弹海绵，实木榉木框架" },
    { name: "color", title: "Color / Finish", type: "string" },
    { name: "dimensions", title: "Dimensions (W×D×H)", type: "string" },
    { name: "weight", title: "Weight (kg)", type: "number" },
    { name: "loadCapacity", title: "Load Capacity", type: "string" },

    // —— 交易条件 ——
    { name: "fobPrice", title: "FOB Price (USD)", type: "number" },
    { name: "priceRange", title: "Price Range (display)", type: "string",
      description: "展示用，如 $120 - $380 (tiered by qty)" },
    { name: "moq", title: "MOQ (pcs)", type: "number", initialValue: 10 },
    { name: "leadTime", title: "Lead Time", type: "string", initialValue: "30 days" },
    { name: "customization", title: "Customization Options", type: "array", of: [{ type: "string" }],
      description: "如：定制尺寸 / 换面料 / 换色卡 / 加 Logo" },

    // —— 内容（4 张差异化填充卡）——
    { name: "shortDescription", title: "Short Description", type: "text", rows: 3,
      description: "① 1–2 句产品定位，用于列表页与 meta description" },
    { name: "sellingPoints", title: "Selling Points", type: "array", of: [{ type: "string" }],
      description: "② 3–5 条独有卖点，如 'CATAS 认证框架，商用 5 年质保'" },
    { name: "applications", title: "Best For", type: "array", of: [{ type: "string" }],
      description: "③ 适配场景：精品酒店 / 咖啡厅 / 高端住宅 / 办公接待" },
    { name: "careGuide", title: "Care & Maintenance", type: "text", rows: 3,
      description: "④ 保养说明，提升专业度，也利于 SEO 长尾词" },

    // —— 富媒体 ——
    { name: "coverImage", title: "Cover Image (White BG)", type: "image", options: { hotspot: true } },
    { name: "lifestyleImage", title: "Lifestyle Image", type: "image", options: { hotspot: true } },
    { name: "dimensionImage", title: "Dimension Drawing", type: "image" },
    { name: "gallery", title: "Gallery", type: "array", of: [{ type: "image" }] },
    { name: "specSheet", title: "Spec Sheet (PDF)", type: "file",
      description: "买家可下载的规格书，是重要的留资钩子" },

    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: false },
    { name: "seo", title: "SEO", type: "object", fields: [
      { name: "metaTitle", title: "Meta Title", type: "string" },
      { name: "metaDescription", title: "Meta Description", type: "text", rows: 2 },
      { name: "keywords", title: "Keywords", type: "array", of: [{ type: "string" }] },
    ]},
  ],
  preview: {
    select: { title: "name", subtitle: "sku", media: "coverImage" },
  },
};
