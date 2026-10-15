// 生成 2000+ 模拟 SKU（原型阶段）。生产环境替换为 Sanity/Strapi 数据源。
// 数据模型与 Headless CMS 中的 "product" schema 保持一致。

const brands = ["Nordic Loft", "Milano Casa", "Kyoto Craft", "Aurora Living"];
const categories = ["Sofa", "Lounge Chair", "Dining Chair", "Coffee Table", "Dining Table", "Lighting", "Cabinet"];
const series = ["Classic", "Modern", "Heritage", "Minimal", "Art Deco"];
const materials = ["Top-grain Italian Leather", "Full-grain Aniline Leather", "Cashmere-Wool Blend", "Bouclé Fabric", "Solid Ash Wood", "Walnut Veneer", "Brushed Stainless Steel"];
const colors = ["Cognac", "Charcoal", "Ivory White", "Navy Blue", "Caramel", "Forest Green"];

// 品类 × 合法材质：避免生成"皮革灯具"这类荒谬组合
const MATERIAL_BY_CATEGORY = {
  "Sofa": ["Top-grain Italian Leather", "Full-grain Aniline Leather", "Cashmere-Wool Blend", "Bouclé Fabric"],
  "Lounge Chair": ["Top-grain Italian Leather", "Full-grain Aniline Leather", "Cashmere-Wool Blend", "Bouclé Fabric"],
  "Dining Chair": ["Top-grain Italian Leather", "Cashmere-Wool Blend", "Bouclé Fabric", "Solid Ash Wood"],
  "Coffee Table": ["Solid Ash Wood", "Walnut Veneer", "Brushed Stainless Steel"],
  "Dining Table": ["Solid Ash Wood", "Walnut Veneer", "Brushed Stainless Steel"],
  "Lighting": ["Brushed Stainless Steel", "Solid Ash Wood", "Walnut Veneer"],
  "Cabinet": ["Walnut Veneer", "Solid Ash Wood", "Brushed Stainless Steel"],
};

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(2026);

export function generateProducts(count = 2048) {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(rand() * categories.length)];
    const brand = brands[Math.floor(rand() * brands.length)];
    const series = seriesArr[Math.floor(rand() * seriesArr.length)];
    const pool = MATERIAL_BY_CATEGORY[category];
    const material = pool[Math.floor(rand() * pool.length)];
    const color = colors[Math.floor(rand() * colors.length)];
    const name = `${brand} ${series} ${category}`;
    products.push({
      id: i,
      slug: `${category.toLowerCase().replace(/\s+/g, "-")}-${series.toLowerCase()}-${i}`,
      name,
      brand,
      category,
      series,
      material,
      color,
      sku: `SH-${String(i).padStart(5, "0")}`,
      moq: [10, 20, 30, 50][Math.floor(rand() * 4)],
      leadTime: `${[25, 30, 35, 45][Math.floor(rand() * 4)]} days`,
      fobPrice: `$${(80 + Math.floor(rand() * 1200))}`,
      dimensions: `${120 + Math.floor(rand() * 120)}×${70 + Math.floor(rand() * 40)}×${65 + Math.floor(rand() * 30)} cm`,
      description: `Inspired by mid-century ${series.toLowerCase()} design. Upholstered in ${material.toLowerCase()}, finished in ${color.toLowerCase()}. Built for hospitality-grade durability (CATAS tested frame, 5-year commercial warranty).`,
    });
  }
  return products;
}

const seriesArr = ["Classic", "Modern", "Heritage", "Minimal", "Art Deco"];

export const products = generateProducts();

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}

export function filterProducts({ brand, category, page = 1, perPage = 24 }) {
  let list = products;
  if (brand) list = list.filter((p) => p.brand === brand);
  if (category) list = list.filter((p) => p.category === category);
  return {
    total: list.length,
    page,
    items: list.slice((page - 1) * perPage, page * perPage),
  };
}

export const facets = {
  brands,
  categories,
};
