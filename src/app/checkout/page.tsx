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

type Step = 'details' | 'payment' | 'confirmed'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<Step>('details')
  const [orderId] = useState(() => `ORD-${Date.now()}`)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    delivery_date: '',
    upi_ref: '',
  })

  const upiLink = generateUPILink({
    upiId: UPI_ID,
    name: SHOP_NAME,
    amount: totalPrice(),
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
          total_price: item.cake.price + item.extraPrice,
          payment_status: 'pending_verification',
          order_status: 'received',
          upi_ref: form.upi_ref,
          delivery_date: form.delivery_date || null,
        })
      }
      clearCart()
      setStep('confirmed')
    } catch (err) {
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

            {/* Order summary */}
            <div className="bg-pink-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Order summary</p>
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-600 py-1">
                  <span>{item.cake.name}</span>
                  <span>₹{item.cake.price + item.extraPrice}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-pink-600 mt-2 pt-2 border-t border-pink-100">
                <span>Total</span>
                <span>₹{totalPrice()}</span>
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
              <p className="text-4xl font-bold text-pink-600">₹{totalPrice()}</p>
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