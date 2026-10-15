// Sanity Schema: 公司信任页（About / 工厂 / 品控 / 认证 / 物流 / 售后）
// 用 block 富文本 + 模块化组件，便于非技术人员编辑
export default {
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    { name: "title", title: "Page Title", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "pageType", title: "Page Type", type: "string",
      options: { list: ["About", "Factory", "Quality Control", "Certifications", "Logistics", "After-Sales", "FAQ", "Custom OEM"] } },
    { name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } },
    { name: "intro", title: "Intro Paragraph", type: "text", rows: 3 },
    { name: "body", title: "Body", type: "array", of: [
      { type: "block" },
      { type: "image", options: { hotspot: true } },
    ]},
    { name: "keyFacts", title: "Key Facts (数字背书)", type: "array", of: [{
      type: "object", fields: [
        { name: "value", title: "Value", type: "string" },   // 如 "32,000 m²"
        { name: "label", title: "Label", type: "string" },   // 如 "厂房面积"
      ],
    }]},
    { name: "seo", title: "SEO", type: "object", fields: [
      { name: "metaTitle", title: "Meta Title", type: "string" },
      { name: "metaDescription", title: "Meta Description", type: "text", rows: 2 },
    ]},
  ],
  preview: { select: { title: "title", subtitle: "pageType", media: "heroImage" } },
};
