// src/app/api/products/route.js

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  // Ambil URL search parameters dari request yang masuk
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');

  try {
    // Siapkan query dasar ke Prisma
    const queryOptions = {
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // Jika ada parameter 'category' di URL, tambahkan kondisi 'where' ke query
    if (categorySlug) {
      queryOptions.where = {
        category: {
          name: {
            equals: categorySlug,
            mode: 'insensitive', // Tidak peduli huruf besar/kecil (misal: Pashmina vs pashmina)
          },
        },
      };
    }

    // Jalankan query ke database dengan opsi yang sudah disiapkan
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