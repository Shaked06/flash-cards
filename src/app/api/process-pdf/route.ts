import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;
    const title = formData.get('title') as string;

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'No title provided' }, { status: 400 });
    }

    // Convert the file to ArrayBuffer and then to Buffer
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract text from PDF
    const data = await pdfParse(buffer);
    const text = data.text;

    // Process with Llama
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `You are a helpful assistant that creates flashcards from study materials. Extract key terms, definitions, concepts, and important facts. Format your response as a JSON array of objects with 'term' and 'explanation' properties. Here is the content: ${text}`,
        stream: false,
      }),
    });

    const data2 = await response.json();
    let cards: Array<{ term: string; explanation: string }> = [];

    try {
      const parsed = JSON.parse(data2.response || '{}');
      cards = parsed.flashcards || [];
    } catch (e) {
      console.error('Failed to parse Llama response:', e);
    }

    // Store PDF file
    const pdfUrl = `/uploads/${Date.now()}-${pdfFile.name}`;
    // TODO: Implement actual file storage (e.g., AWS S3, local storage)

    // Create flashcard set and cards in database
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        title,
        pdfUrl,
        userId: session.user?.email || '',
        flashcards: {
          create: cards.map((card) => ({
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
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
} 