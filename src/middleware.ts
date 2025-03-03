import { withAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { JWT } from 'next-auth/jwt';

// Define interface for the augmented request
interface NextAuthRequest extends NextRequest {
  nextauth?: {
    token?: JWT;
  };
}

const PUBLIC_PATHS = [
  '/',
  '/signin',
  '/signup',
  '/api/register',
];

export default withAuth({
  callbacks: {
    authorized: ({ token, req }: { token: JWT | null; req: NextRequest }) => {
      const { pathname } = req.nextUrl;
      
      // Allow access to public paths without requiring auth
      if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return true;
      }
      
      // Require authentication for all other routes
      return !!token;
    },
  },
  pages: {
    signIn: '/signin',
  },
});

// Separate middleware function for custom header logic
export function middleware(req: NextAuthRequest) {
  const token = req.nextauth?.token;
  
  // If no token but public path, just proceed
  if (!token && PUBLIC_PATHS.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // If has token, add custom headers
  if (token) {
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
  }
  
  // Default behavior for middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*',
    // Exclude public paths and static assets
    '/((?!signin|signup|auth|api/public|api/auth|_next/static|_next/image|public/images|images|favicon.ico).*)',
  ],
};