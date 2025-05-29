'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { FaSearch, FaFilter } from 'react-icons/fa'

type Product = {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

type Category = {
  name: string
  count: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { addItem } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')

    setSearchQuery(query)
    setSelectedCategory(category)
    setCurrentPage(page)

    fetchProducts(query, category, page)
  }, [searchParams])

  const fetchProducts = async (query: string, category: string, page: number) => {
    try {
      const params = new URLSearchParams({
        ...(query && { q: query }),
        ...(category && { category }),
        page: page.toString(),
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()

      setProducts(data.products)
      setCategories(data.categories)
      setTotalPages(data.totalPages)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams({ q: searchQuery, page: '1' })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateSearchParams({ category, page: '1' })
  }

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() })
  }

  const updateSearchParams = (params: Record<string, string>) => {
    const current = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })
    router.push(`/products?${current.toString()}`)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FaFilter className="mr-2" /> Categories
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`block w-full text-left px-4 py-2 rounded ${
                  selectedCategory === ''
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`block w-full text-left px-4 py-2 rounded ${
                    selectedCategory === category.name
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {/* Products grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product._id}
                  title={product.name}
                  description={product.description}
                  image={product.image}
                  link={`/products/${product._id}`}
                  footer={
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${product.price}</span>
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  }
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 