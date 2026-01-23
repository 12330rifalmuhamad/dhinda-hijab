import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 1000;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  try {
    const skip = (page - 1) * limit;

    const queryOptions = {
      include: {
        category: true,
        images: {
          take: 1,
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
      orderBy: sortBy === 'category'
        ? { category: { name: sortOrder } }
        : { [sortBy]: sortOrder },
      skip,
      take: limit,
    };

    // Build where clause
    const whereClause = {};

    if (categorySlug) {
      whereClause.category = {
        name: {
          equals: categorySlug,
          mode: 'insensitive',
        },
      };
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseInt(minPrice);
      if (maxPrice) whereClause.price.lte = parseInt(maxPrice);
    }

    if (Object.keys(whereClause).length > 0) {
      queryOptions.where = whereClause;
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany(queryOptions),
      prisma.product.count({ where: whereClause })
    ]);

    // Transform products to include sales count
    const transformedProducts = products.map(product => ({
      ...product,
      salesCount: product._count.orderItems
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data produk." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { name, description, price, stock, categoryId, images } = await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { message: "Nama, harga, dan kategori produk diperlukan." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        price: parseInt(price),
        stock: parseInt(stock) || 0,
        categoryId,
        images: {
          create: images?.map(imageUrl => ({
            url: imageUrl
          })) || []
        }
      },
      include: {
        category: true,
        images: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error: Gagal membuat produk." },
      { status: 500 }
    );
  }
}