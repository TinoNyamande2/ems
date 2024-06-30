import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow requests if the following is true:
  // 1. It's a request for next-auth session & provider fetching
  // 2. It's a public route like login, signup, etc.
  if (
    pathname.includes('/api/auth') ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/register' ||
    pathname === '/forgot-password'
  ) {
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to login if no token and requesting a protected route
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  // Block specific routes for non-admin users
  const isAdminRoute = [
    /^\/leave-applications\/[^\/]+\/approve$/,
    /^\/leave-applications\/[^\/]+\/approve\/[^\/]+$/,
    /^\/leave-applications\/[^\/]+\/reports$/,
    /^\/performance-tracker\/[^\/]+\/overview\/$/,
    /^\/performance-tracker\/[^\/]+\/overview\/summary\/project\/[^\/]+$/,
    /^\/performance-tracker\/[^\/]+\/overview\/summary\/user\/[^\/]+$/,
    /^\/performance-tracker\/[^\/]+\/overview\/summary\/projecttags\/[^\/]+$/
  ].some((regex) => regex.test(pathname));

  if (token.role !== 'admin' && isAdminRoute) {
    // Redirect to unauthorized page if user is not an admin and trying to access a protected dynamic route
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|favicon.ico).*)'],
};
