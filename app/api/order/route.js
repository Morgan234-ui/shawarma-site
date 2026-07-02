import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import {
  sendEmail,
  buildOrderConfirmationEmail,
  buildNewOrderAdminEmail,
} from '@/lib/email';

const BUSINESS_EMAIL = process.env.SMTP_FROM || 'edachemorgan10@gmail.com';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, food, location, instructions } = body;

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !food || !location?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      food,
      location: location.trim(),
      instructions: instructions?.trim() || '',
    });

    const orderId = order._id.toString().slice(-6).toUpperCase();

    setImmediate(async () => {
      try {
        await sendEmail({
          to: BUSINESS_EMAIL,
          subject: `New Order from ${name} — ${food}`,
          html: buildNewOrderAdminEmail({ name, phone, email, food, location, instructions, orderId }),
        });
      } catch (err) {
        console.error('Admin notification email failed:', err.message);
      }

      try {
        await sendEmail({
          to: email,
          subject: `Order Confirmed — ${BUSINESS_EMAIL.split('@')[0].replace(/[^a-zA-Z]/g, ' ')} has your order!`,
          html: buildOrderConfirmationEmail({ name, food, location, phone, instructions, orderId }),
        });
      } catch (err) {
        console.error('Customer confirmation email failed:', err.message);
      }
    });

    return NextResponse.json({
      success: true,
      message: `Thank you, ${name}! Your order has been received. Check your email for confirmation.`,
    });
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return phone.replace(/\D/g, '').length >= 10;
}
