import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: true // Optional: if we want to show item count
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
