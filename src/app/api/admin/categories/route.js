import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, imageUrl } = data;

    const category = await prisma.category.create({
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
