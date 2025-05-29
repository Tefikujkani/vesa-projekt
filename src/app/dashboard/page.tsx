'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

type Order = {
  _id: string
  products: Array<{
    product: {
      name: string
      price: number
      image: string
    }
    quantity: number
  }>
  total: number
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || ''}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}!</h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Completed Orders</h3>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((order) => order.status === 'completed').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Pending Orders</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((order) => order.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link href="/orders">
              <Button variant="outline">View All Orders</Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">No orders found.</p>
              <Link href="/products" className="mt-4 inline-block">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <Card
                  key={order._id}
                  title={`Order #${order._id.slice(-6)}`}
                  description={`${order.products.length} items • ${new Date(
                    order.createdAt
                  ).toLocaleDateString()}`}
                  footer={
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${order.total}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 