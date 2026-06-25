export function generateUPILink({
  upiId,
  name,
  amount,
  orderId,
}: {
  upiId: string
  name: string
  amount: number
  orderId: string
}) {
  const note = encodeURIComponent(`Order ${orderId}`)
  const payeeName = encodeURIComponent(name)
  return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount.toFixed(2)}&cu=INR&tn=${note}`
}