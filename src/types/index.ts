export type Cake = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  available: boolean
  created_at: string
}

export type CustomizationOption = {
  id: string
  cake_id: string
  option_type: 'size' | 'flavour' | 'topping'
  label: string
  extra_price: number
}

export type Order = {
  id: string
  order_ref: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  cake_id: string
  cake_name: string
  customizations: Record<string, string>
  total_price: number
  payment_status: 'pending_verification' | 'confirmed' | 'rejected'
  order_status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  upi_ref: string
  delivery_date: string
  created_at: string
}

export type CartItem = {
  cake: Cake
  customizations: Record<string, string>
  extraPrice: number
  quantity: number
}