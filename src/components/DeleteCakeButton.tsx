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
      style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        border: '1.5px solid #ffcdd2',
        borderRadius: 12,
        padding: '10px 0',
        fontSize: 13,
        fontWeight: 600,
        color: '#e57373',
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#fff5f5'
        e.currentTarget.style.borderColor = '#ef9a9a'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#fff'
        e.currentTarget.style.borderColor = '#ffcdd2'
      }}
    >
      Delete
    </button>
  )
}
