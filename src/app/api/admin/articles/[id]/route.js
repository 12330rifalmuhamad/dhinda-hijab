import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const { title, excerpt, content, imageUrl } = data;

     // Simple slug generator (update slug if title changes)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        imageUrl,
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Update Article Error:", error);
     if (error.code === 'P2002') {
        return NextResponse.json({ error: 'An article with this title already exists.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.article.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Article deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
