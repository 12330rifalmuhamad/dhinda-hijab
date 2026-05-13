import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET reviews for a product
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST a new review
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await params;
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Optional: Check if user has actually bought the product
    // For now we assume they can review if logged in
    const data = await request.json();
    const { rating, comment } = data;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Valid rating is required (1-5)' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId,
        rating: Number(rating),
        comment
      },
      include: {
        user: { select: { name: true } }
      }
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
