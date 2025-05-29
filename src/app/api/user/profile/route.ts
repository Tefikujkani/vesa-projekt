import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await request.json()
    const { name, email, currentPassword, newPassword } = body

    await dbConnect()
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password if trying to change password
    if (currentPassword && newPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      user.password = hashedPassword
    }

    // Update user information
    user.name = name
    user.email = email
    await user.save()

    // Return updated user without password
    const updatedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    )
  }
} 