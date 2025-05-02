'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';

interface PDFUploadProps {
  onUploadComplete: (cards: Array<{ term: string; explanation: string }>) => void;
}

export function PDFUpload({ onUploadComplete }: PDFUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const cards = await response.json();
      onUploadComplete(cards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
    } finally {
      setIsProcessing(false);
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <>
              <FaSpinner className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Processing PDF...</p>
            </>
          ) : (
            <>
              <FaFileUpload className="w-12 h-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive
                  ? "Drop your PDF here"
                  : "Drag and drop your PDF here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Your PDF will be processed to create flashcards
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 