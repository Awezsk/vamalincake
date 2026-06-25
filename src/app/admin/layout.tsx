import Link from 'next/link'
import { LayoutDashboard, Cake, ShoppingBag, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/cakes', icon: Cake, label: 'Cakes' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <p className="text-xl font-bold text-pink-600">🎂 Admin</p>
          <p className="text-xs text-gray-400 mt-1">Vamalinc Cakes</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors font-medium"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-500 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}