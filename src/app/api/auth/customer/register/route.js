import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

export async function POST(request) {
  try {
    const { email, password, name, phone, gender, birthDate } = await request.json();

    if (!email || !password || !name || !phone) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const birthDateObj = birthDate ? new Date(birthDate) : null;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        gender,
        birthDate: birthDateObj,
        role: 'CUSTOMER',
      },
    });

    // Auto login after register
    const token = await new SignJWT({ userId: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ 
        success: true, 
        user: { id: user.id, name: user.name, email: user.email } 
    });
    
    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Gagal mendaftar' }, { status: 500 });
  }
}
