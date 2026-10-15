// Sanity Schema: 品牌（承载品牌故事，驱动 /brands/[slug] 页面）
export default {
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    { name: "name", title: "Brand Name", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "logo", title: "Logo", type: "image" },
    { name: "origin", title: "Design Origin", type: "string",
      description: "如：Denmark / Italy / Japan —— 用于突出设计血统" },
    { name: "eraStyle", title: "Era & Style", type: "string",
      description: "如：Mid-century Modern, 1958" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "story", title: "Brand Story", type: "array",
      of: [{ type: "block" }],
      description: "品牌故事富文本：设计理念 / 标志性单品 / 为什么值得引入" },
    { name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } },
    { name: "signaturePieces", title: "Signature Pieces", type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }] },
    { name: "series", title: "Series in this Brand", type: "array",
      of: [{ type: "reference", to: [{ type: "series" }] }] },
    { name: "seo", title: "SEO", type: "object", fields: [
      { name: "metaTitle", title: "Meta Title", type: "string" },
      { name: "metaDescription", title: "Meta Description", type: "text", rows: 2 },
    ]},
  ],
  preview: { select: { title: "name", subtitle: "tagline", media: "logo" } },
};
