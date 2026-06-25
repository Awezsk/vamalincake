import Link from 'next/link'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { Cake } from '@/types'
import DeleteCakeButton from '@/components/DeleteCakeButton'

export default async function AdminCakesPage() {
  const { data: cakes } = await supabaseAdmin
    .from('cakes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Cakes</h1>
        <Link
          href="/admin/cakes/new"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-medium text-sm"
        >
          + Add cake
        </Link>
      </div>

      {!cakes || cakes.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No cakes yet. Add your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cakes.map((cake: Cake) => (
            <div
              key={cake.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <div className="relative h-40 bg-pink-50">
                {cake.image_url ? (
                  <Image src={cake.image_url} alt={cake.name} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">🎂</div>
                )}
                <span
                  className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-medium ${
                    cake.available
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {cake.available ? 'Available' : 'Hidden'}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{cake.name}</h3>
                <p className="text-pink-600 font-bold">₹{cake.price}</p>
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/admin/cakes/${cake.id}`}
                    className="flex-1 text-center border border-gray-200 rounded-lg py-1.5 text-sm hover:border-pink-400 transition"
                  >
                    Edit
                  </Link>
                  <DeleteCakeButton id={cake.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}