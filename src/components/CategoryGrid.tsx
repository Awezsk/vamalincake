"use client";

import { motion } from "framer-motion";

const categories = [
  { name: "Birthday Cakes", emoji: "🎂", color: "#fdeef4", border: "#f9c2d8" },
  { name: "Custom Cakes", emoji: "🎨", color: "#fff0e6", border: "#ffd6a8" },
  { name: "Wedding Cakes", emoji: "💍", color: "#f0f4ff", border: "#c5d0f5" },
  { name: "Kids Cakes", emoji: "🦄", color: "#f0fff4", border: "#b2f0c8" },
  { name: "Festival Cakes", emoji: "🪔", color: "#fffbea", border: "#ffe680" },
  { name: "Ice Cream Cakes", emoji: "🍦", color: "#f0fbff", border: "#aee3f7" },
  { name: "Couple Cakes", emoji: "💕", color: "#fff0f5", border: "#ffb8d9" },
  { name: "Anniversary", emoji: "🥂", color: "#fdf4ff", border: "#e0b8f5" },
];

export default function CategoryGrid() {
  return (
    <section id="categories" style={{ padding: "70px 20px", background: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#d94a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Browse by Occasion
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 700,
            color: "#1a0a05",
            marginTop: 8,
          }}>
            What Are You Celebrating?
          </h2>
          <div style={{ width: 50, height: 3, background: "#d94a7a", borderRadius: 2, margin: "14px auto 0" }} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 16,
          }}
        >
          {categories.map((cat) => (
            <motion.a
              key={cat.name}
              href="#bestsellers"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -5, boxShadow: `0 12px 32px rgba(0,0,0,0.1)` }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "22px 12px",
                background: cat.color,
                border: `1.5px solid ${cat.border}`,
                borderRadius: 16,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              <span style={{ fontSize: 36 }}>{cat.emoji}</span>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#1a0a05",
                textAlign: "center",
                lineHeight: 1.3,
              }}>
                {cat.name}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
