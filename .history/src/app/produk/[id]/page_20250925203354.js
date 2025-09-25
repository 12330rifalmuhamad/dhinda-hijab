// src/app/api/products/[id]/route.js

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const productId = params.id; // Mengambil ID dari URL, misal: 'clxjwt1230000...'

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true, // Sertakan juga data kategorinya
      },
    });

    // Jika produk tidak ditemukan, kirim respons 404
    if (!product) {
      return NextResponse.json({ message: "Produk tidak ditemukan." }, { status: 404 });
    }

    // Jika produk ditemukan, kirim datanya
    return NextResponse.json(product);

  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}