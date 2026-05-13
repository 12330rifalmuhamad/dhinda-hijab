import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all wishlist items for current user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: {
        user: { email: session.user.email }
      },
      include: {
        product: {
          include: {
            images: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

// POST toggle wishlist item
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
    const { productId } = data;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if it already exists
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    });

    if (existing) {
      // Remove it
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ message: 'Removed from wishlist', isWishlisted: false });
    } else {
      // Add it
      await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId
        }
      });
      return NextResponse.json({ message: 'Added to wishlist', isWishlisted: true });
    }

  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 });
  }
}
