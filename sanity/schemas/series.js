// Sanity Schema: 系列（多品牌 × 多系列 的组织维度）
export default {
  name: "series",
  title: "Series",
  type: "document",
  fields: [
    { name: "name", title: "Series Name", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "brand", title: "Brand", type: "reference", to: [{ type: "brand" }] },
    { name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } },
    { name: "positioning", title: "Positioning", type: "string",
      description: "如：入门走量款 / 中端主力 / 高端定制" },
    { name: "story", title: "Series Story", type: "array", of: [{ type: "block" }] },
    { name: "designNotes", title: "Design & Material Notes", type: "text", rows: 4 },
    { name: "targetBuyers", title: "Target Buyers", type: "array", of: [{ type: "string" }],
      description: "如：精品酒店采购 / 室内设计工作室 / 家具零售商" },
    { name: "priceBand", title: "Price Band", type: "string",
      description: "如：$150 - $600 FOB" },
  ],
  preview: { select: { title: "name", subtitle: "positioning", media: "coverImage" } },
};
