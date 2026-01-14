import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const myVouchers = await prisma.userVoucher.findMany({
            where: { userId: session.user.id },
            include: {
                voucher: true
            },
            orderBy: { claimedAt: 'desc' }
        });

        return NextResponse.json(myVouchers);
    } catch (error) {
        console.error('Error fetching my vouchers:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
