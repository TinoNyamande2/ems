// middlewares/authMiddleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // List of public routes
  const publicRoutes = ['/login', '/register', '/signup', '/forgot-password'];

  // Check if the current path is in the list of public routes
  const isPublicRoute = publicRoutes.includes(pathname);

  // Extract cookies from the NextRequest object
  const cookie = req.headers.get('cookie');

  // Use getToken to get the session
  const session = await getToken({ req: { headers: { cookie: cookie || '' } } as any });

  if (!session && !isPublicRoute) {
    const url = req.nextUrl.clone();
    url.pathname = '/login'; // Redirect to login page if not authenticated
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // Proceed to the requested page if authenticated or public route
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
