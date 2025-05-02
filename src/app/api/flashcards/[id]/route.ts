import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { known } = await request.json();

    // Verify the user owns this flashcard
    const flashcard = await prisma.flashcard.findUnique({
      where: { id: params.id },
      include: {
        flashcardSet: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }

    if (flashcard.flashcardSet.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: params.id },
      data: {
        known,
        lastReviewed: new Date(),
      },
    });

    return NextResponse.json(updatedFlashcard);
  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    );
  }
} 