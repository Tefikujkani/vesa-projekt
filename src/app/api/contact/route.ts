import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await dbConnect()

    const contact = await Contact.create(body)
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('Error creating contact:', error)
    return NextResponse.json(
      { message: 'Error creating contact' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    const contacts = await Contact.find({}).sort({ createdAt: -1 })
    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { message: 'Error fetching contacts' },
      { status: 500 }
    )
  }
} 