import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

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
    const sections = await prisma.homeSection.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function POST(request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const count = await prisma.homeSection.count();

    // Default config based on type
    let defaultContent = {};
    if (data.type === 'HERO') defaultContent = { description: 'Hero Section managed separately' };
    if (data.type === 'PRODUCT_SLIDER') defaultContent = { title: 'New Collection', limit: 10 };
    if (data.type === 'CATEGORY_GRID') defaultContent = { title: 'Shop by Category' };

    const section = await prisma.homeSection.create({
      data: {
        type: data.type,
        title: data.title || '',
        subtitle: data.subtitle || '',
        order: count,
        content: data.content || defaultContent,
        backgroundColor: data.backgroundColor,
        gradientStart: data.gradientStart,
        gradientEnd: data.gradientEnd,
        backgroundImage: data.backgroundImage,
      },
    });
    return NextResponse.json(section);
  } catch (error) {
    console.error("Create section error:", error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

export async function PUT(request) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sections } = await request.json(); // Expect array of { id, order }

    // Transaction for bulk update not strictly necessary if small list, 
    // but Promise.all is good.
    await Promise.all(
      sections.map(section =>
        prisma.homeSection.update({
          where: { id: section.id },
          data: { order: section.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder error:", error);
    return NextResponse.json({ error: 'Failed to reorder sections' }, { status: 500 });
  }
}
