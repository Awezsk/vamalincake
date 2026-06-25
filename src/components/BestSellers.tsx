"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cartStore";
import { supabase } from "@/lib/supabase";
import { Cake } from "@/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: 11, color: s <= Math.round(rating) ? "#f5a623" : "#ddd" }}>★</span>
      ))}
    </div>
  );
}

export default function BestSellers() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const addItem = useCart((s) => s.addItem);
  const cartItems = useCart((s) => s.items);
  const router = useRouter();

  useEffect(() => {
    const fetchCakes = async () => {
      const { data, error } = await supabase
        .from("cakes")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cakes:", error);
        setLoading(false);
        return;
      }

      setCakes(data || []);

      // Build dynamic category filters from real data
      const cats = [...new Set((data || []).map((c: Cake) => c.category).filter(Boolean))];
      setCategories(cats);
      setLoading(false);
    };

    fetchCakes();
  }, []);

  const filtered =
    activeFilter === "All"
      ? cakes
      : cakes.filter((c) => c.category === activeFilter);

  const isInCart = (id: string) => cartItems.some((i) => i.cake.id === id);

  const handleAdd = (cake: Cake) => {
    if (isInCart(cake.id)) {
      router.push("/cart");
      return;
    }
    addItem(cake, {}, 0);
    toast.success(`${cake.name} added to cart!`);
  };

  return (
    <section id="bestsellers" style={{ padding: "80px 20px", background: "#fff8f5" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "#d94a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Most Loved
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 700,
            color: "#1a0a05",
            marginTop: 8,
          }}>
            Our Best Sellers
          </h2>
          <div style={{ width: 50, height: 3, background: "#d94a7a", borderRadius: 2, margin: "14px auto 20px" }} />
          <p style={{ fontSize: 14, color: "#9c7060", maxWidth: 480, margin: "0 auto" }}>
            Handpicked favourites from our kitchen — fresh, eggless, and made to order
          </p>
        </motion.div>

        {/* Dynamic filters from real categories */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
            {["All", ...categories].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 30,
                  border: activeFilter === f ? "none" : "1.5px solid #f0d9ce",
                  background: activeFilter === f ? "#d94a7a" : "#fff",
                  color: activeFilter === f ? "#fff" : "#5a3b2e",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎂</div>
            <p style={{ color: "#9c7060", fontSize: 14 }}>Loading our cakes...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && cakes.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍰</div>
            <p style={{ color: "#9c7060", fontSize: 16, fontWeight: 600 }}>
              Our menu is being prepared!
            </p>
            <p style={{ color: "#b0907a", fontSize: 13, marginTop: 8 }}>
              Check back soon for freshly listed cakes.
            </p>
          </div>
        )}

        {/* Cake Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((cake) => (
                <motion.div
                  key={cake.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid #f0d9ce",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Image */}
                  <div
                    onClick={() => router.push(`/product/${cake.id}`)}
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      background: "linear-gradient(135deg, #fdeef4, #ffd6e8, #ffecd6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      overflow: "hidden",
                    }}
                  >
                    {cake.image_url ? (
                      <img
                        src={cake.image_url}
                        alt={cake.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 72 }}>🎂</span>
                    )}

                    {/* Category badge */}
                    {cake.category && (
                      <span style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        background: "#d94a7a",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 20,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        {cake.category}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px" }}>
                    <StarRating rating={4.8} />
                    <h3
                      onClick={() => router.push(`/product/${cake.id}`)}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#1a0a05",
                        marginTop: 6,
                        marginBottom: 4,
                        cursor: "pointer",
                      }}
                    >
                      {cake.name}
                    </h3>
                    <p style={{ fontSize: 12, color: "#9c7060", lineHeight: 1.5, marginBottom: 12 }}>
                      {cake.description || "Freshly baked and made to order."}
                    </p>

                    {/* Price + Add to cart */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#d94a7a" }}>
                        ₹{cake.price}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => handleAdd(cake)}
                        style={{
                          padding: "9px 16px",
                          borderRadius: 8,
                          background: isInCart(cake.id) ? "#25a56a" : "#d94a7a",
                          color: "#fff",
                          border: "none",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "background 0.2s",
                        }}
                      >
                        {isInCart(cake.id) ? "✓ View Cart" : "+ Add"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        {!loading && cakes.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <motion.a
              href="/product"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: 10,
                background: "#fff",
                border: "2px solid #d94a7a",
                color: "#d94a7a",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Full Menu →
            </motion.a>
          </div>
        )}
      </div>
    </section>
  );
}