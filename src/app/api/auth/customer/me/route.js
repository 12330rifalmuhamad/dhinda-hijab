import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

export async function GET(request) {
  const token = request.cookies.get('customer_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });

  } catch (error) {
    // Token validasi gagal or expired
    return NextResponse.json({ user: null });
  }
}
