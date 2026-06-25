'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Cake } from '@/types'

export default function CakeCard({ cake }: { cake: Cake }) {
  return (
    <Link href={`/product/${cake.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-pink-50 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
        <div className="relative h-52 w-full bg-pink-50">
          {cake.image_url ? (
            <Image
              src={cake.image_url}
              alt={cake.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-5xl">
              🎂
            </div>
          )}
        </div>
        <div className="p-4">
          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
            {cake.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 mt-2">
            {cake.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {cake.description}
          </p>
          <p className="text-xl font-bold text-pink-600 mt-3">
            ₹{cake.price}
          </p>
        </div>
      </div>
    </Link>
  )
}