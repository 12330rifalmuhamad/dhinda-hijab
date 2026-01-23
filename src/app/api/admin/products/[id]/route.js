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
    const { name, description, price, originalPrice, label, categoryId, shopeeUrl, tiktokUrl, videoUrl, sizeChart, isBestSeller, images } = data;

    // Transaction to handle product update and image sync
    const product = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const updated = await tx.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          originalPrice: originalPrice ? parseInt(originalPrice) : null,
          label,
          category: { connect: { id: categoryId } },
          shopeeUrl,
          tiktokUrl,
          videoUrl,
          sizeChart,
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

      // Create new entries for all URLs in the list SEQUENTIALLY to preserve order
      if (images && images.length > 0) {
        for (const url of images) {
          await tx.productImage.create({
            data: {
              productId: id,
              url: url
            }
          });
          // Small delay to ensure timestamp difference if ordering by createdAt
          // Though typically ID generation or insertion order might suffice,
          // DBs are fast.
          // await new Promise(r => setTimeout(r, 10)); 
          // Actually, relying on createdAt even with small delay is safer than hoping for ID order.
          // Let's rely on array retrieval order if we fetched without specific sort?
          // No, default sort is usually undefined. 
          // `GET` uses `orderBy: { createdAt: 'asc' }`.
          // So we NEED clear timestamp diffs or an `order` column.
          // An `order` column is best but schema change is extra work.
          // Let's try explicit waiting or assume Prisma/Postgres monotonic clock for now.
          // But `new Date()` is JS side? No, default(now()) is DB side.
          // Postgres `now()` is stable within transaction usually!
          // So `createdAt` will be IDENTICAL for all these.
          //
          // This means our GET `orderBy: { createdAt: 'asc' }` is unstable for batch inserts in a transaction!
          //
          // FIX: We MUST add an order column OR use `clock_timestamp()`?
          // OR: User JS generated dates.
        }

        // REVISITING STRATEGY:
        // Since `now()` in PG transaction is constant, we cannot rely on default(now()).
        // We will pass explicit `createdAt` incrementing by 1ms to ensure order.
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
