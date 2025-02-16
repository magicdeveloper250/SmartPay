// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/signin',
  '/signup',
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

    // Add user info to headers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', token.id as string);
    requestHeaders.set('x-username', token.username as string);
    if (token.role) {
      requestHeaders.set('x-user-role', token.role as string);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      // Ensure the authorized callback allows access to public paths
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
          return true; // Allow access to public paths
        }
        return !!token; // Require authentication for other paths
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    // Exclude public paths from the matcher
    '/((?!signin|signup|auth|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};