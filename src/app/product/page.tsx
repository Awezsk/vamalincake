import { supabase } from '@/lib/supabase'
import { Cake } from '@/types'
import Navbar from '@/components/Navbar'
import CakeCard from '@/components/CakeCard'

export default async function ProductsPage() {
  const { data: cakes } = await supabase
    .from('cakes')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main style={{ marginLeft: 'clamp(1rem,3vw,3rem)', marginRight: 'clamp(1rem,3vw,3rem)', padding: '48px 0 80px', position: 'relative' }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'fixed', top: '15%', right: -120,
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(var(--color-accent-rgb), 0.04)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'fixed', bottom: '5%', left: -80,
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{
              width: 6, height: 28, borderRadius: 3,
              background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
            }} />
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32, fontWeight: 700, color: 'var(--color-text-heading)',
            }}>
              Our Cakes
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginLeft: 20, maxWidth: 480 }}>
            All cakes are freshly baked and customizable with your choice of size, flavour, and toppings
          </p>
        </div>

        {!cakes || cakes.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '100px 20px',
            background: 'var(--color-surface)', borderRadius: 24,
            border: '2px dashed var(--color-border)',
            maxWidth: 480, margin: '40px auto',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🍰</div>
            <p style={{
              fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)',
              fontFamily: "'Playfair Display', serif",
            }}>
              No cakes available
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 8 }}>
              Check back soon for freshly listed cakes!
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}>
            {cakes.map((cake: Cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
