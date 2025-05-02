import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, cards } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title,
        userId: user.id,
        flashcards: {
          create: cards.map((card: { term: string; explanation: string }) => ({
            term: card.term,
            explanation: card.explanation,
          })),
        },
      },
      include: {
        flashcards: true,
      },
    });

    return NextResponse.json(flashcardSet);
  } catch (error) {
    console.error('Error creating flashcard set:', error);
    return NextResponse.json(
      { error: 'Failed to create flashcard set' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const flashcardSets = await prisma.flashcardSet.findMany({
      where: {
        userId: user.id,
      },
      include: {
        flashcards: true,
      },
    });

    return NextResponse.json(flashcardSets);
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard sets' },
      { status: 500 }
    );
  }
} 