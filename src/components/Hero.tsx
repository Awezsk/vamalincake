"use client";

import { motion } from "framer-motion";

const slides = [
  {
    tag: "NEW LAUNCH",
    headline: "Celebrate Every\nMoment Sweetly",
    sub: "Fresh, handcrafted cakes delivered to your door — same day, across Nagpur.",
    bg: "linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent-very-light) 40%, var(--color-accent-light) 100%)",
    emoji: "🎂",
    cta: "Order Now",
    ctaHref: "#bestsellers",
  },
  {
    tag: "CUSTOM ORDERS",
    headline: "Your Dream Cake,\nBuilt by Us",
    sub: "Tell us your vision — flavour, size, message. We make it happen.",
    bg: "linear-gradient(135deg, #fff0e6 0%, #ffd9b0 40%, #ffe8d6 100%)",
    emoji: "🎁",
    cta: "Customise Cake",
    ctaHref: "#contact",
  },
];

export default function Hero() {
  return (
    <section
      id="home"
      style={{
        background: slides[0].bg,
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 500, height: 500, borderRadius: "50%",
        background: "rgba(var(--color-accent-rgb), 0.07)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(200,137,60,0.06)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span style={{
            display: "inline-block",
            background: "var(--color-accent)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.2em",
            padding: "5px 14px",
            borderRadius: 20,
            marginBottom: 20,
          }}>
            🚀 SAME DAY DELIVERY · NAGPUR
          </span>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            color: "var(--color-text-heading)",
            lineHeight: 1.2,
            marginBottom: 20,
            whiteSpace: "pre-line",
          }}>
            {"Celebrate Every\nMoment Sweetly"}
          </h1>

          <p style={{ fontSize: 16, color: "var(--color-text-body)", lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
            Fresh, handcrafted cakes delivered to your door — same day, across Nagpur. Eggless options available.
          </p>

          {/* Offer badge */}
          <div style={{
            display: "inline-block",
            background: "#fff",
            border: "1.5px dashed var(--color-accent)",
            borderRadius: 10,
            padding: "10px 18px",
            marginBottom: 32,
          }}>
            <span style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 700 }}>
              🎉 20% OFF on orders ₹600+ &nbsp;|&nbsp; Use code: <strong>CAKE20</strong>
            </span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <motion.a
              href="#bestsellers"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "14px 28px",
                background: "var(--color-accent)",
                color: "#fff",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(var(--color-accent-rgb), 0.3)",
              }}
            >
              Order Now 🎂
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: "14px 28px",
                background: "#fff",
                color: "var(--color-accent)",
                border: "2px solid var(--color-accent)",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Custom Cake
            </motion.a>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
            {[
              { icon: "⚡", label: "30-min Delivery" },
              { icon: "🥚", label: "100% Eggless" },
              { icon: "⭐", label: "500+ Reviews" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-body)" }}>{b.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ display: "flex", justifyContent: "center", position: "relative" }}
        >
          {/* Main cake visual */}
          <div style={{
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "linear-gradient(145deg, var(--color-accent), var(--color-accent-very-light), var(--color-accent-light))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 80px rgba(var(--color-accent-rgb), 0.2), 0 10px 30px rgba(0,0,0,0.08)",
            position: "relative",
          }}>
            <span style={{ fontSize: 120 }}>🎂</span>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute", top: 20, right: -20,
              background: "#fff",
              borderRadius: 12,
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-text-heading)",
            }}
          >
            🚀 30-min Delivery
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
              position: "absolute", bottom: 30, left: -20,
              background: "var(--color-accent)",
              borderRadius: 12,
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(var(--color-accent-rgb), 0.3)",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            🥚 100% Eggless
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #home > div { grid-template-columns: 1fr !important; gap: 30px !important; }
          #home > div > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}
