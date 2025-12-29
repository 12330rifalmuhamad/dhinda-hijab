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

export async function PUT(request, { params }) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const section = await prisma.homeSection.update({
      where: { id },
      data,
    });
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const isAuth = await checkAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.homeSection.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
