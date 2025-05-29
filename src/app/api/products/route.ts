import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/models/Product'

const ITEMS_PER_PAGE = 9

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

    await dbConnect()

    // Build the filter object
    const filter: any = {}
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ]
    }
    if (category) {
      filter.category = category
    }

    // Get total count for pagination
    const totalItems = await Product.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

    // Fetch products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(ITEMS_PER_PAGE)

    // Get categories with counts
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { name: 1 },
      },
    ])

    return NextResponse.json({
      products,
      categories,
      currentPage: page,
      totalPages,
      totalItems,
    })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await dbConnect()

    const product = await Product.create(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { message: 'Error creating product' },
      { status: 500 }
    )
  }
} 