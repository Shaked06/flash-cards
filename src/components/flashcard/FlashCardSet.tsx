'use client';

import { useState } from 'react';
import { FlashCard } from './FlashCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface FlashCardData {
  id: string;
  term: string;
  explanation: string;
  known: boolean;
}

interface FlashCardSetProps {
  cards: FlashCardData[];
  onUpdateCard: (cardId: string, known: boolean) => void;
  onFinish: (stats: { known: number; unknown: number }) => void;
}

export function FlashCardSet({ cards, onUpdateCard, onFinish }: FlashCardSetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      const stats = cards.reduce(
        (acc, card) => ({
          known: acc.known + (card.known ? 1 : 0),
          unknown: acc.unknown + (card.known ? 0 : 1),
        }),
        { known: 0, unknown: 0 }
      );
      onFinish(stats);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKnown = () => {
    onUpdateCard(cards[currentIndex].id, true);
    goToNext();
  };

  const handleUnknown = () => {
    onUpdateCard(cards[currentIndex].id, false);
    goToNext();
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card container */}
      <div className="relative h-[500px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction < 0 ? 1000 : -1000, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <FlashCard
              term={currentCard.term}
              explanation={currentCard.explanation}
              onKnown={handleKnown}
              onUnknown={handleUnknown}
              isKnown={currentCard.known}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full ${
            currentIndex === 0
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          <FaArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-medium">
          {currentIndex + 1} / {cards.length}
        </span>
        <button
          onClick={goToNext}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          <FaArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
} 