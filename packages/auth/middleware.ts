export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
      '/dashboard/:path*',
      '/settings/:path*',
      '/profile/:path*',
      '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
  };