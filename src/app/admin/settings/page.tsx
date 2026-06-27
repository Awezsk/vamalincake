'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings?key=hero_image_url')
      .then((r) => r.json())
      .then((data) => {
        if (data?.value) {
          setCurrentUrl(data.value)
          setPreview(data.value)
        }
      })
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `hero/hero-cake-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('cake-images')
        .upload(path, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('cake-images')
        .getPublicUrl(path)

      setCurrentUrl(urlData.publicUrl)
      setPreview(urlData.publicUrl)
      toast.success('Image uploaded! Click Save to apply.')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'hero_image_url', value: currentUrl }),
    })
    setSaving(false)
    if (res.ok) {
      toast.success('Hero image updated! Changes are live.')
    } else {
      toast.error('Failed to save')
    }
  }

  const handleClear = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'hero_image_url', value: '' }),
    })
    setSaving(false)
    setCurrentUrl('')
    setPreview('')
    toast.success('Cleared — homepage will show default 🎂 emoji')
  }

  return (
    <div style={{ padding: '40px 32px', maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 6, height: 28, borderRadius: 3,
            background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-dark))',
          }} />
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, fontWeight: 700, color: '#1a0a05',
          }}>
            Homepage Settings
          </h1>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginLeft: 18 }}>
          Update the hero cake image shown on the homepage
        </p>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 24,
        border: '1px solid var(--color-border)',
        padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        <p style={{
          fontSize: 13, fontWeight: 700, color: '#1a0a05',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          marginBottom: 20,
        }}>
          Hero Cake Image
        </p>

        {/* Preview */}
        <div style={{
          width: '100%', height: 260, borderRadius: 18,
          background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-accent-very-light))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, overflow: 'hidden',
          border: '2px dashed var(--color-border)',
        }}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Hero preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 64 }}>🎂</span>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 8 }}>
                No image set — default emoji shown
              </p>
            </div>
          )}
        </div>

        {/* Upload button */}
        <input
          type="file" accept="image/*" ref={fileRef}
          onChange={handleFileUpload} style={{ display: 'none' }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12,
            border: '2px dashed var(--color-accent)',
            background: 'var(--color-accent-light)',
            color: 'var(--color-accent)', fontWeight: 700,
            fontSize: 14, cursor: uploading ? 'not-allowed' : 'pointer',
            marginBottom: 16,
          }}
        >
          {uploading ? '⏳ Uploading...' : '📁 Upload New Image'}
        </button>

        {/* Manual URL input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            display: 'block', marginBottom: 6,
          }}>
            Or paste image URL directly
          </label>
          <input
            type="url"
            value={currentUrl}
            onChange={(e) => { setCurrentUrl(e.target.value); setPreview(e.target.value) }}
            placeholder="https://..."
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: '1.5px solid var(--color-border)',
              fontSize: 14, color: '#1a0a05', outline: 'none',
              boxSizing: 'border-box', background: 'var(--color-bg)',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleSave}
            disabled={saving || !currentUrl}
            style={{
              flex: 1, padding: '13px', borderRadius: 12, border: 'none',
              background: saving || !currentUrl ? '#ccc' : 'var(--color-accent)',
              color: '#fff', fontWeight: 700, fontSize: 14,
              cursor: saving || !currentUrl ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : '✓ Save Changes'}
          </button>
          <button
            onClick={handleClear}
            disabled={saving}
            style={{
              padding: '13px 20px', borderRadius: 12,
              border: '1.5px solid #c62828',
              background: '#fff0f0', color: '#c62828',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>

        <p style={{
          fontSize: 12, color: 'var(--color-text-muted)',
          marginTop: 14, textAlign: 'center',
        }}>
          💡 Changes go live on the homepage instantly after saving
        </p>
      </div>
    </div>
  )
}