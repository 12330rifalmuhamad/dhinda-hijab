import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { voucherId } = await request.json();

        // Start transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get Voucher & Lock it (simplification: prisma doesn't lock row easily, but we check stock)
            const voucher = await tx.voucher.findUnique({
                where: { id: voucherId }
            });

            if (!voucher) throw new Error("Voucher not found");
            if (!voucher.isActive) throw new Error("Voucher is inactive");
            if (new Date() > voucher.endDate) throw new Error("Voucher expired");
            if (voucher.stock <= 0) throw new Error("Out of stock");

            // 2. Check if already claimed
            const existingClaim = await tx.userVoucher.findUnique({
                where: {
                    userId_voucherId: {
                        userId: session.user.id,
                        voucherId: voucherId
                    }
                }
            });

            if (existingClaim) throw new Error("Already claimed");

            // 3. Create UserVoucher
            const userVoucher = await tx.userVoucher.create({
                data: {
                    userId: session.user.id,
                    voucherId: voucherId,
                }
            });

            // 4. Decrement Stock
            await tx.voucher.update({
                where: { id: voucherId },
                data: { stock: { decrement: 1 } }
            });

            return userVoucher;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error claiming voucher:', error);
        return NextResponse.json({ error: error.message || 'Failed to claim' }, { status: 400 });
    }
}
