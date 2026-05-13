import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";


export async function GET(request, { params }) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: {
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ message: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Kita hanya mengizinkan update status dan trackingNumber
    const { status, trackingNumber } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Terjadi kesalahan saat memperbarui pesanan" }, { status: 500 });
  }
}
