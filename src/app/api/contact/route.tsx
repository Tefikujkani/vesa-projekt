import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Contact from '@/models/Contact'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    await dbConnect()

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    })

    // Here you could also send an email notification
    // using a service like SendGrid or Nodemailer

    return NextResponse.json(
      { message: 'Contact form submitted successfully', contact },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in contact form submission:', error)
    return NextResponse.json(
      { message: 'Error submitting contact form' },
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