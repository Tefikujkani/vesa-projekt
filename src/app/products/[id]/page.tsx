'use client'

import { useState } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  })

  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    throw new Error('Failed to fetch product')
  }

  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const product = await getProduct(params.id)

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-4xl font-bold text-blue-600">${product.price}</p>
          
          <div className="border-t border-b py-4">
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            <span className="inline-block bg-gray-100 px-3 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>

              <p className="text-sm text-gray-500">
                {product.stock} items in stock
              </p>
            </div>
          ) : (
            <Button disabled className="w-full" size="lg">
              Out of Stock
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 