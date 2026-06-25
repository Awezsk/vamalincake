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
    { label: 'Total Cakes', value: cakeCount || 0, href: '/admin/cakes', color: 'bg-pink-50 text-pink-600' },
    { label: 'Total Orders', value: orderCount || 0, href: '/admin/orders', color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Payment', value: pendingCount || 0, href: '/admin/orders', color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className={`${stat.color} rounded-2xl p-6 hover:opacity-80 transition`}>
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-1 opacity-80">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/cakes/new">
          <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center hover:border-pink-400 transition">
            <p className="text-4xl mb-2">🎂</p>
            <p className="font-semibold text-gray-700">Add new cake</p>
          </div>
        </Link>
        <Link href="/admin/orders">
          <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center hover:border-purple-400 transition">
            <p className="text-4xl mb-2">📦</p>
            <p className="font-semibold text-gray-700">View all orders</p>
          </div>
        </Link>
      </div>
    </div>
  )
}