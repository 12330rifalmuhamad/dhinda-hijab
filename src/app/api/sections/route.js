import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sections = await prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}
