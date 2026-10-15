import "./globals.css";

export const metadata = {
  title: "ShineHome — Premium Replica Furniture for Wholesale",
  description:
    "B2B manufacturer & wholesaler of designer replica furniture. 2000+ SKUs, low MOQ, global shipping. Request a quote today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container header-inner">
            <a href="/" className="logo">SHINE<span>HOME</span></a>
            <nav>
              <a href="/products">Products</a>
              <a href="/brands/nordic-loft">Brands</a>
              <a href="/factory">Factory</a>
              <a href="/certifications">Certifications</a>
              <a href="/custom-oem">OEM</a>
              <a href="/logistics">Shipping</a>
            </nav>
            <a href="/inquiry" className="btn btn-primary header-cta">Request Quote</a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>© 2026 ShineHome.com — Replica Furniture Manufacturer & Wholesaler</p>
            <p>Catalog updates weekly · MOQ from 10 pcs · Worldwide shipping (DDP available)</p>
            <p style={{ marginTop: 12 }}>
              <a href="/about">About</a> · <a href="/factory">Factory</a> · <a href="/quality-control">Quality</a> ·
              <a href="/certifications">Certifications</a> · <a href="/custom-oem">OEM</a> ·
              <a href="/logistics">Logistics</a> · <a href="/after-sales">After-Sales</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
