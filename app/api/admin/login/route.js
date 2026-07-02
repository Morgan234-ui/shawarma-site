import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Admin not configured. Set ADMIN_SESSION_TOKEN in .env.local' },
        { status: 500 }
      );
    }

    // Check DB password first, fall back to env
    let adminPassword = process.env.ADMIN_PASSWORD;
    try {
      await connectDB();
      const settings = await Settings.findOne().lean();
      if (settings?.adminPassword) adminPassword = settings.adminPassword;
    } catch {
      // DB unavailable — fall through to env password
    }

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin password not configured.' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, message: 'Incorrect password.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
