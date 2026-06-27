'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

type CakeOption = {
  id: string
  name: string
  image_url: string
  price: number
}

export default function FeaturedCakePicker({
  cakes,
  currentFeaturedId,
}: {
  cakes: CakeOption[]
  currentFeaturedId: string | null
}) {
  const [selected, setSelected] = useState<string | null>(currentFeaturedId)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('settings')
      .update({ value: selected })
      .eq('key', 'featured_cake_id')

    if (error) {
      toast.error('Could not update featured cake')
    } else {
      toast.success('Homepage hero updated!')
    }
    setSaving(false)
  }

  const handleClear = async () => {
    setSaving(true)
    await supabase
      .from('settings')
      .update({ value: null })
      .eq('key', 'featured_cake_id')
    setSelected(null)
    toast.success('Hero reset to default')
    setSaving(false)
  }

  return (
    <div className="bg-white border border-pink-100 rounded-2xl p-6 mb-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">🏠 Homepage Hero Cake</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Pick which cake shows in the hero section on your homepage
          </p>
        </div>
        <div className="flex gap-2">
          {selected && (
            <button
              onClick={handleClear}
              disabled={saving}
              className="text-sm text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-gray-200 transition"
            >
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !selected}
            className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {cakes.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No cakes added yet. Add a cake first.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {cakes.map((cake) => (
            <button
              key={cake.id}
              onClick={() => setSelected(cake.id)}
              className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                selected === cake.id
                  ? 'border-pink-500 shadow-md shadow-pink-100'
                  : 'border-gray-100 hover:border-pink-200'
              }`}
            >
              {/* Image */}
              <div className="h-24 bg-pink-50 flex items-center justify-center overflow-hidden">
                {cake.image_url ? (
                  <img
                    src={cake.image_url}
                    alt={cake.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🎂</span>
                )}
              </div>
              {/* Info */}
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-700 truncate">{cake.name}</p>
                <p className="text-xs text-pink-600 font-bold">₹{cake.price}</p>
                {selected === cake.id && (
                  <p className="text-xs text-pink-500 font-medium mt-1">✓ Selected</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}