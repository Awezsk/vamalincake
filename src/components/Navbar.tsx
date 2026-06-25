'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cartStore'
import Image from 'next/image'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const totalItems = useCart((s) => s.totalItems())

  const links = [
    { href: '/', label: 'Home' },
    { href: '/product', label: 'Our Cakes' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-Photoroom.png"
            alt="Vamalinc Cakes"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-gray-600 hover:text-pink-600 transition-colors font-medium"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Cart + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-gray-700 font-medium text-lg py-1"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}