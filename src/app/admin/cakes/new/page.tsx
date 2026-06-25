'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function NewCakePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  })

  const [options, setOptions] = useState([
    { option_type: 'size', label: '', extra_price: '' },
  ])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    console.log('File selected:', file.name, file.size, file.type)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const addOption = () =>
    setOptions([...options, { option_type: 'size', label: '', extra_price: '' }])

  const removeOption = (i: number) =>
    setOptions(options.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price) {
      toast.error('Name and price are required')
      return
    }
    setSaving(true)

    try {
      // STEP 1 — Upload image
      let image_url = ''
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`

        console.log('Uploading image:', fileName)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cake-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          toast.error(`Image upload failed: ${uploadError.message}`)
          setSaving(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('cake-images')
          .getPublicUrl(uploadData.path)

        image_url = urlData.publicUrl
        console.log('Image uploaded:', image_url)
      }

      // STEP 2 — Insert cake
      console.log('Inserting cake...')
      const { data: cake, error: cakeError } = await supabase
        .from('cakes')
        .insert({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          category: form.category,
          image_url,
          available: form.available,
        })
        .select()
        .single()

      if (cakeError) {
        console.error('Cake insert error:', cakeError)
        toast.error(`Could not save cake: ${cakeError.message}`)
        setSaving(false)
        return
      }

      console.log('Cake saved:', cake)

      // STEP 3 — Insert customization options
      const validOptions = options.filter((o) => o.label.trim())
      if (validOptions.length > 0) {
        const { error: optError } = await supabase
          .from('customization_options')
          .insert(
            validOptions.map((o) => ({
              cake_id: cake.id,
              option_type: o.option_type,
              label: o.label,
              extra_price: parseFloat(o.extra_price) || 0,
            }))
          )

        if (optError) {
          console.error('Options insert error:', optError)
          // Cake saved but options failed — still go to cakes page
          toast.error(`Cake saved but options failed: ${optError.message}`)
        }
      }

      toast.success('Cake added!')
      router.push('/admin/cakes')

    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Something went wrong. Check console.')
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Add new cake</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cake image
          </label>
          <label
            htmlFor="image-upload"
            className="border-2 border-dashed border-pink-200 rounded-xl p-4 text-center cursor-pointer hover:border-pink-400 transition block"
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-48 mx-auto rounded-lg object-cover"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-4xl mb-2">📷</p>
                <p className="text-gray-500 text-sm font-medium">
                  Click to upload image
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  JPG, PNG, WEBP supported
                </p>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Basic fields */}
        {[
          { label: 'Cake name *', key: 'name', type: 'text', placeholder: 'Chocolate Truffle' },
          { label: 'Description', key: 'description', type: 'text', placeholder: 'Rich chocolate layers...' },
          { label: 'Base price (₹) *', key: 'price', type: 'number', placeholder: '799' },
          { label: 'Category', key: 'category', type: 'text', placeholder: 'Birthday, Wedding, Custom...' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.key as keyof typeof form] as string}
              onChange={(e) =>
                setForm({ ...form, [field.key]: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        ))}

        {/* Available toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="available"
            checked={form.available}
            onChange={(e) =>
              setForm({ ...form, available: e.target.checked })
            }
            className="w-4 h-4 accent-pink-600"
          />
          <label htmlFor="available" className="text-sm font-medium text-gray-700">
            Available for ordering
          </label>
        </div>

        {/* Customization options */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Customization options
            </label>
            <button
              type="button"
              onClick={addOption}
              className="text-pink-600 text-sm font-medium hover:underline"
            >
              + Add option
            </button>
          </div>
          <div className="space-y-3">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={opt.option_type}
                  onChange={(e) => {
                    const updated = [...options]
                    updated[i].option_type = e.target.value
                    setOptions(updated)
                  }}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="size">Size</option>
                  <option value="flavour">Flavour</option>
                  <option value="topping">Topping</option>
                </select>
                <input
                  type="text"
                  placeholder="e.g. 1kg"
                  value={opt.label}
                  onChange={(e) => {
                    const updated = [...options]
                    updated[i].label = e.target.value
                    setOptions(updated)
                  }}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <input
                  type="number"
                  placeholder="+₹0"
                  value={opt.extra_price}
                  onChange={(e) => {
                    const updated = [...options]
                    updated[i].extra_price = e.target.value
                    setOptions(updated)
                  }}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  className="text-red-400 hover:text-red-600 text-xl px-1 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </span>
          ) : (
            'Save cake'
          )}
        </button>

      </form>
    </div>
  )
}