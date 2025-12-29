import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

// Helper to check auth
async function checkAuth(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'ADMIN';
  } catch {
    return false;
  }
}

export async function GET(request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const count = await prisma.heroSlide.count();
    
    const slide = await prisma.heroSlide.create({
      data: {
        ...data,
        order: count, // Append to end
      },
    });
    return NextResponse.json(slide);
  } catch (error) {
    console.error("Create slide error:", error);
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}
