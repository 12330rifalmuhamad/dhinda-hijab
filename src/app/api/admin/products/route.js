import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { name: { contains: search, mode: 'insensitive' } } }
        ]
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: sort === 'category'
        ? { category: { name: order } }
        : { [sort]: order },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, description, price, originalPrice, label, categoryId, shopeeUrl, tiktokUrl, videoUrl, isBestSeller, images } = data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        label,
        categoryId,
        shopeeUrl,
        tiktokUrl,
        videoUrl,
        isBestSeller,
        images: {
          create: images.map(url => ({ url })),
        },
      },
      include: {
        images: true,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
