// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/api/auth'
]

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Allow access to public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Optional: Add role-based access control
    // Example: Only allow admin users to access /admin routes
    if (pathname.startsWith('/admin') && token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Add user info to headers if needed
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', token.id as string)
    requestHeaders.set('x-user-role', token.role as string)

    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    })
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

// Configure which paths should be protected
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    
    // Exclude public paths
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
}