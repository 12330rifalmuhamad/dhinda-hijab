import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Ensure you have authOptions exported or use your custom session logic

// GET all addresses for the logged-in user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: {
        user: { email: session.user.email }
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// POST a new address
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.json();
    const { recipientName, phone, fullAddress, province, city, district, postalCode, isDefault } = data;

    // If this is set to default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    // Check if this is the first address, if so make it default
    const count = await prisma.address.count({ where: { userId: user.id } });
    const finalIsDefault = count === 0 ? true : (isDefault || false);

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        recipientName,
        phone,
        fullAddress,
        province,
        city,
        district,
        postalCode,
        isDefault: finalIsDefault
      }
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
}
