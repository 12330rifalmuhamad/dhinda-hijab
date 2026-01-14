import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        // Get all active vouchers
        const activeVouchers = await prisma.voucher.findMany({
            where: {
                isActive: true,
                endDate: { gte: new Date() },
                stock: { gt: 0 }
            },
            orderBy: { createdAt: 'desc' }
        });

        let claimedVoucherIds = [];
        if (session?.user?.id) {
            // Get IDs of vouchers already claimed by this user
            const claimed = await prisma.userVoucher.findMany({
                where: { userId: session.user.id },
                select: { voucherId: true }
            });
            claimedVoucherIds = claimed.map(cv => cv.voucherId);
        }

        // Sort vouchers: Unclaimed first, then by date
        // Or just filter out claimed depending on requirement.
        // Let's return ALL, but mark them as `isClaimed` so UI can show "Claimed" button.
        const vouchersWithStatus = activeVouchers.map(v => ({
            ...v,
            isClaimed: claimedVoucherIds.includes(v.id)
        }));

        return NextResponse.json(vouchersWithStatus);
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
    }
}
