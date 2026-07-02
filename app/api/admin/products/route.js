import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image, imagePublicId, badge, available, sortOrder } = body;

    if (!name?.trim() || !description?.trim() || price == null) {
      return NextResponse.json({ success: false, message: 'Name, description, and price are required.' }, { status: 400 });
    }

    await connectDB();
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category?.trim() || 'Main',
      image: image || '',
      imagePublicId: imagePublicId || '',
      badge: badge?.trim() || '',
      available: available !== false,
      sortOrder: sortOrder || 0,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create product.' }, { status: 500 });
  }
}
