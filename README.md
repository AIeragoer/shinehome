# ShineHome — Headless B2B 复刻家具网站（Next.js + Vercel）

面向海外市场的复刻家具 B2B 外贸站。2000+ SKU · 多品牌多品类多系列 · 询盘获客 + CRM + 邮件营销。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 生产构建（已验证：218 个静态页面全部生成）
```

## 架构

```
访客 → Next.js 14 (Vercel CDN, ISR) → Headless CMS (Sanity/Strapi)
询盘 → /api/inquiry (Vercel 云函数) → HubSpot CRM + Resend 邮件
```

## 目录结构

```
app/
  page.js                    首页（Hero + 数据背书 + 精选产品）
  products/page.js           产品列表（品牌/品类筛选 + 分页）
  products/[slug]/page.js    产品详情 ×2000（内嵌询盘表单 + L2 生成文案 + 系列内链）
  brands/[slug]/page.js      品牌页 ×4（设计故事 + 价格带 + 代表作品）
  (company)/[slug]/page.js   信任页 ×7（About/工厂/品控/认证/OEM/物流/售后）
  inquiry/page.js            独立询盘页
  api/inquiry/route.js       询盘 API：HubSpot 同步 + Resend 自动回执 + 销售通知
lib/
  products.js               模拟数据生成器（2048 SKU，含 品类×材质 合法性约束）
  copywriter.js             L2 文案生成器（7 材质 × 7 品类 × 5 系列 组合）
  content.js                内容读取层（JSON → 页面，替换为 Sanity 查询即可）
content/
  company-pages.json        L4 公司信任页文案（7 页英文成稿）
  brand-stories.json        L3 品牌故事（4 品牌）
  内容填充操作手册.md         ★ 内容怎么填的完整指南
sanity/schemas/             CMS 模型（product / brand / series / page）
```

## 内容体系（四层）

| 层 | 内容 | 位置 |
|---|---|---|
| L1 产品数据 | 2000+ SKU 参数/图/价 | CMS + CSV 导入 |
| L2 复用文案 | 材质/品类/系列段落库，自动组合 | `lib/copywriter.js` |
| L3 品牌故事 | 4 品牌设计血统与卖点 | `content/brand-stories.json` |
| L4 信任页 | 工厂/品控/认证/物流/售后 | `content/company-pages.json` |

详见 [`content/内容填充操作手册.md`](content/内容填充操作手册.md)。

## 环境变量（Vercel → Settings → Environment Variables）

| 变量 | 用途 |
|---|---|
| `HUBSPOT_PRIVATE_APP_TOKEN` | CRM 联系人/工单写入 |
| `RESEND_API_KEY` | 自动回执 + 销售通知邮件 |
| `SALES_NOTIFY_EMAIL` | 销售团队通知邮箱 |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `DATASET` | 接入 Sanity CMS（可选） |

## 部署

```bash
npx vercel          # 首次部署
```
或推送到 GitHub → Vercel Import Project。域名：Vercel → Domains → 添加 `shinehome.com`，配置 DNS（A `76.76.21.21`）。

## 接入真实 CMS

把 `lib/products.js` 换成 Sanity 查询：

```js
import { createClient } from "@sanity/client";
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: "production", useCdn: true, apiVersion: "2024-01-01" });

export async function getProduct(slug) {
  return client.fetch(`*[_type=="product" && slug.current==$slug][0]{
    ..., brand->{name,slug}, series->{name,slug}
  }`, { slug });
}
```

2000+ SKU 建议 `generateStaticParams` 全量预生成 + `revalidate: 3600` 定时再生。

## 已知待办

- `content/company-pages.json` 中所有 `[方括号]` 需替换为真实数据（厂房面积、认证、交期等）
- 每个 SKU 需补 3 条独有卖点（组合文案解决"不空洞"，独特性仍需人工）
- 产品图片与规格书 PDF 待摄影棚按命名规范交付
