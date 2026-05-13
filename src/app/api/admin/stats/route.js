import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get Stats (Total Orders, Products, Customers)
    const [totalOrders, totalProducts, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } })
    ]);

    // 2. Get Revenue (Total amount of PAID, SHIPPED, DELIVERED orders)
    const ordersForRevenue = await prisma.order.findMany({
      where: {
        status: {
          in: ['PAID', 'SHIPPED', 'DELIVERED']
        }
      },
      select: {
        totalAmount: true
      }
    });
    const totalRevenue = ordersForRevenue.reduce((sum, order) => sum + order.totalAmount, 0);

    // 3. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // 4. Sales Trend (Last 7 Days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    const salesTrend = await Promise.all(last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dailyOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          },
          status: {
            in: ['PAID', 'SHIPPED', 'DELIVERED']
          }
        },
        select: {
          totalAmount: true
        }
      });

      const dailyRevenue = dailyOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      return {
        date: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        revenue: dailyRevenue
      };
    }));

    // 5. Low Stock Products (Threshold: <= 5)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 5 }
      },
      take: 5,
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        name: true,
        stock: true
      }
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      salesTrend,
      lowStockProducts
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
