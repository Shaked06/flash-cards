'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PDFUpload } from '@/components/upload/PDFUpload';
import FlashCardSet from '@/components/flashcard/FlashCardSet';

interface FlashcardSet {
  id: string;
  title: string;
  description: string | null;
  pdfUrl: string;
  flashcards: Array<{
    id: string;
    term: string;
    explanation: string;
  }>;
}

const features = [
  {
    title: 'AI-Powered Learning',
    description: 'Our advanced AI technology automatically generates smart flashcards from your study materials.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'PDF Processing',
    description: 'Simply upload your PDF study materials and let our system do the work.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed statistics and insights.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/flashcard-sets')
        .then((res) => res.json())
        .then((data) => setFlashcardSets(data));
    }
  }, [session]);

  const handleUploadComplete = (newSet: FlashcardSet) => {
    setFlashcardSets((prev) => [...prev, newSet]);
    setSelectedSet(newSet);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-bold text-gray-900 mb-6"
            >
              Smart Flash Cards
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              Transform your study materials into intelligent flash cards using AI. Learn faster and retain more with our advanced learning system.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/auth/signin"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
              >
                Get Started for Free
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
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
        {selectedSet ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedSet.title}</h2>
              <button
                onClick={() => setSelectedSet(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Dashboard
              </button>
            </div>
            <FlashCardSet cards={selectedSet.flashcards} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Flashcard Sets</h2>
              <PDFUpload onUploadComplete={handleUploadComplete} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcardSets.map((set) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedSet(set)}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{set.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {set.flashcards.length} cards
                  </p>
                  <div className="flex justify-between items-center">
                    <a
                      href={set.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Original PDF
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSet(set);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Study
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
