'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cartStore'
import Navbar from '@/components/Navbar'

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-5xl">🛒</p>
          <p className="text-xl text-gray-500">Your cart is empty</p>
          <Link
            href="/product"
            className="bg-pink-600 text-white px-6 py-3 rounded-xl font-medium"
          >
            Browse Cakes
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 bg-white border border-pink-50 rounded-2xl p-4 shadow-sm"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                {item.cake.image_url ? (
                  <Image src={item.cake.image_url} alt={item.cake.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">🎂</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.cake.name}</h3>
                {Object.entries(item.customizations).length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {Object.entries(item.customizations)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </p>
                )}
                <p className="text-pink-600 font-bold mt-1">
                  ₹{item.cake.price + item.extraPrice}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.cake.id)}
                className="text-red-400 hover:text-red-600 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="bg-pink-50 rounded-2xl p-6">
          <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
            <span>Total</span>
            <span className="text-pink-600">₹{totalPrice()}</span>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-pink-600 hover:bg-pink-700 text-white text-center py-4 rounded-xl text-lg font-semibold transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </main>
    </>
  )
}