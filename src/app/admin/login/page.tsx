'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.session) {
      toast.error('Invalid credentials')
      setLoading(false)
      return
    }

    document.cookie = `admin_token=${data.session.access_token}; path=/; max-age=86400`
    toast.success('Welcome back!')
    router.push('/admin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-accent-light) 50%, #fff1ea 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 16px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'fixed', top: -120, right: -60,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(var(--color-accent-rgb), 0.05)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: -100, left: -80,
        width: 350, height: 350, borderRadius: '50%',
        background: 'rgba(var(--color-accent-rgb), 0.04)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '10%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
        transform: 'translateY(-50%)',
      }} />
      {/* Subtle pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.02,
        backgroundImage: 'radial-gradient(circle, var(--color-accent) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      {/* Login card */}
      <div style={{
        background: 'var(--color-surface)',
        borderRadius: 28,
        padding: '52px 44px 48px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 32px 100px rgba(var(--color-accent-rgb), 0.12)',
        border: '1px solid var(--color-border)',
        position: 'relative',
      }}>
        {/* Icon */}
        <div style={{
          width: 76, height: 76, borderRadius: 24,
          background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 22px',
          boxShadow: '0 8px 24px rgba(var(--color-accent-rgb), 0.15)',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700, color: '#1a0a05',
          }}>
            Vamalinc Cakes
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 6 }}>
            Sign in to your admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'var(--color-text-body)', marginBottom: 7, textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vamalin.com"
              style={{
                width: '100%',
                border: '1.5px solid var(--color-border)',
                borderRadius: 14, padding: '14px 16px',
                fontSize: 14, color: '#1a0a05',
                outline: 'none', transition: 'all 0.2s',
                background: 'var(--color-bg)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--color-accent-rgb), 0.1)'
                e.currentTarget.style.background = '#fff'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'var(--color-bg)'
              }}
              required
            />
          </div>
          <div>
            <label style={{
              display: 'block', fontSize: 12, fontWeight: 600,
              color: 'var(--color-text-body)', marginBottom: 7, textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                border: '1.5px solid var(--color-border)',
                borderRadius: 14, padding: '14px 16px',
                fontSize: 14, color: '#1a0a05',
                outline: 'none', transition: 'all 0.2s',
                background: 'var(--color-bg)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--color-accent-rgb), 0.1)'
                e.currentTarget.style.background = '#fff'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'var(--color-bg)'
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'var(--color-border)' : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-medium))',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '16px',
              fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: 6, letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : '0 6px 24px rgba(var(--color-accent-rgb), 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-medium), var(--color-accent-dark))'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(var(--color-accent-rgb), 0.4)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-medium))'
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(var(--color-accent-rgb), 0.3)'
                e.currentTarget.style.transform = 'none'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
