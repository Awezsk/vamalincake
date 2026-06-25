"use client";

export default function Footer() {
  return (
    <footer style={{ background: "#1a0a05", color: "#fff", padding: "60px 20px 30px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#fff",
              }}>
                Vamilin
              </div>
              <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--color-accent)", textTransform: "uppercase", marginTop: 2 }}>
                The Cake Bar
              </div>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 260 }}>
              Handcrafted cakes & desserts made with love in Jaripatka, Nagpur. Fresh. Eggless. Delivered.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["📘 Facebook", "📸 Instagram"].map((s) => (
                <a key={s} href="#" style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  textDecoration: "none",
                  fontWeight: 500,
                }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Cakes
            </p>
            {["Birthday Cakes", "Wedding Cakes", "Custom Cakes", "Kids Cakes", "Festival Cakes", "Ice Cream Cakes"].map((l) => (
              <a key={l} href="#categories" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Company
            </p>
            {["About Us", "Our Story", "Contact Us", "Privacy Policy", "Refund Policy"].map((l) => (
              <a key={l} href="#about" style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
              Contact
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 14 }}>
              Jaripatka, Nagpur – 440014
            </p>
            <a href="tel:+919876543210" style={{ display: "block", fontSize: 13, color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, marginBottom: 8 }}>
              📞 +91 98765 43210
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ display: "block", fontSize: 13, color: "#25D366", textDecoration: "none", fontWeight: 600 }}>
              💬 WhatsApp Order
            </a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            © {new Date().getFullYear()} Vamilin – The Cake Bar. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
            Made with 🍰 in Nagpur
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
