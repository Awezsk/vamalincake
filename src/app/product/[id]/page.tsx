'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/lib/cartStore'
import { Cake, CustomizationOption } from '@/types'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)

  const [cake, setCake] = useState<Cake | null>(null)
  const [options, setOptions] = useState<CustomizationOption[]>([])
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

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
    if (!cake) return
    addItem(cake, selected, extraPrice)
    toast.success('Added to cart!')
    router.push('/cart')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!cake) return <div className="min-h-screen flex items-center justify-center">Cake not found</div>

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative h-80 md:h-full min-h-72 rounded-2xl overflow-hidden bg-pink-50">
            {cake.image_url ? (
              <Image src={cake.image_url} alt={cake.name} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl">🎂</div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
              {cake.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-800 mt-3">{cake.name}</h1>
            <p className="text-gray-500 mt-2">{cake.description}</p>
            <p className="text-2xl font-bold text-pink-600 mt-4">
              ₹{totalPrice}
              {extraPrice > 0 && (
                <span className="text-sm text-gray-400 font-normal ml-2">
                  (base ₹{cake.price} + extras ₹{extraPrice})
                </span>
              )}
            </p>

            {/* Customization */}
            {optionTypes.length > 0 && (
              <div className="mt-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Customize your cake</h2>
                {optionTypes.map((type) => (
                  <div key={type}>
                    <p className="text-sm font-medium text-gray-600 capitalize mb-2">{type}</p>
                    <div className="flex flex-wrap gap-2">
                      {options
                        .filter((o) => o.option_type === type)
                        .map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() =>
                              setSelected((prev) => ({ ...prev, [type]: opt.label }))
                            }
                            className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                              selected[type] === opt.label
                                ? 'bg-pink-600 text-white border-pink-600'
                                : 'border-gray-200 text-gray-600 hover:border-pink-400'
                            }`}
                          >
                            {opt.label}
                            {opt.extra_price > 0 && (
                              <span className="ml-1 opacity-70">+₹{opt.extra_price}</span>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="mt-8 w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
            >
              Add to Cart — ₹{totalPrice}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}