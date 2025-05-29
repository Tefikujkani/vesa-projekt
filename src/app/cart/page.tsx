'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { FaTrash, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
    toast.success('Item removed from cart')
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error during checkout')
      }

      // Redirect to payment page or show success message
      clearCart()
      toast.success('Order placed successfully!')
    } catch (error) {
      toast.error('Error during checkout. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-8">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="inline-flex items-center">
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-6 flex">
                  <div className="relative flex-shrink-0 w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <Link href={`/products/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="ml-4">${item.price}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="text-gray-500">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>

                      <div className="flex">
                        <Button
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-500"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Shipping</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="mt-6">
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
              isLoading={isCheckingOut}
            >
              Checkout
            </Button>
          </div>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
              or{' '}
              <Link
                href="/products"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Continue Shopping
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 