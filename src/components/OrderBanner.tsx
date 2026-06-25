"use client";

import { motion } from "framer-motion";

export default function OrderBanner() {
  return (
    <section style={{ padding: "0 20px", background: "#fff8f5" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #d94a7a 0%, #b83565 50%, #8b1a45 100%)",
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 12 }}>
            Limited Time Offer
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 44px)",
            fontWeight: 700,
            color: "#fff",
            marginBottom: 16,
            position: "relative",
          }}>
            Get 20% OFF Your First Order 🎉
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Use code <strong style={{ color: "#fff", background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 6 }}>CAKE20</strong> on orders above ₹600. Same-day delivery available!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="#bestsellers"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 32px",
                background: "#fff",
                color: "#d94a7a",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            >
              Order Now 🎂
            </motion.a>
            <motion.a
              href="https://wa.me/919876543210?text=Hi! I want to order a cake"
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "14px 32px",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              WhatsApp Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
