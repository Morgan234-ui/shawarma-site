import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { sendEmail } from '@/lib/email';

async function getSettings() {
  await connectDB();
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = await Settings.create({});
    settings = settings.toObject();
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await getSettings();
    const { adminPassword, ...safe } = settings;
    return NextResponse.json({ success: true, settings: safe, hasPassword: !!adminPassword });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to load settings.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    await connectDB();

    if (action === 'changePassword') {
      const { currentPassword, newPassword } = data;
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, message: 'New password must be at least 6 characters.' }, { status: 400 });
      }
      const settings = await Settings.findOne();
      const storedPass = settings?.adminPassword || process.env.ADMIN_PASSWORD;
      if (currentPassword !== storedPass) {
        return NextResponse.json({ success: false, message: 'Current password is incorrect.' }, { status: 401 });
      }
      await Settings.findOneAndUpdate({}, { adminPassword: newPassword }, { upsert: true, new: true });
      return NextResponse.json({ success: true, message: 'Password updated successfully.' });
    }

    if (action === 'testEmail') {
      const { email } = data;
      if (!email) return NextResponse.json({ success: false, message: 'Email address required.' }, { status: 400 });
      await sendEmail({
        to: email,
        subject: 'MimiRichies Bite — Email Test',
        html: `<div style="font-family:sans-serif;padding:2rem;max-width:480px;margin:auto">
          <h2 style="color:#f97316">Email Test Successful</h2>
          <p>Your email notifications are working correctly for MimiRichies Bite admin panel.</p>
          <p style="color:#64748b;font-size:.85rem">Sent at ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</p>
        </div>`,
      });
      return NextResponse.json({ success: true, message: `Test email sent to ${email}` });
    }

    const allowed = ['storeOpen', 'businessName', 'phone', 'whatsapp', 'address', 'notificationEmail'];
    const update = {};
    for (const key of allowed) {
      if (key in data) update[key] = data[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update.' }, { status: 400 });
    }

    const updated = await Settings.findOneAndUpdate({}, update, { upsert: true, new: true }).lean();
    const { adminPassword, ...safe } = updated;
    return NextResponse.json({ success: true, settings: safe });
  } catch (error) {
    console.error('Settings PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save settings.' }, { status: 500 });
  }
}
