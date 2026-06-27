'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Cake, ShoppingBag, LogOut, Menu, X, Moon, Sun, Settings} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/components/ThemeProvider'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/cakes', icon: Cake, label: 'Cakes' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 60,
          background: 'var(--color-accent)', color: '#fff', border: 'none',
          width: 40, height: 40, borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.3)',
        }}
        className="lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40,
          }}
          className="lg:hidden"
        />
      )}

      <aside
        style={{
          width: 260,
          minHeight: '100vh',
          background: '#fff',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
        className="lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Brand header */}
        <div style={{
          padding: '32px 24px 28px',
          borderBottom: '1px solid var(--color-border)',
          background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-accent-light) 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 150, height: 150, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.05)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.25)',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20, fontWeight: 700, color: '#1a0a05', lineHeight: 1.2,
              }}>
                Vamalinc
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1, fontWeight: 500 }}>
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '13px 16px',
                  borderRadius: 14,
                  color: active ? 'var(--color-accent)' : 'var(--color-text-body)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  transition: 'all 0.2s',
                  background: active
                    ? 'linear-gradient(135deg, var(--color-accent-light), var(--color-bg))'
                    : 'transparent',
                  border: active ? '1px solid rgba(var(--color-accent-rgb), 0.15)' : '1px solid transparent',
                  boxShadow: active ? '0 2px 8px rgba(var(--color-accent-rgb), 0.06)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--color-accent-light)'
                    e.currentTarget.style.color = 'var(--color-accent)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-body)'
                  }
                }}
              >
                <item.icon size={19} />
                {item.label}
                {active && (
                  <div style={{
                    width: 4, height: 20, borderRadius: 2,
                    background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
                    marginLeft: 'auto',
                  }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout + Theme toggle */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', borderRadius: 14,
              background: theme === 'pink'
                ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
                : 'linear-gradient(135deg, #1e3a5f, #2c5282)',
              color: '#fff',
              border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s', width: '100%',
              boxShadow: theme === 'pink'
                ? '0 2px 8px rgba(var(--color-accent-rgb), 0.25)'
                : '0 2px 8px rgba(0, 0, 0, 0.12)',
            }}
            onMouseEnter={(e) => {
              if (theme === 'pink') {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-dark), #163a5c)'
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, #163a5c, #1e4d7a)'
              }
            }}
            onMouseLeave={(e) => {
              if (theme === 'pink') {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
              } else {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a5f, #2c5282)'
              }
            }}
          >
            {theme === 'navy' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'navy' ? 'Pink Theme' : 'Navy Theme'}
          </button>

          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '13px 16px',
              borderRadius: 14,
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff0f0'
              e.currentTarget.style.color = '#e74c3c'
              e.currentTarget.style.borderColor = 'rgba(231,76,60,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <LogOut size={17} />
            Logout
          </Link>
        </div>
      </aside>
    </>
  )
}

function FloatingThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      title={theme === 'navy' ? 'Switch to Pink Theme' : 'Switch to Navy Theme'}
      style={{
        position: 'fixed', top: 14, right: 16, zIndex: 70,
        width: 38, height: 38, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: 'none',
        background: theme === 'pink'
          ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
          : 'linear-gradient(135deg, #1e3a5f, #2c5282)',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: theme === 'pink'
          ? '0 2px 8px rgba(var(--color-accent-rgb), 0.25)'
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
      onMouseEnter={(e) => {
        if (theme === 'pink') {
          e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-dark), #163a5c)'
        } else {
          e.currentTarget.style.background = 'linear-gradient(135deg, #163a5c, #1e4d7a)'
        }
      }}
      onMouseLeave={(e) => {
        if (theme === 'pink') {
          e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
        } else {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a5f, #2c5282)'
        }
      }}
    >
      {theme === 'navy' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--color-bg)' }}>
      <Sidebar open={open} setOpen={setOpen} />
      <FloatingThemeToggle />
      <main style={{ flex: 1, overflow: 'auto', marginLeft: 0 }} className="lg:ml-[260px]">
        {children}
      </main>
    </div>
  )
}
