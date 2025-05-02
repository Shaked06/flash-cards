'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashCard {
  id: string;
  term: string;
  explanation: string;
}

interface FlashCardSetProps {
  cards: FlashCard[];
}

export default function FlashCardSet({ cards }: FlashCardSetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [showStats, setShowStats] = useState(false);

  // Handle case when cards are not yet loaded
  if (!cards || cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No flashcards available</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const isLastCard = currentIndex === cards.length - 1;

  const handleNext = () => {
    setDirection(1);
    setIsFlipped(false);
    if (isLastCard) {
      setShowStats(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleMarkAsKnown = () => {
    setKnownCards((prev) => new Set([...prev, currentCard.id]));
    handleNext();
  };

  const handleMarkAsUnknown = () => {
    setKnownCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(currentCard.id);
      return newSet;
    });
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowStats(false);
  };

  const handleReviewUnknown = () => {
    const unknownCards = cards.filter((card) => !knownCards.has(card.id));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowStats(false);
  };

  if (showStats) {
    const knownCount = knownCards.size;
    const unknownCount = cards.length - knownCount;
    const percentage = Math.round((knownCount / cards.length) * 100);

    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Complete!</h2>
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
          <div className="text-gray-600 mb-6">Overall Mastery</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{knownCount}</div>
              <div className="text-gray-600">Cards Known</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{unknownCount}</div>
              <div className="text-gray-600">Cards to Review</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Restart All Cards
          </button>
          {unknownCount > 0 && (
            <button
              onClick={handleReviewUnknown}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Review Unknown Cards
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Card {currentIndex + 1} of {cards.length}
        </p>
      </div>

      <div className="relative h-64 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: direction * 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full h-full"
          >
            <div
              className={`relative w-full h-full cursor-pointer transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
                <p className="text-xl font-medium text-center">{currentCard.term}</p>
              </div>
              <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-lg p-6 flex items-center justify-center rotate-y-180">
                <p className="text-lg text-center">{currentCard.explanation}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-4">
          <button
            onClick={handleMarkAsUnknown}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Don't Know
          </button>
          <button
            onClick={handleMarkAsKnown}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Know
          </button>
        </div>
      </div>
    </div>
  );
} 