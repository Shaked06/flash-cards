import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    // Convert the file to base64
    const buffer = await pdfFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Process the PDF with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates flashcards from PDF content. Extract key terms, definitions, concepts, and important facts. Format your response as a JSON array of objects with 'term' and 'explanation' properties.",
        },
        {
          role: "user",
          content: `Please analyze this PDF content and create flashcards: ${base64.substring(0, 4000)}`,
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    let cards: Array<{ term: string; explanation: string }> = [];

    try {
      const parsed = JSON.parse(content || '{}');
      cards = parsed.flashcards || [];
    } catch (e) {
      console.error('Failed to parse OpenAI response:', e);
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 }
    );
  }
} 