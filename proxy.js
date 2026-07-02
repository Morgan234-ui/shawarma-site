import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('admin_session');
  const validToken = process.env.ADMIN_SESSION_TOKEN;
  const isAuthenticated = sessionCookie && validToken && sessionCookie.value === validToken;

  // Protect /admin/orders and other dashboard routes
  if (pathname.startsWith('/admin/') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Protect admin API routes (except login)
  if (pathname.startsWith('/api/admin/') && pathname !== '/api/admin/login') {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path+', '/api/admin/:path*'],
};
