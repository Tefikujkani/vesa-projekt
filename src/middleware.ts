import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const authPaths = ['/dashboard', '/profile', '/cart']

// Paths that require admin role
const adminPaths = ['/admin']

// Auth paths (login/register) that should redirect to dashboard if user is already authenticated
const guestPaths = ['/auth/login', '/auth/register']

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Check if the path requires authentication
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (!token) {
      const url = new URL('/auth/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Check if the path requires admin role
  if (adminPaths.some((path) => pathname.startsWith(path))) {
    if (!token || token.role !== 'admin') {
      return new NextResponse('Unauthorized', { status: 403 })
    }
  }

  // Redirect authenticated users away from auth pages
  if (guestPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 