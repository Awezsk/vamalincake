'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cartStore'
import { Cake, CustomizationOption } from '@/types'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)

  const [cake, setCake] = useState<Cake | null>(null)
  const [options, setOptions] = useState<CustomizationOption[]>([])
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: cakeData } = await supabase
        .from('cakes')
        .select('*')
        .eq('id', id)
        .single()

      const { data: optData } = await supabase
        .from('customization_options')
        .select('*')
        .eq('cake_id', id)

      setCake(cakeData)
      setOptions(optData || [])
      setLoading(false)
    }
    fetchData()
  }, [id])

  const optionTypes = [...new Set(options.map((o) => o.option_type))]

  const extraPrice = options
    .filter((o) => selected[o.option_type] === o.label)
    .reduce((sum, o) => sum + o.extra_price, 0)

  const totalPrice = (cake?.price || 0) + extraPrice

  const handleAddToCart = () => {
    if (!cake || adding) return
    setAdding(true)
    addItem(cake, selected, extraPrice)
    toast.success('Added to cart!')
    setTimeout(() => { router.push('/cart') }, 400)
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="size-10 rounded-full border-2 border-[var(--color-accent)] border-t-transparent animate-spin" />
      </div>
    </>
  )
  if (!cake) return (
    <>
      <Navbar />
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🎂</span>
        <p className="text-[var(--color-text-muted)]">Cake not found</p>
        <button onClick={() => router.push('/product')} className="text-sm text-[var(--color-accent)] underline underline-offset-2">
          Browse all cakes
        </button>
      </div>
    </>
  )

  return (
    <>
      <Navbar />
      <main className="ml-[clamp(1rem,3vw,3rem)] mr-[clamp(1rem,3vw,3rem)] py-8 md:py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square rounded-2xl overflow-hidden group"
          >
            {/* Decorative background blobs */}
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-[var(--color-accent)]/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-[var(--color-accent)]/8 blur-3xl pointer-events-none" />

            <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-[var(--color-accent-light)] to-[var(--color-accent-very-light)] flex items-center justify-center overflow-hidden">
              {cake.image_url ? (
                <Image
                  src={cake.image_url}
                  alt={cake.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <span className="text-8xl select-none">🎂</span>
              )}
            </div>

            {/* Category badge */}
            <div className="absolute top-5 left-5">
              <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-accent)] shadow-sm">
                {cake.category}
              </span>
            </div>

            {/* Price badge */}
            <div className="absolute top-5 right-5">
              <span className="text-lg font-bold px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-accent)] shadow-sm">
                ₹{cake.price}
              </span>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-heading)] font-[var(--font-display)] leading-tight">
              {cake.name}
            </h1>

            <p className="text-[var(--color-text-body)] mt-3 leading-relaxed">
              {cake.description}
            </p>

            {/* Total price */}
            <motion.div
              key={totalPrice}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="mt-6 flex items-baseline gap-2"
            >
              <span className="text-3xl font-bold text-[var(--color-accent)]">₹{totalPrice}</span>
              {extraPrice > 0 && (
                <span className="text-sm text-[var(--color-text-muted)]">
                  (₹{cake.price} + ₹{extraPrice} extras)
                </span>
              )}
            </motion.div>

            {/* Customization */}
            {optionTypes.length > 0 && (
              <div className="mt-8 space-y-6 flex-1">
                <h2 className="text-lg font-semibold text-[var(--color-text-heading)]">Customise your cake</h2>
                {optionTypes.map((type, ti) => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + ti * 0.08 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                      {type}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {options
                        .filter((o) => o.option_type === type)
                        .map((opt, oi) => {
                          const active = selected[type] === opt.label
                          return (
                            <motion.button
                              key={opt.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelected((prev) => ({ ...prev, [type]: opt.label }))}
                              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                active
                                  ? 'text-white shadow-md'
                                  : 'text-[var(--color-text-body)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                              }`}
                              style={active ? { background: 'var(--color-accent)' } : {}}
                            >
                              {opt.label}
                              {opt.extra_price > 0 && (
                                <span className={`ml-1.5 text-xs ${active ? 'opacity-80' : 'text-[var(--color-text-muted)]'}`}>
                                  +₹{opt.extra_price}
                                </span>
                              )}
                            </motion.button>
                          )
                        })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add to cart */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={adding}
              className="mt-8 w-full py-4 rounded-xl text-lg font-semibold text-white transition-all shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-xl hover:shadow-[var(--color-accent)]/30"
              style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' }}
            >
              {adding ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Adding...
                </span>
              ) : (
                <>Add to Cart — ₹{totalPrice}</>
              )}
            </motion.button>
          </motion.div>
        </div>
      </main>
    </>
  )
}
