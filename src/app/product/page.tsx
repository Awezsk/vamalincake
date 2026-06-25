import { supabase } from '@/lib/supabase'
import { Cake } from '@/types'
import Navbar from '@/components/Navbar'
import CakeCard from '@/components/CakeCard'

export default async function ProductsPage() {
  const { data: cakes } = await supabase
    .from('cakes')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false })

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Cakes</h1>
        <p className="text-gray-500 mb-8">
          All cakes are freshly baked and customizable
        </p>
        {!cakes || cakes.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            No cakes available right now. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cakes.map((cake: Cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}