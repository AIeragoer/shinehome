// 内容读取层：把 content/*.json 与 lib/copywriter 统一暴露给页面。
// 生产环境将 company-pages.json / brand-stories.json 换成 Sanity 查询即可，页面无需改动。
import companyPages from "@/content/company-pages.json";
import brandStories from "@/content/brand-stories.json";

const PAGE_KEYS = {
  about: "about",
  factory: "factory",
  "quality-control": "qualityControl",
  certifications: "certifications",
  "custom-oem": "customOEM",
  logistics: "logistics",
  "after-sales": "afterSales",
};

export function getCompanyPage(slug) {
  const key = PAGE_KEYS[slug] || slug;
  return companyPages[key] || null;
}

export function getAllCompanyPages() {
  return Object.keys(PAGE_KEYS).map((slug) => ({ slug, ...getCompanyPage(slug) }));
}

export function getBrand(slug) {
  const { _readme, _seriesTemplate, ...brands } = brandStories;
  return brands[slug] || null;
}

export function getAllBrands() {
  const { _readme, _seriesTemplate, ...brands } = brandStories;
  return Object.entries(brands).map(([slug, data]) => ({ slug, ...data }));
}
