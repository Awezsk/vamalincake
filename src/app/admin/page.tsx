import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function AdminDashboard() {
  const { count: cakeCount } = await supabaseAdmin
    .from('cakes')
    .select('*', { count: 'exact', head: true })

  const { count: orderCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { count: pendingCount } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('payment_status', 'pending_verification')

  const stats = [
    {
      label: 'Total Cakes', value: cakeCount || 0, href: '/admin/cakes',
      gradient: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent-very-light) 100%)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      accent: 'var(--color-accent)',
    },
    {
      label: 'Total Orders', value: orderCount || 0, href: '/admin/orders',
      gradient: 'linear-gradient(135deg, var(--color-tag-bg) 0%, var(--color-accent-very-light) 100%)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      accent: 'var(--color-accent-dark)',
    },
    {
      label: 'Pending Payments', value: pendingCount || 0, href: '/admin/orders',
      gradient: 'linear-gradient(135deg, #fffbea 0%, #fff3cd 100%)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c8893c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      accent: '#c8893c',
    },
  ]

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 6, height: 28, borderRadius: 3,
            background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
          }} />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30, fontWeight: 700, color: '#1a0a05',
          }}>
            Dashboard
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginLeft: 20 }}>
          Welcome back to Vamalinc Cakes admin
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20, marginBottom: 48, alignItems: 'stretch',
      }}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} style={{ textDecoration: 'none', display: 'flex' }}>
            <div
              className="w-full transition-all duration-300 hover:-translate-y-2"
              style={{
                background: stat.gradient,
                borderRadius: 24,
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              {/* Decorative circle */}
              <div style={{
                position: 'absolute', top: -30, right: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
              }} />
              <div style={{
                position: 'absolute', bottom: -20, right: 20,
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
              }} />

              {/* Icon */}
              <div style={{
                width: 54, height: 54, borderRadius: 18,
                background: 'rgba(255,255,255,0.85)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 22, position: 'relative',
                backdropFilter: 'blur(4px)',
              }}>
                {stat.icon}
              </div>

              {/* Value */}
              <p style={{
                fontSize: 38, fontWeight: 800, color: '#1a0a05',
                fontFamily: "'Playfair Display', serif",
                lineHeight: 1, marginBottom: 8,
                position: 'relative',
              }}>
                {stat.value}
              </p>

              {/* Label */}
              <p style={{
                fontSize: 13, fontWeight: 700, color: stat.accent,
                letterSpacing: '0.03em',
                position: 'relative',
              }}>
                {stat.label}
              </p>

              {/* Trend indicator */}
              <div style={{
                position: 'absolute', bottom: 24, right: 24,
                display: 'flex', alignItems: 'center', gap: 4,
                opacity: 0.6,
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={stat.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick action cards */}
      <div style={{
        background: 'var(--color-surface)', borderRadius: 24,
        border: '1px solid var(--color-border)', padding: '28px 32px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
        }}>
          <div style={{
            width: 4, height: 20, borderRadius: 2,
            background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
          }} />
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17, fontWeight: 700, color: '#1a0a05',
          }}>
            Quick Actions
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
        }}>
          <Link href="/admin/cakes/new" style={{ textDecoration: 'none', display: 'flex' }}>
            <div
              className="w-full transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--color-bg)',
                borderRadius: 18,
                padding: '20px',
                border: '1.5px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 16,
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.25)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1a0a05', fontSize: 14 }}>
                  Add New Cake
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Create a new cake listing
                </p>
              </div>
            </div>
          </Link>
          <Link href="/admin/orders" style={{ textDecoration: 'none', display: 'flex' }}>
            <div
              className="w-full transition-all duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--color-bg)',
                borderRadius: 18,
                padding: '20px',
                border: '1.5px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: 16,
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: 16,
                background: 'linear-gradient(135deg, var(--color-accent-dark), #163a5c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, boxShadow: '0 4px 12px rgba(var(--color-accent-dark-rgb), 0.25)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#1a0a05', fontSize: 14 }}>
                  View Orders
                </p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Manage incoming orders
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
