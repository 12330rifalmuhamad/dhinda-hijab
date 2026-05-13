import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT update an address
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    const data = await request.json();
    const { recipientName, phone, fullAddress, province, city, district, postalCode, isDefault } = data;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        recipientName,
        phone,
        fullAddress,
        province,
        city,
        district,
        postalCode,
        isDefault
      }
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// DELETE an address
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const address = await prisma.address.findUnique({
      where: { id }
    });

    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Address not found or unauthorized' }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id }
    });

    // If we deleted the default address, make another one default if it exists
    if (address.isDefault) {
      const remainingAddress = await prisma.address.findFirst({
        where: { userId: user.id }
      });
      if (remainingAddress) {
        await prisma.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
