'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface FlashCardProps {
  term: string;
  explanation: string;
  onKnown: () => void;
  onUnknown: () => void;
  isKnown?: boolean;
}

export function FlashCard({ term, explanation, onKnown, onUnknown, isKnown }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full max-w-xl aspect-[4/3] perspective-1000">
      <motion.div
        className={`relative w-full h-full transform-style-3d cursor-pointer`}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center
            ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">{term}</h2>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center
            transform rotateY-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-lg text-gray-700 text-center">{explanation}</p>
        </div>
      </motion.div>

      {/* Control buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnknown();
          }}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onKnown();
          }}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <FaCheck className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
} 