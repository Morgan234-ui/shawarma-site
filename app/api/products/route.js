import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ available: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ success: false, products: [] }, { status: 500 });
  }
}
