// src/app/api/products/route.js

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');

  try {
    const queryOptions = {
      include: {
        category: true,
        images: { 
          take: 1, 
          orderBy: {
            createdAt: 'asc' 
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    if (categorySlug) {
      queryOptions.where = {
        category: {
          name: {
            equals: categorySlug,
            mode: 'insensitive',
          },
        },
      };
    }

    const products = await prisma.product.findMany(queryOptions);

    return NextResponse.json(products);
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}