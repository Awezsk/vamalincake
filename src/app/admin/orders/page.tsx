'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types'
import toast from 'react-hot-toast'

const paymentConfig: Record<string, { bg: string; color: string; label: string }> = {
  pending_verification: { bg: '#fffbea', color: '#c8893c', label: 'Pending' },
  confirmed: { bg: '#f0fff0', color: '#2e7d32', label: 'Confirmed' },
  rejected: { bg: '#fff0f0', color: '#c62828', label: 'Rejected' },
}

const orderConfig: Record<string, { bg: string; color: string }> = {
  received: { bg: '#e3f2fd', color: '#1565c0' },
  preparing: { bg: '#f3e5f5', color: '#7b1fa2' },
  ready: { bg: '#e0f2f1', color: '#00695c' },
  delivered: { bg: '#f0fff0', color: '#2e7d32' },
  cancelled: { bg: '#fff0f0', color: '#c62828' },
}

const orderStatuses = ['received', 'preparing', 'ready', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    // Use the server-side API route so service role key is used (bypasses RLS)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updatePayment = async (id: string, status: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, payment_status: status }),
    })
    if (res.ok) {
      toast.success(`Payment ${status}`)
      fetchOrders()
    } else {
      toast.error('Update failed')
    }
  }

  const updateOrderStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, order_status: status }),
    })
    if (res.ok) {
      toast.success(`Order → ${status}`)
      fetchOrders()
    } else {
      toast.error('Update failed')
    }
  }

  const filtered = orders.filter((o) =>
    [o.order_ref, o.customer_name, o.customer_phone].some(
      (v) => v?.toLowerCase().includes(search.toLowerCase())
    )
  )

  if (loading) {
    return (
      <div style={{ padding: '40px 32px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading orders...
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, marginBottom: 28,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700, color: '#1a0a05',
          }}>
            Orders
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 4 }}>
            {orders.length} total
          </p>
        </div>
        <div style={{ position: 'relative', width: 240 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', border: '1.5px solid var(--color-border)', borderRadius: 14,
              padding: '11px 14px 11px 40px', fontSize: 13,
              outline: 'none', background: '#fff', color: '#1a0a05',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: '#fff', borderRadius: 24,
          border: '2px dashed var(--color-border)',
        }}>
          <p style={{
            fontSize: 18, fontWeight: 700, color: '#1a0a05',
            fontFamily: "'Playfair Display', serif",
          }}>
            {search ? 'No matching orders' : 'No orders yet'}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: 6 }}>
            {search ? 'Try a different search term' : 'Orders will appear here once customers place them'}
          </p>
        </div>
      )}

      {/* Order cards */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((order) => {
            const payment = paymentConfig[order.payment_status] || { bg: '#f5f5f5', color: '#666', label: order.payment_status }
            const orderSt = orderConfig[order.order_status] || { bg: '#f5f5f5', color: '#666' }

            return (
              <div
                key={order.id}
                className="rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#fff', border: '1px solid var(--color-border)',
                  padding: '24px', position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Decorative accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: 4, height: '100%',
                  background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
                  borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
                }} />

                {/* Top row */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  alignItems: 'flex-start', justifyContent: 'space-between',
                  gap: 12, marginBottom: 16,
                }}>
                  <div>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 17, fontWeight: 700, color: '#1a0a05',
                    }}>
                      {order.order_ref}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '5px 14px',
                      borderRadius: 20, background: payment.bg, color: payment.color,
                    }}>
                      {payment.label}
                    </span>
                    <span style={{
                      fontSize: 24, fontWeight: 700, color: 'var(--color-accent)',
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      ₹{order.total_price}
                    </span>
                  </div>
                </div>

                {/* Detail grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '8px 24px', fontSize: 13, color: 'var(--color-text-body)',
                  padding: '16px 18px', background: 'var(--color-bg)',
                  borderRadius: 14, marginBottom: 16,
                }}>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Customer</span><p style={{ marginTop: 2 }}>{order.customer_name}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Phone</span><p style={{ marginTop: 2 }}>{order.customer_phone}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Cake</span><p style={{ marginTop: 2 }}>{order.cake_name}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Address</span><p style={{ marginTop: 2 }}>{order.customer_address}</p></div>
                  {order.delivery_date && (
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>Delivery</span><p style={{ marginTop: 2 }}>{order.delivery_date}</p></div>
                  )}
                  {order.upi_ref && (
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>UPI Ref</span><p style={{ marginTop: 2 }}>{order.upi_ref}</p></div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  {order.payment_status === 'pending_verification' && (
                    <>
                      <button
                        onClick={() => updatePayment(order.id, 'confirmed')}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#2e7d32', color: '#fff', border: 'none',
                          borderRadius: 10, padding: '9px 18px',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        ✓ Confirm Payment
                      </button>
                      <button
                        onClick={() => updatePayment(order.id, 'rejected')}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#c62828', color: '#fff', border: 'none',
                          borderRadius: 10, padding: '9px 18px',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  <div style={{ position: 'relative', marginLeft: 'auto' }}>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        appearance: 'none', fontSize: 12, fontWeight: 700,
                        padding: '9px 38px 9px 16px', borderRadius: 10, border: 'none',
                        cursor: 'pointer', background: orderSt.bg, color: orderSt.color,
                      }}
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}