export { default } from "next-auth/middleware"
 
export const config = {  matcher: [
  '/onboarding/:path*',
  '/dashboard/:path*',
  '/contractor/:path*',
  '/employee/:path*',
  '/history/:path*',
  '/onboarding/:path*',
  '/admin/:path*',
  '/settings/:path*',
  // '/api/:path*',
],}


 