'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, X, Upload } from 'lucide-react'

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
      let image_url = ''
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cake-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: imageFile.type,
          })

        if (uploadError) {
          toast.error(`Image upload failed: ${uploadError.message}`)
          setSaving(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('cake-images')
          .getPublicUrl(uploadData.path)

        image_url = urlData.publicUrl
      }

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
        toast.error(`Could not save cake: ${cakeError.message}`)
        setSaving(false)
        return
      }

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
          toast.error(`Cake saved but options failed: ${optError.message}`)
        }
      }

      toast.success('Cake added!')
      router.push('/admin/cakes')

    } catch (err) {
      toast.error('Something went wrong. Check console.')
      setSaving(false)
    }
  }

  return (
    <div style={{
      padding: '40px 32px', maxWidth: 680, margin: '0 auto',
      position: 'relative',
    }}>
      {/* Large background decorative blob */}
      <div style={{
        position: 'fixed', top: '20%', right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(var(--color-accent-rgb), 0.04)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '10%', left: -80,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
      }} />

      {/* Header section with back + title */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 32, flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a
            href="/admin/cakes"
            onClick={(e) => { e.preventDefault(); router.push('/admin/cakes') }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40,
              color: 'var(--color-text-muted)', background: '#fff',
              borderRadius: 14, textDecoration: 'none',
              border: '1.5px solid var(--color-border)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.color = 'var(--color-accent)'
              e.currentTarget.style.background = 'var(--color-accent-light)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text-muted)'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <ArrowLeft size={18} />
          </a>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26, fontWeight: 700, color: '#1a0a05',
            }}>
              Add New Cake
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>
              Create a new listing for your menu
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Card: Image Upload */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid var(--color-border)', padding: '28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}>
          {/* Decorative blobs */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.04)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, left: 60,
            width: 70, height: 70, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(var(--color-accent-rgb), 0.2)',
            }}>
              <Upload size={18} color="#fff" />
            </div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1a0a05' }}>
                Cake Image
              </span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                Upload a photo of your creation
              </p>
            </div>
          </div>
          <label
            htmlFor="image-upload"
            style={{
              border: '2px dashed var(--color-border)',
              borderRadius: 20,
              padding: imagePreview ? 12 : 40,
              textAlign: 'center',
              cursor: 'pointer',
              display: 'block',
              transition: 'all 0.2s',
              background: imagePreview ? 'var(--color-bg)' : '#fefcfb',
            }}
            onMouseEnter={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.background = 'var(--color-bg)'
              }
            }}
            onMouseLeave={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.background = '#fefcfb'
              }
            }}
          >
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="preview" style={{
                  width: '100%', maxHeight: 220,
                  borderRadius: 14, objectFit: 'cover',
                }} />
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>
                  Click to change image
                </p>
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                <div style={{
                  width: 68, height: 68, borderRadius: 20,
                  background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Upload size={28} color="var(--color-accent)" />
                </div>
                <p style={{ color: '#5a3b2e', fontSize: 15, fontWeight: 600 }}>
                  Drop an image or click to browse
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 12, marginTop: 6 }}>
                  JPG, PNG, WEBP — max 5MB
                </p>
              </div>
            )}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Card: Basic Details */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid var(--color-border)', padding: '28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -20,
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a0a05' }}>
              Basic Details
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Cake Name *', key: 'name', type: 'text', placeholder: 'Chocolate Truffle' },
              { label: 'Description', key: 'description', type: 'text', placeholder: 'Rich chocolate layers with smooth ganache...' },
              { label: 'Base Price (₹) *', key: 'price', type: 'number', placeholder: '799' },
              { label: 'Category', key: 'category', type: 'text', placeholder: 'Birthday, Wedding, Custom...' },
            ].map((field) => (
              <div key={field.key}>
                <label style={{
                  display: 'block', fontSize: 12, fontWeight: 600,
                  color: 'var(--color-text-body)', marginBottom: 7, textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form] as string}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  style={{
                    width: '100%',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 14,
                    padding: '14px 16px',
                    fontSize: 14,
                    color: '#1a0a05',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'var(--color-bg)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--color-accent-rgb), 0.1)'
                    e.currentTarget.style.background = '#fff'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Card: Availability */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid var(--color-border)', padding: '28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: -15, right: -15,
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a0a05' }}>
              Availability
            </span>
          </div>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 14,
            cursor: 'pointer', padding: '14px 18px',
            background: 'var(--color-bg)', borderRadius: 14,
            border: '1.5px solid var(--color-border)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={{
              position: 'relative', width: 48, height: 26,
              background: form.available ? 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))' : '#e0d6d0',
              borderRadius: 13, transition: 'all 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3, left: form.available ? 25 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
              }} />
            </div>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              style={{ display: 'none' }}
            />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a0a05' }}>
                Available for ordering
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
                Uncheck to hide from customers
              </p>
            </div>
          </label>
        </div>

        {/* Card: Customization Options */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid var(--color-border)', padding: '28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            position: 'absolute', top: -30, left: -30,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -20, right: 40,
            width: 70, height: 70, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1a0a05' }}>
                  Customization Options
                </span>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                  Let customers personalise their cake
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addOption}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--color-accent)', fontSize: 12, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
                border: 'none', borderRadius: 10, padding: '9px 16px',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(var(--color-accent-rgb), 0.12)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-very-light), #f0b8cc)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(var(--color-accent-rgb), 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(var(--color-accent-rgb), 0.12)'
              }}
            >
              <Plus size={14} />
              Add option
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, padding: '20px 0' }}>
                No options yet — click "Add option" above
              </p>
            ) : (
              options.map((opt, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: 'var(--color-bg)', padding: 14,
                  borderRadius: 14, border: '1.5px solid var(--color-border)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e8c8b8'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                  <select
                    value={opt.option_type}
                    onChange={(e) => {
                      const updated = [...options]
                      updated[i].option_type = e.target.value
                      setOptions(updated)
                    }}
                    style={{
                      border: '1.5px solid var(--color-border)', borderRadius: 10,
                      padding: '10px 12px', fontSize: 13,
                      outline: 'none', background: '#fff',
                      color: '#1a0a05', fontWeight: 500,
                    }}
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
                    style={{
                      flex: 1,
                      border: '1.5px solid var(--color-border)', borderRadius: 10,
                      padding: '10px 12px', fontSize: 13,
                      outline: 'none', background: '#fff',
                      color: '#1a0a05',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
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
                    style={{
                      width: 80,
                      border: '1.5px solid var(--color-border)', borderRadius: 10,
                      padding: '10px 12px', fontSize: 13,
                      outline: 'none', background: '#fff',
                      color: '#1a0a05',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = 'var(--color-accent)'}
                    onBlur={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      border: 'none', background: '#fff0f0',
                      color: '#e57373', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 16,
                      fontWeight: 700, transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fde0e0'
                      e.currentTarget.style.color = '#c62828'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fff0f0'
                      e.currentTarget.style.color = '#e57373'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: '1.5px solid var(--color-border)', padding: '24px 28px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: 20,
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(var(--color-accent-rgb), 0.03)', pointerEvents: 'none',
          }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            justifyContent: 'space-between', flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a0a05' }}>
                Ready to publish?
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 1 }}>
                Review the details before saving
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving
                  ? 'var(--color-border)'
                  : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 36px',
                fontSize: 15,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
                boxShadow: saving
                  ? 'none'
                  : '0 6px 20px rgba(var(--color-accent-rgb), 0.3)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent-medium), var(--color-accent-dark))'
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(var(--color-accent-rgb), 0.4)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(var(--color-accent-rgb), 0.3)'
                  e.currentTarget.style.transform = 'none'
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              {saving ? 'Saving...' : 'Save Cake'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
