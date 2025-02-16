import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/signin", "/signup", "/auth"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Allow access to public paths
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Redirect unauthorized users to /signin
    if (!token) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Add user info to headers for API requests
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", token.id as string);
    requestHeaders.set("x-username", token.username as string);
    if (token.role) {
      requestHeaders.set("x-user-role", token.role as string);
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
          return true; // Allow public pages
        }
        return !!token; // Require authentication for other routes
      },
    },
    pages: {
      signIn: "/signin", // Ensure unauthorized users are redirected here
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", // Protect dashboard
    "/admin/:path*", // Protect admin routes
    "/api/:path*", // Protect API routes
  ],
};
