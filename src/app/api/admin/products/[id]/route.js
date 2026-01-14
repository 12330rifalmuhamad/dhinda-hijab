import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { createdAt: 'asc' }
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const { name, description, price, categoryId, shopeeUrl, tiktokUrl, videoUrl, isBestSeller, images } = data;

    // Transaction to handle product update and image sync
    const product = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const updated = await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          categoryId,
          shopeeUrl,
          tiktokUrl,
          videoUrl,
          isBestSeller,
        }
      });

      // 2. Handle Images
      // Strategy: Delete all existing and recreate (simplest for order/sync) 
      // OR smart diff. For simplicity and maintaining order if passed in order:
      // However, `images` coming in might be a mix of new URLs and keeping existing.
      // If the UI sends the full list of desired URLs, we can:
      // Delete all images for this product
      await tx.productImage.deleteMany({ where: { productId: id } });

      // Create new entries for all URLs in the list
      if (images && images.length > 0) {
        await tx.productImage.createMany({
          data: images.map(url => ({
            productId: id,
            url: url
          }))
        });
      }

      return updated;
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
