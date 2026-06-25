'use client'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export default function DeleteCakeButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Delete this cake?')) return
    const { error } = await supabase.from('cakes').delete().eq('id', id)
    if (error) {
      toast.error('Could not delete')
    } else {
      toast.success('Cake deleted')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex-1 text-center border border-red-100 text-red-400 rounded-lg py-1.5 text-sm hover:bg-red-50 transition"
    >
      Delete
    </button>
  )
}