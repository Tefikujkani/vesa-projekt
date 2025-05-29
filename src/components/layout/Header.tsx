'use client';

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/hooks/useCart'
import { FaShoppingCart, FaUser } from 'react-icons/fa'

export function Header() {
  const { data: session } = useSession()
  const { items } = useCart()
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Vesa Projekt
        </Link>

        <div className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-800">
            Products
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-800">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800">
            Contact
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <FaShoppingCart className="text-gray-600 text-xl" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-2">
                <FaUser className="text-gray-600" />
                <span className="text-gray-600">{session.user?.name}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
} 