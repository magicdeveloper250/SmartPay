import NextAuth from 'next-auth';
import { authOptions } from '@/utils/auth';
 
export default NextAuth(authOptions).auth;
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};