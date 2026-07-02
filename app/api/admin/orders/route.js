import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { sendEmail, buildStatusUpdateEmail } from '@/lib/email';

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, status } = await request.json();

    const validStatuses = ['pending', 'preparing', 'completed', 'cancelled'];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    }

    await connectDB();
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });
    }

    const emailStatuses = ['preparing', 'completed', 'cancelled'];
    if (emailStatuses.includes(status)) {
      const orderId = updated._id.toString().slice(-6).toUpperCase();
      const html = buildStatusUpdateEmail({
        name: updated.name,
        food: updated.food,
        location: updated.location,
        status,
        orderId,
      });

      const subjectMap = {
        preparing: `We're preparing your order — ${updated.food}`,
        completed: `Your order is on its way!`,
        cancelled: `Update on your order from MimiRichies Bite`,
      };

      setImmediate(async () => {
        try {
          await sendEmail({ to: updated.email, subject: subjectMap[status], html });
        } catch (err) {
          console.error('Status update email failed:', err.message);
        }
      });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update order.' }, { status: 500 });
  }
}
