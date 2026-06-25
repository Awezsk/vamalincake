'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Cake } from '@/types'

export default function CakeCard({ cake }: { cake: Cake }) {
  return (
    <Link href={`/product/${cake.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
      <div style={{
        background: '#fff', borderRadius: 20, overflow: 'hidden',
        border: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', width: '100%',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}
        className="hover:shadow-xl hover:-translate-y-1.5"
      >
        {/* Image area */}
        <div style={{
          position: 'relative', height: 200, width: '100%',
          background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -30, right: -20,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -25, left: -15,
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.08)', pointerEvents: 'none',
          }} />
          {cake.image_url ? (
            <Image
              src={cake.image_url}
              alt={cake.name}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <span style={{ fontSize: 52, opacity: 0.6 }}>🎂</span>
          )}
          {cake.category && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
              padding: '4px 10px', borderRadius: 20,
              background: 'rgba(255,255,255,0.92)',
              color: 'var(--color-accent)', textTransform: 'uppercase',
              backdropFilter: 'blur(4px)',
            }}>
              {cake.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div style={{
          padding: '18px 20px 20px',
          flex: 1, display: 'flex', flexDirection: 'column',
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)',
            marginBottom: 4,
          }}>
            {cake.name}
          </h3>
          <p style={{
            fontSize: 13, color: 'var(--color-text-muted)',
            lineHeight: 1.5, marginBottom: 14,
            flex: 1,
          }}>
            {cake.description || 'Freshly baked and made to order.'}
          </p>
          <p style={{
            fontSize: 22, fontWeight: 700, color: 'var(--color-accent)',
            fontFamily: "'Playfair Display', serif",
          }}>
            ₹{cake.price}
          </p>
        </div>
      </div>
    </Link>
  )
}
