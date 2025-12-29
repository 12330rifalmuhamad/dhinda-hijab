import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, description, price, stock, categoryId, shopeeUrl, tiktokUrl, material, images } = data;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        shopeeUrl,
        tiktokUrl,
        material,
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
