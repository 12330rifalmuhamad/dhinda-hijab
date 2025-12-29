import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, excerpt, content, imageUrl } = data;

    // Simple slug generator
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Create Article Error:", error);
    // Handle unique slug error
    if (error.code === 'P2002') {
        return NextResponse.json({ error: 'An article with this title already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
