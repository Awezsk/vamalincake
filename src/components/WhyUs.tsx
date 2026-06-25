"use client";

import { motion } from "framer-motion";

const reasons = [
  { icon: "⚡", title: "Same-Day Delivery", desc: "Order by 4 PM and get your cake the same day, anywhere in Nagpur." },
  { icon: "🥚", title: "100% Eggless", desc: "All our cakes are freshly baked without eggs — perfect for everyone." },
  { icon: "🎨", title: "Custom Designs", desc: "Tell us your dream cake — we'll make it happen, any size or theme." },
  { icon: "🌿", title: "Fresh Ingredients", desc: "No preservatives. Fresh cream, real fruits, premium chocolate — every time." },
  { icon: "🤝", title: "Trusted by 5000+", desc: "Families across Nagpur trust us for birthdays, weddings, and every celebration." },
  { icon: "💯", title: "Quality Guarantee", desc: "Not happy? We'll make it right. Your satisfaction is our promise." },
];

export default function WhyUs() {
  return (
    <section style={{ padding: "80px 20px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-accent)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Why Choose Us
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 700,
            color: "var(--color-text-heading)",
            marginTop: 8,
          }}>
            The Vamilin Difference
          </h2>
          <div style={{ width: 50, height: 3, background: "var(--color-accent)", borderRadius: 2, margin: "14px auto 0" }} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -4 }}
              style={{
                padding: "28px 24px",
                borderRadius: 16,
                border: "1.5px solid var(--color-border)",
                background: "var(--color-bg)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "var(--color-accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 16,
              }}>
                {r.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-heading)", marginBottom: 8 }}>{r.title}</h3>
              <p style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.6 }}>{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
