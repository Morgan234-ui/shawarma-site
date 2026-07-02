import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectDB();
    const updated = await Product.findByIdAndUpdate(id, body, { new: true }).lean();

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product.' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();
    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product.' }, { status: 500 });
  }
}
