import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { code, discount, type, minPurchase, maxDiscount, stock, startDate, endDate, isActive } = body;

        const voucher = await prisma.voucher.update({
            where: { id },
            data: {
                code,
                discount: Number(discount),
                type,
                minPurchase: Number(minPurchase || 0),
                maxDiscount: maxDiscount ? Number(maxDiscount) : null,
                stock: Number(stock || 0),
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive
            }
        });

        return NextResponse.json(voucher);
    } catch (error) {
        console.error("Error updating voucher:", error);
        return NextResponse.json({ error: "Failed to update voucher" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = params;
        await prisma.voucher.delete({
            where: { id }
        });
        return NextResponse.json({ message: "Voucher deleted" });
    } catch (error) {
        console.error("Error deleting voucher:", error);
        return NextResponse.json({ error: "Failed to delete voucher" }, { status: 500 });
    }
}
