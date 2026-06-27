"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", cake: "", date: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.cake) {
      toast.error("Please fill name, phone and cake type");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("custom_orders").insert({
      name: form.name,
      phone: form.phone,
      cake_type: form.cake,
      delivery_date: form.date || null,
      message: form.message || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Failed to send. Please WhatsApp us directly!");
      console.error(error);
      return;
    }

    setSubmitted(true);
    setForm({ name: "", phone: "", cake: "", date: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" style={{ padding: "80px 20px", background: "var(--color-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 52 }}
        >
          <span style={{
            fontSize: 12, fontWeight: 700, color: "var(--color-accent)",
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Place an Order
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 4vw, 38px)",
            fontWeight: 700, color: "var(--color-text-heading)", marginTop: 8,
          }}>
            Let&apos;s Bake Something Special
          </h2>
          <div style={{
            width: 50, height: 3, background: "var(--color-accent)",
            borderRadius: 2, margin: "14px auto 0",
          }} />
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", gap: 24 }}
          >
            {[
              { icon: "📍", title: "Visit Us", content: "House No. 152, Nagsen Nagar, Bhim Chowk,\nJaripatka, Nagpur – 440014" },
              { icon: "📞", title: "Call / WhatsApp", content: "+91 98765 43210" },
              { icon: "🕐", title: "Opening Hours", content: "Mon–Sat: 10:00 AM – 9:00 PM\nSun: 11:00 AM – 6:00 PM" },
            ].map((item) => (
              <div key={item.title} style={{
                display: "flex", gap: 16, padding: "20px",
                borderRadius: 14, border: "1.5px solid var(--color-border)",
                background: "var(--color-bg)",
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "var(--color-accent-light)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{
                    fontSize: 12, fontWeight: 700, color: "var(--color-accent)",
                    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    fontSize: 14, color: "var(--color-text-body)",
                    lineHeight: 1.6, whiteSpace: "pre-line",
                  }}>
                    {item.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Map */}
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--color-border)" }}>
              <iframe
                src="https://maps.google.com/maps?q=21.1835453,79.0941604&z=16&output=embed"
                width="100%"
                height="220"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vamalinc location"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div style={{
              padding: "20px", borderRadius: 14,
              background: "var(--color-accent-light)",
              border: "1.5px solid var(--color-accent-very-light)",
              marginBottom: 4,
            }}>
              <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 600 }}>
                📋 Fill this form to place a custom order, or WhatsApp us directly for a quicker response!
              </p>
            </div>

            {[
              { label: "Your Name *", key: "name", placeholder: "Enter your name", type: "text" },
              { label: "Phone Number *", key: "phone", placeholder: "+91 98765 43210", type: "tel" },
              { label: "Cake Type / Flavour *", key: "cake", placeholder: "e.g. Chocolate Truffle, 1 kg", type: "text" },
              { label: "Delivery Date", key: "date", placeholder: "", type: "date" },
            ].map((field) => (
              <div key={field.key}>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: "var(--color-text-body)",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required={field.label.includes("*")}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  style={{
                    display: "block", width: "100%", marginTop: 6,
                    padding: "12px 14px", borderRadius: 10,
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-bg)", fontSize: 14,
                    color: "var(--color-text-heading)", outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                />
              </div>
            ))}

            <div>
              <label style={{
                fontSize: 12, fontWeight: 600, color: "var(--color-text-body)",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Special Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Message on cake, dietary needs, delivery address..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{
                  display: "block", width: "100%", marginTop: 6,
                  padding: "12px 14px", borderRadius: 10,
                  border: "1.5px solid var(--color-border)",
                  background: "var(--color-bg)", fontSize: 14,
                  color: "var(--color-text-heading)", outline: "none",
                  resize: "none", boxSizing: "border-box", fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
              />
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              style={{
                padding: "15px", borderRadius: 10,
                background: submitted ? "#25a56a" : submitting ? "#aaa" : "var(--color-accent)",
                color: "#fff", border: "none",
                fontSize: 15, fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                transition: "background 0.3s",
              }}
            >
              {submitted
                ? "✓ Order Received! We'll call you soon."
                : submitting
                ? "Sending..."
                : "Place Order 🎂"}
            </motion.button>

            <a
              href="https://wa.me/919876543210?text=Hi! I want to order a cake"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, padding: "13px", borderRadius: 10,
                background: "#25D366", color: "#fff",
                fontSize: 14, fontWeight: 700, textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp Instead
            </a>
          </motion.form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact > div > div:last-child { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}