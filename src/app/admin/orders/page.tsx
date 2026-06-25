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
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updatePayment = async (id: string, status: string) => {
    await supabase.from('orders').update({ payment_status: status }).eq('id', id)
    toast.success(`Payment ${status}`)
    fetchOrders()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ order_status: status }).eq('id', id)
    toast.success(`Order → ${status}`)
    fetchOrders()
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
          <div style={{
            width: 72, height: 72, borderRadius: 24,
            background: 'var(--color-tag-bg)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-dark)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
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
                    boxShadow: '0 0 0 rgba(var(--color-accent-rgb), 0)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(var(--color-accent-rgb), 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 rgba(var(--color-accent-rgb), 0)'
                  }}
                >
                  {/* Decorative accent */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: 4, height: '100%',
                    background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
                    borderTopLeftRadius: 16, borderBottomLeftRadius: 16,
                  }} />
                {/* Top row: ref + price + statuses */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  alignItems: 'flex-start', justifyContent: 'space-between',
                  gap: 12, marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'var(--color-accent-light)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </div>
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

                {/* Detail grid — 2-col consistent layout */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px 24px',
                  fontSize: 13, color: 'var(--color-text-body)',
                  padding: '16px 18px', background: 'var(--color-bg)',
                  borderRadius: 14, marginBottom: 16,
                }}>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customer</span><p style={{ marginTop: 2 }}>{order.customer_name}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Phone</span><p style={{ marginTop: 2 }}>{order.customer_phone}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cake</span><p style={{ marginTop: 2 }}>{order.cake_name}</p></div>
                  <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Address</span><p style={{ marginTop: 2 }}>{order.customer_address}</p></div>
                  {order.delivery_date && (
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Delivery</span><p style={{ marginTop: 2 }}>{order.delivery_date}</p></div>
                  )}
                  {order.upi_ref && (
                    <div><span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>UPI Ref</span><p style={{ marginTop: 2 }}>{order.upi_ref}</p></div>
                  )}
                  {order.customizations && Object.keys(order.customizations).length > 0 && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customizations</span>
                      <p style={{ marginTop: 2 }}>{Object.entries(order.customizations).map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
                    </div>
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
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#1b5e20'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#2e7d32'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Confirm Payment
                      </button>
                      <button
                        onClick={() => updatePayment(order.id, 'rejected')}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#c62828', color: '#fff', border: 'none',
                          borderRadius: 10, padding: '9px 18px',
                          fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#b71c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#c62828'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Reject
                      </button>
                    </>
                  )}

                  {/* Order status selector */}
                  <div style={{ position: 'relative', marginLeft: 'auto' }}>
                    <select
                      value={order.order_status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        appearance: 'none',
                        fontSize: 12, fontWeight: 700,
                        padding: '9px 38px 9px 16px',
                        borderRadius: 10, border: 'none',
                        cursor: 'pointer',
                        background: orderSt.bg, color: orderSt.color,
                      }}
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={orderSt.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
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
