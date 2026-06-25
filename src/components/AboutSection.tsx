"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "5+", label: "Years Baking" },
  { value: "5000+", label: "Happy Customers" },
  { value: "50+", label: "Cake Varieties" },
  { value: "30 min", label: "Delivery Time" },
];

export default function AboutSection() {
  return (
    <section id="about" style={{ padding: "80px 20px", background: "#fff8f5" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ position: "relative" }}
          >
            <div style={{
              aspectRatio: "4/3",
              borderRadius: 24,
              background: "linear-gradient(135deg, #fdeef4, #ffd6e8, #ffecd6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 100,
              boxShadow: "0 20px 60px rgba(217,74,122,0.15)",
            }}>
              🎂
            </div>
            {/* Stats overlay */}
            <div style={{
              position: "absolute",
              bottom: -30,
              right: -20,
              background: "#fff",
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
              border: "1px solid #f0d9ce",
            }}>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#d94a7a", lineHeight: 1 }}>5000+</p>
              <p style={{ fontSize: 12, color: "#9c7060", marginTop: 4 }}>Happy Customers</p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#d94a7a", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Our Story
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 3.5vw, 38px)",
              fontWeight: 700,
              color: "#1a0a05",
              marginTop: 10,
              marginBottom: 20,
              lineHeight: 1.3,
            }}>
              Baked with Love in Nagpur
            </h2>
            <p style={{ fontSize: 15, color: "#5a3b2e", lineHeight: 1.8, marginBottom: 16 }}>
              Founded in Jaripatka, Nagpur, Vamilin — The Cake Bar was born from a simple belief: every celebration deserves a cake that tastes as beautiful as it looks.
            </p>
            <p style={{ fontSize: 15, color: "#9c7060", lineHeight: 1.8, marginBottom: 32 }}>
              We use only the freshest ingredients — no preservatives, no shortcuts. Every cake is handcrafted to order, whether it&apos;s a simple birthday cake or an elaborate wedding centrepiece.
            </p>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "18px 20px",
                    borderRadius: 12,
                    background: "#fff",
                    border: "1.5px solid #f0d9ce",
                  }}
                >
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#d94a7a", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "#9c7060", marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
