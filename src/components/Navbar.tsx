'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu, X, Moon, Sun } from 'lucide-react'
import { useCart } from '@/lib/cartStore'
import { useTheme } from '@/components/ThemeProvider'
import Image from 'next/image'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const totalItems = useCart((s) => s.totalItems())
  const { theme, toggle } = useTheme()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/product', label: 'Our Cakes' },
    { href: '/#about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <nav style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }} className="sticky top-0 z-50 shadow-sm">
      <div className="ml-[clamp(1rem,3vw,3rem)] mr-[clamp(1rem,3vw,3rem)] h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo-Photoroom.png"
            alt="Vamalinc Cakes"
            width={140}
            height={46}
            className="object-contain w-auto h-8 sm:h-10"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-medium transition-colors text-sm"
              style={{ color: 'var(--color-text-body)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-accent)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-body)'}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={toggle}
            title={theme === 'navy' ? 'Switch to Pink Theme' : 'Switch to Navy Theme'}
            className="size-9 rounded-xl flex items-center justify-center border-none text-white cursor-pointer transition-all shrink-0"
            style={{
              background: theme === 'pink'
                ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
                : 'linear-gradient(135deg, #1e3a5f, #2c5282)',
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

          <Link href="/cart" className="relative p-2.5 sm:p-3 mr-1 sm:mr-2 rounded-xl transition-colors hover:bg-[var(--color-accent-light)]">
            <ShoppingCart style={{ color: 'var(--color-text-body)' }} className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalItems > 0 && (
              <span style={{ background: 'var(--color-accent)' }} className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            style={{ color: 'var(--color-text-body)' }}
          >
            {open ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid var(--color-border)', background: '#fff' }} className="md:hidden px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-medium py-1"
              style={{ color: 'var(--color-text-body)' }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
