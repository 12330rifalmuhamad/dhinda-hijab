import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform data to include product count
    const categoriesWithCount = categories.map(category => ({
      id: category.id,
      name: category.name,
      productCount: category._count.products,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data kategori." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: "Nama kategori diperlukan." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim()
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "Kategori dengan nama ini sudah ada." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Error: Gagal membuat kategori." },
      { status: 500 }
    );
  }
}
