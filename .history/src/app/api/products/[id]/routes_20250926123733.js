import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const productId = params.id;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true,
        images: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." }, 
        { status: 404 }
      );
    }

    // Transform product to include sales count
    const transformedProduct = {
      ...product,
      salesCount: product._count.orderItems
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const productId = params.id;
    const { name, description, price, stock, categoryId, images } = await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { message: "Nama, harga, dan kategori produk diperlukan." },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name.trim(),
        description: description?.trim(),
        price: parseInt(price),
        stock: parseInt(stock) || 0,
        categoryId,
      },
      include: {
        category: true,
        images: true
      }
    });

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: {
          productId: productId
        }
      });

      // Create new images
      await prisma.productImage.createMany({
        data: images.map(imageUrl => ({
          url: imageUrl,
          productId: productId
        }))
      });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Error: Gagal memperbarui produk." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const productId = params.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan." },
        { status: 404 }
      );
    }

    // Delete product (images will be deleted automatically due to cascade)
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(
      { message: "Produk berhasil dihapus." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Error: Gagal menghapus produk." },
      { status: 500 }
    );
  }
}