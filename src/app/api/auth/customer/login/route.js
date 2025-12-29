import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret-key-change-me');

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password diperlukan' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'CUSTOMER') {
       // Could be generic error, but check role to prevent admin login here if desired, 
       // though typically it's fine if admins log in as customers too.
       // However, strictly adhering to 'CUSTOMER' role separation for this endpoint:
       if (user && user.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Akun ini bukan akun customer' }, { status: 403 });
       }
       return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

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
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
