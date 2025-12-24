import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const orderId = params.id;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
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
                  orderBy: {
                    createdAt: 'asc'
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Error: Gagal mengambil data pesanan." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const orderId = params.id;
    const { status, shippingAddress } = await request.json();

    if (!status) {
      return NextResponse.json(
        { message: "Status pesanan diperlukan." },
        { status: 400 }
      );
    }

    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return NextResponse.json(
        { message: "Status pesanan tidak valid." },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status.toUpperCase(),
        ...(shippingAddress && { shippingAddress })
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { message: "Error: Gagal memperbarui pesanan." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const orderId = params.id;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    // Only allow deletion of pending orders
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { message: "Hanya pesanan dengan status PENDING yang dapat dihapus." },
        { status: 400 }
      );
    }

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: {
          id: item.productId
        },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });
    }

    // Delete order (items will be deleted automatically due to cascade)
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return NextResponse.json(
      { message: "Pesanan berhasil dihapus." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { message: "Error: Gagal menghapus pesanan." },
      { status: 500 }
    );
  }
}
