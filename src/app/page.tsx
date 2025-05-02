'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { PDFUpload } from '@/components/upload/PDFUpload';
import { FlashCardSet } from '@/components/flashcard/FlashCardSet';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const [currentSet, setCurrentSet] = useState<{
    id: string;
    cards: Array<{ id: string; term: string; explanation: string; known: boolean }>;
  } | null>(null);

  const handleUploadComplete = async (cards: Array<{ term: string; explanation: string }>) => {
    // Create a new flashcard set
    try {
      const response = await fetch('/api/flashcard-sets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Flashcard Set',
          cards,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create flashcard set');
      }

      const newSet = await response.json();
      setCurrentSet(newSet);
    } catch (error) {
      console.error('Error creating flashcard set:', error);
    }
  };

  const handleCardUpdate = async (cardId: string, known: boolean) => {
    if (!currentSet) return;

    try {
      await fetch(`/api/flashcards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ known }),
      });

      setCurrentSet(prev => {
        if (!prev) return null;
        return {
          ...prev,
          cards: prev.cards.map(card =>
            card.id === cardId ? { ...card, known } : card
          ),
        };
      });
    } catch (error) {
      console.error('Error updating flashcard:', error);
    }
  };

  const handleSetComplete = async (stats: { known: number; unknown: number }) => {
    // Handle set completion (e.g., show stats, offer to review unknown cards)
    console.log('Set completed with stats:', stats);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to Flash Cards
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
          Create intelligent flashcards from your study materials and learn more efficiently.
        </p>
        <Link
          href="/auth/signin"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
        >
          Sign In to Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Flash Cards</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{session.user?.email}</span>
            <Link
              href="/api/auth/signout"
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentSet ? (
          <FlashCardSet
            cards={currentSet.cards}
            onUpdateCard={handleCardUpdate}
            onFinish={handleSetComplete}
          />
        ) : (
          <PDFUpload onUploadComplete={handleUploadComplete} />
        )}
      </main>
    </div>
  );
}
