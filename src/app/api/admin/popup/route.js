import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const popup = await prisma.popupBanner.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(popup || {});
    } catch (error) {
        console.error('Error fetching popup:', error);
        return NextResponse.json({ error: 'Failed to fetch popup' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { id, imageUrl, title, linkUrl, isActive } = body;

        let popup;

        if (id) {
            // Update existing
            popup = await prisma.popupBanner.update({
                where: { id },
                data: {
                    imageUrl,
                    title,
                    linkUrl,
                    isActive,
                },
            });
        } else {
            // Create new
            popup = await prisma.popupBanner.create({
                data: {
                    imageUrl,
                    title,
                    linkUrl,
                    isActive: isActive !== undefined ? isActive : true,
                },
            });
        }

        return NextResponse.json(popup);
    } catch (error) {
        console.error('Error saving popup:', error);
        return NextResponse.json({ error: 'Failed to save popup' }, { status: 500 });
    }
}
