import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 10;

  try {
    const skip = (page - 1) * limit;

    const queryOptions = {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
    };

    // Build where clause
    const whereClause = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (status) {
      whereClause.status = status.toUpperCase();
    }

    if (Object.keys(whereClause).length > 0) {
      queryOptions.where = whereClause;
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany(queryOptions),
      prisma.order.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, items, shippingAddress, totalAmount } = await request.json();

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "Data pesanan tidak lengkap." },
        { status: 400 }
      );
    }

    // Validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { message: "Data item tidak valid." },
          { status: 400 }
        );
      }
    }

    // Check product availability
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      }
    });

    // Validate stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { message: `Produk ${item.productId} tidak ditemukan.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Stok ${product.name} tidak mencukupi.` },
          { status: 400 }
        );
      }
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: parseInt(totalAmount),
        shippingAddress: shippingAddress || null,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              }
            }
          }
        }
      }
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Error: Gagal membuat pesanan." },
      { status: 500 }
    );
  }
}
