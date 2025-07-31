import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  const url = req.nextUrl;
  const isDashboard = url.pathname.startsWith('/dashboard');
  const isAdmin = url.pathname.startsWith('/admin');

  if (!token && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (isAdmin) {
    try {
        // console.log("middleware->isAdmin")
      const user = await verifyToken(token);
      // console.log('Decoded user:', user);

      if (user.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};