import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Cake } from '@/types'
import DeleteCakeButton from '@/components/DeleteCakeButton'

export default async function AdminCakesPage() {
  const { data: cakes } = await supabaseAdmin
    .from('cakes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 32, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700, color: '#1a0a05',
          }}>
            Cakes
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            {cakes ? cakes.length : 0} cake{cakes?.length !== 1 ? 's' : ''} in your catalog
          </p>
        </div>
        <Link
          href="/admin/cakes/new"
          className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors no-underline"
          style={{ background: 'var(--color-accent)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add New Cake
        </Link>
      </div>

      {/* Empty state */}
      {!cakes || cakes.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: '#fff', borderRadius: 24,
          border: '2px dashed var(--color-border)',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 24,
            background: 'var(--color-accent-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <p style={{
            fontSize: 18, fontWeight: 700, color: '#1a0a05',
            fontFamily: "'Playfair Display', serif",
          }}>
            No cakes yet
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 6, marginBottom: 24 }}>
            Start building your menu by adding your first cake
          </p>
          <Link
            href="/admin/cakes/new"
            className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-colors no-underline"
            style={{ background: 'var(--color-accent)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Your First Cake
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}>
          {cakes.map((cake: Cake) => (
            <div
              key={cake.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 cake-card"
              style={{
                background: '#fff',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image area */}
              <div style={{
                position: 'relative', height: 190,
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
                  <Image src={cake.image_url} alt={cake.name} fill unoptimized style={{ objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 52, opacity: 0.6 }}>🎂</span>
                )}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.03) 0%, transparent 50%)',
                }} />
                <span
                  className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1.5 rounded-full ${
                    cake.available
                      ? 'bg-[#f0fff0] text-[#2e7d32]'
                      : 'bg-[#fff0f0] text-[#c62828]'
                  }`}
                >
                  {cake.available ? '● Available' : '● Hidden'}
                </span>
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

              {/* Body — flex column so buttons stick to bottom */}
              <div style={{
                padding: '18px 20px 20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17, fontWeight: 700, color: '#1a0a05',
                  marginBottom: 2,
                }}>
                  {cake.name}
                </h3>
                {cake.description ? (
                  <p style={{
                    fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4,
                    marginBottom: 12,
                  }}>
                    {cake.description}
                  </p>
                ) : (
                  <div style={{ flex: 1 }} />
                )}
                <p style={{
                  fontSize: 22, fontWeight: 700, color: 'var(--color-accent)',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: 16, marginTop: 'auto',
                }}>
                  ₹{cake.price}
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    href={`/admin/cakes/${cake.id}`}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', textDecoration: 'none',
                      border: '1.5px solid var(--color-accent)', color: 'var(--color-accent)',
                      background: '#fff', borderRadius: 12,
                      padding: '10px 0', fontSize: 13, fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    Edit Cake
                  </Link>
                  <DeleteCakeButton id={cake.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
