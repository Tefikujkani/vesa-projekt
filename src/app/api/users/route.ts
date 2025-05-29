import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    await dbConnect()
    const users = await User.find({}).select('-password').sort({ createdAt: -1 })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user || session.user.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const body = await request.json()
    const { id, role } = body

    await dbConnect()
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    )
  }
} 