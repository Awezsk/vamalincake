'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types'
import toast from 'react-hot-toast'

const paymentColors: Record<string, string> = {
  pending_verification: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

const orderColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  ready: 'bg-teal-100 text-teal-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
    toast.success('Payment status updated')
    fetchOrders()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ order_status: status }).eq('id', id)
    toast.success('Order status updated')
    fetchOrders()
  }

  if (loading) return <div className="p-6 text-gray-400">Loading orders...</div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Orders
        <span className="ml-3 text-base font-normal text-gray-400">
          {orders.length} total
        </span>
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{order.order_ref}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-xl font-bold text-pink-600">₹{order.total_price}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Customer:</span> {order.customer_name}</p>
                <p><span className="font-medium">Phone:</span> {order.customer_phone}</p>
                <p><span className="font-medium">Cake:</span> {order.cake_name}</p>
                <p><span className="font-medium">Address:</span> {order.customer_address}</p>
                {order.delivery_date && (
                  <p><span className="font-medium">Delivery:</span> {order.delivery_date}</p>
                )}
                {order.upi_ref && (
                  <p><span className="font-medium">UPI Ref:</span> {order.upi_ref}</p>
                )}
                {order.customizations && Object.keys(order.customizations).length > 0 && (
                  <p className="sm:col-span-2">
                    <span className="font-medium">Customizations:</span>{' '}
                    {Object.entries(order.customizations).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Payment status */}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${paymentColors[order.payment_status]}`}>
                  {order.payment_status.replace('_', ' ')}
                </span>

                {order.payment_status === 'pending_verification' && (
                  <>
                    <button
                      onClick={() => updatePayment(order.id, 'confirmed')}
                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium"
                    >
                      ✓ Confirm payment
                    </button>
                    <button
                      onClick={() => updatePayment(order.id, 'rejected')}
                      className="text-xs bg-red-400 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg font-medium"
                    >
                      ✗ Reject
                    </button>
                  </>
                )}

                {/* Order status */}
                <select
                  value={order.order_status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className={`text-xs px-2 py-1.5 rounded-lg border-0 font-medium cursor-pointer ${orderColors[order.order_status]}`}
                >
                  <option value="received">Received</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}