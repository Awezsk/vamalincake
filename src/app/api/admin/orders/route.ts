import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET — fetch all orders
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

// PATCH — update payment_status or order_status
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, payment_status, order_status } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const updates: Record<string, string> = {}
  if (payment_status) updates.payment_status = payment_status
  if (order_status) updates.order_status = order_status

  const { error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}