"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const filters = ["All", "Birthday", "Custom", "Wedding", "Trending", "Kids"];

const cakes = [
  { name: "Classic Chocolate Truffle", price: 799, originalPrice: 999, tag: "BESTSELLER", filter: "Birthday", emoji: "🍫", rating: 4.9, orders: 342, desc: "Rich moist chocolate cake with velvety dark ganache and chocolate curls." },
  { name: "Strawberry Dreams", price: 899, originalPrice: null, tag: "SEASONAL", filter: "Birthday", emoji: "🍓", rating: 4.8, orders: 218, desc: "Light vanilla sponge layered with fresh strawberry cream and berries." },
  { name: "Black Forest Delight", price: 849, originalPrice: 1099, tag: "SIGNATURE", filter: "Trending", emoji: "🍒", rating: 4.9, orders: 412, desc: "Classic cherries & cream with chocolate shavings. Always a crowd favourite." },
  { name: "Red Velvet Love", price: 879, originalPrice: null, tag: "POPULAR", filter: "Wedding", emoji: "❤️", rating: 4.7, orders: 190, desc: "Velvety cocoa layers with luscious cream cheese frosting." },
  { name: "Mango Delight", price: 799, originalPrice: 949, tag: "SUMMER HIT", filter: "Trending", emoji: "🥭", rating: 4.8, orders: 285, desc: "Alphonso mango mousse on a soft sponge. A summer essential." },
  { name: "Unicorn Fantasy", price: 1299, originalPrice: null, tag: "KIDS FAV", filter: "Kids", emoji: "🦄", rating: 5.0, orders: 156, desc: "Colourful rainbow layers with whipped buttercream and sprinkles." },
  { name: "Blueberry Cheesecake", price: 949, originalPrice: 1199, tag: "NEW", filter: "Custom", emoji: "🫐", rating: 4.7, orders: 98, desc: "Creamy NY-style cheesecake base topped with a blueberry compote swirl." },
  { name: "Butterscotch Crunch", price: 749, originalPrice: null, tag: "CLASSIC", filter: "Birthday", emoji: "🧁", rating: 4.6, orders: 302, desc: "Fluffy vanilla sponge soaked in butterscotch with crunchy praline top." },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: 11, color: s <= Math.round(rating) ? "#f5a623" : "#ddd" }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: "#9c7060", marginLeft: 2 }}>{rating}</span>
    </div>
  );
}

export default function BestSellers() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = activeFilter === "All" ? cakes : cakes.filter((c) => c.filter === activeFilter);

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

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 }}>
          {filters.map((f) => (
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

        {/* Grid */}
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
                key={cake.name}
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
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Image area */}
                <div style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  background: "linear-gradient(135deg, #fdeef4, #ffd6e8, #ffecd6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontSize: 72 }}>{cake.emoji}</span>
                  {/* Tag */}
                  <span style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    background: cake.tag === "BESTSELLER" ? "#d94a7a" : cake.tag === "NEW" ? "#25a56a" : "#c8893c",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: 20,
                    letterSpacing: "0.1em",
                  }}>
                    {cake.tag}
                  </span>
                  {/* Discount */}
                  {cake.originalPrice && (
                    <span style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "#1a0a05",
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}>
                      {Math.round((1 - cake.price / cake.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <StarRating rating={cake.rating} />
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1a0a05",
                    marginTop: 6,
                    marginBottom: 4,
                  }}>
                    {cake.name}
                  </h3>
                  <p style={{ fontSize: 12, color: "#9c7060", lineHeight: 1.5, marginBottom: 12 }}>
                    {cake.desc}
                  </p>
                  <p style={{ fontSize: 11, color: "#b0907a", marginBottom: 12 }}>
                    🛒 {cake.orders} orders this week
                  </p>

                  {/* Price + Add to cart */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#d94a7a" }}>₹{cake.price}</span>
                      {cake.originalPrice && (
                        <span style={{ fontSize: 13, color: "#bbb", textDecoration: "line-through", marginLeft: 6 }}>
                          ₹{cake.originalPrice}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setCart((c) => cart.includes(cake.name) ? c.filter((x) => x !== cake.name) : [...c, cake.name])}
                      style={{
                        padding: "9px 16px",
                        borderRadius: 8,
                        background: cart.includes(cake.name) ? "#25a56a" : "#d94a7a",
                        color: "#fff",
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                    >
                      {cart.includes(cake.name) ? "✓ Added" : "+ Add"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <motion.a
            href="#contact"
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
      </div>
    </section>
  );
}
