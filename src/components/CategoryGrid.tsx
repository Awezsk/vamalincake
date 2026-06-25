"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

// Default colors cycling for categories
const colorPalette = [
  { color: "#fdeef4", border: "#f9c2d8" },
  { color: "#fff0e6", border: "#ffd6a8" },
  { color: "#f0f4ff", border: "#c5d0f5" },
  { color: "#f0fff4", border: "#b2f0c8" },
  { color: "#fffbea", border: "#ffe680" },
  { color: "#f0fbff", border: "#aee3f7" },
  { color: "#fff0f5", border: "#ffb8d9" },
  { color: "#fdf4ff", border: "#e0b8f5" },
];

const categoryEmojis: Record<string, string> = {
  birthday: "🎂",
  wedding: "💍",
  custom: "🎨",
  kids: "🦄",
  festival: "🪔",
  anniversary: "🥂",
  trending: "🔥",
  seasonal: "🌸",
  default: "🍰",
};

function getEmoji(category: string) {
  const key = category.toLowerCase().split(" ")[0];
  return categoryEmojis[key] || categoryEmojis.default;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("cakes")
        .select("category")
        .eq("available", true);

      if (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
        return;
      }

      // Get unique non-empty categories
      const unique = [
        ...new Set(
          (data || [])
            .map((c: { category: string }) => c.category)
            .filter(Boolean)
        ),
      ] as string[];

      setCategories(unique);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // Don't render section if no categories
  if (!loading && categories.length === 0) return null;

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

        {/* Loading skeleton */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 16,
          }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{
                height: 110,
                borderRadius: 16,
                background: "#f5f5f5",
                animation: "pulse 1.5s infinite",
              }} />
            ))}
          </div>
        )}

        {/* Real categories from DB */}
        {!loading && (
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
            {categories.map((cat, i) => {
              const palette = colorPalette[i % colorPalette.length];
              return (
                <motion.a
                  key={cat}
                  href="#bestsellers"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                  }}
                  whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    padding: "22px 12px",
                    background: palette.color,
                    border: `1.5px solid ${palette.border}`,
                    borderRadius: 16,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  <span style={{ fontSize: 36 }}>{getEmoji(cat)}</span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1a0a05",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}>
                    {cat}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}