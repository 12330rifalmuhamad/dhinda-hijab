import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const { name, imageUrl } = data;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        imageUrl,
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update Category Error:", error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    // Check for foreign key constraint errors (e.g. category has products)
    if (error.code === 'P2003') { 
        return NextResponse.json({ error: 'Cannot delete category that has products.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
