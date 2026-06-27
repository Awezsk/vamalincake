'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'react-qr-code'
import { useCart } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import { generateUPILink } from '@/lib/upi'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID!
const SHOP_NAME = process.env.NEXT_PUBLIC_SHOP_NAME!

// ── Coupon config ──────────────────────────────────────────────
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; minOrder: number }> = {
  CAKE20: { type: 'percent', value: 20, minOrder: 600 },
}

type Step = 'details' | 'payment' | 'confirmed'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<Step>('details')
  const [orderId] = useState(() => `ORD-${Date.now()}`)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', delivery_date: '', upi_ref: '',
  })

  // ── Coupon state ───────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<null | {
    code: string; type: 'percent' | 'flat'; value: number
  }>(null)
  const [couponError, setCouponError] = useState('')

  const rawTotal = totalPrice()

  const discount = (() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percent') {
      return Math.round(rawTotal * appliedCoupon.value / 100)
    }
    return appliedCoupon.value
  })()

  const finalTotal = Math.max(0, rawTotal - discount)

  const applyCoupon = () => {
    setCouponError('')
    const code = couponInput.trim().toUpperCase()
    const coupon = COUPONS[code]
    if (!coupon) {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
      return
    }
    if (rawTotal < coupon.minOrder) {
      setCouponError(`Minimum order ₹${coupon.minOrder} required for this coupon`)
      setAppliedCoupon(null)
      return
    }
    setAppliedCoupon({ code, type: coupon.type, value: coupon.value })
    toast.success(`Coupon applied! You save ₹${discount || '...'}`)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError('')
  }

  const upiLink = generateUPILink({
    upiId: UPI_ID,
    name: SHOP_NAME,
    amount: finalTotal,
    orderId,
  })

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill all required fields')
      return
    }
    setStep('payment')
  }

  const handlePaymentConfirm = async () => {
    setSaving(true)
    try {
      for (const item of items) {
        await supabase.from('orders').insert({
          order_ref: orderId,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          cake_id: item.cake.id,
          cake_name: item.cake.name,
          customizations: item.customizations,
          total_price: finalTotal,
          payment_status: 'pending_verification',
          order_status: 'received',
          upi_ref: form.upi_ref,
          delivery_date: form.delivery_date || null,
          coupon_code: appliedCoupon?.code || null,
          discount_amount: discount,
        })
      }
      clearCart()
      setStep('confirmed')
    } catch {
      toast.error('Something went wrong. Please contact us.')
    } finally {
      setSaving(false)
    }
  }

  if (items.length === 0 && step !== 'confirmed') {
    router.push('/product')
    return null
  }

  return (
    <>
      <Navbar />
      <main className="ml-[clamp(1rem,3vw,3rem)] mr-[clamp(1rem,3vw,3rem)] py-10">

        {/* STEP 1 — Customer details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-5">
            <h1 className="text-2xl font-bold text-gray-800">Delivery details</h1>

            {[
              { label: 'Full name *', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
              { label: 'Phone number *', key: 'phone', type: 'tel', placeholder: '9876543210' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'priya@email.com' },
              { label: 'Delivery address *', key: 'address', type: 'text', placeholder: 'Flat 4B, Nagpur...' },
              { label: 'Preferred delivery date', key: 'delivery_date', type: 'date', placeholder: '' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            ))}

            {/* ── Coupon code ───────────────────────────────────────── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon code
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <span className="text-green-700 font-semibold text-sm">
                    ✓ <strong>{appliedCoupon.code}</strong> applied —{' '}
                    {appliedCoupon.type === 'percent'
                      ? `${appliedCoupon.value}% off`
                      : `₹${appliedCoupon.value} off`}
                  </span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-500 text-sm font-semibold ml-4"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. CAKE20"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase())
                      setCouponError('')
                    }}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300 uppercase"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-pink-100 text-pink-700 font-semibold px-5 rounded-xl text-sm border border-pink-200"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-1">{couponError}</p>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-pink-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Order summary</p>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
                  <span>{item.cake.name}</span>
                  <span>₹{item.cake.price + item.extraPrice}</span>
                </div>
              ))}
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-green-600 py-1">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>− ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-pink-600 mt-2 pt-2 border-t border-pink-100">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl text-lg font-semibold"
            >
              Continue to Payment
            </button>
          </form>
        )}

        {/* STEP 2 — UPI Payment */}
        {step === 'payment' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Pay via UPI</h1>

            <div className="bg-pink-50 rounded-2xl p-6 text-center">
              {discount > 0 && (
                <p className="text-sm text-gray-400 line-through mb-1">₹{rawTotal}</p>
              )}
              <p className="text-4xl font-bold text-pink-600">₹{finalTotal}</p>
              {discount > 0 && (
                <p className="text-green-600 text-sm font-semibold mt-1">
                  You saved ₹{discount} 🎉
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">Pay to {UPI_ID}</p>
              <p className="text-gray-400 text-xs mt-1">Order: {orderId}</p>
            </div>

            {/* Mobile: direct UPI deep link */}
            <a
              href={upiLink}
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 rounded-xl text-lg font-semibold"
            >
              Open UPI App (GPay / PhonePe / Paytm)
            </a>

            {/* Desktop: QR code */}
            <div className="border border-gray-100 rounded-2xl p-6 text-center">
              <p className="text-sm text-gray-500 mb-4">Or scan QR code with your phone</p>
              <div className="flex justify-center">
                <QRCode value={upiLink} size={180} />
              </div>
              <p className="text-sm font-medium text-gray-700 mt-3">{UPI_ID}</p>
            </div>

            {/* UPI reference number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI transaction ID (optional but helpful)
              </label>
              <input
                type="text"
                placeholder="e.g. 4029384756"
                value={form.upi_ref}
                onChange={(e) => setForm({ ...form, upi_ref: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <button
              onClick={handlePaymentConfirm}
              disabled={saving}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold"
            >
              {saving ? 'Saving order...' : "I've completed the payment"}
            </button>

            <button
              onClick={() => setStep('details')}
              className="w-full text-gray-500 text-sm"
            >
              ← Back to details
            </button>
          </div>
        )}

        {/* STEP 3 — Confirmed */}
        {step === 'confirmed' && (
          <div className="text-center py-16 space-y-4">
            <p className="text-6xl">🎉</p>
            <h1 className="text-2xl font-bold text-gray-800">Order placed!</h1>
            <p className="text-gray-500">
              Your order <strong>{orderId}</strong> has been received.
              We will confirm once payment is verified.
            </p>
            <p className="text-gray-500 text-sm">
              We'll contact you at {form.phone}
            </p>
            <button
              onClick={() => router.push('/product')}
              className="bg-pink-600 text-white px-8 py-3 rounded-xl font-medium mt-4"
            >
              Order more cakes
            </button>
          </div>
        )}
      </main>
    </>
  )
}