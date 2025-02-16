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

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url));
    }

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
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
          return true;  
        }
        return !!token;  
      },
    },
    pages: {
      signIn: '/signin', 
    },
  }
);

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    '/((?!signin|signup|auth|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};