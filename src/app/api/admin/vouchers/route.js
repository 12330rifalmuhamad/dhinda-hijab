import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const vouchers = await prisma.voucher.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(vouchers);
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { code, discount, type, minPurchase, maxDiscount, stock, startDate, endDate, isActive } = body;

        // Simple validation
        if (!code || !discount || !type || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const voucher = await prisma.voucher.create({
            data: {
                code,
                discount: Number(discount),
                type,
                minPurchase: Number(minPurchase || 0),
                maxDiscount: maxDiscount ? Number(maxDiscount) : null,
                stock: Number(stock || 0),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive: isActive === undefined ? true : isActive
            }
        });

        return NextResponse.json(voucher);
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Voucher code already exists" }, { status: 400 });
        }
        console.error("Error creating voucher:", error);
        return NextResponse.json({ error: "Failed to create voucher" }, { status: 500 });
    }
}
