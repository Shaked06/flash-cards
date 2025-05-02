'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

interface PDFUploadProps {
  onUploadComplete: (flashcardSet: any) => void;
}

export function PDFUpload({ onUploadComplete }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!title.trim()) {
        setError('Please enter a title for your flashcard set');
        return;
      }

      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', title);

      try {
        const response = await fetch('/api/process-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to process PDF');
        }

        const flashcardSet = await response.json();
        onUploadComplete(flashcardSet);
      } catch (err) {
        setError('Failed to process the PDF. Please try again.');
        console.error('Error processing PDF:', err);
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, title]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const dropzoneProps = getRootProps();

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Study Material</h2>
        <p className="text-gray-600">
          Upload your PDF study materials and we'll automatically create flash cards for you.
        </p>
      </motion.div>

      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Flashcard Set Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a title for your flashcard set"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
        onClick={dropzoneProps.onClick}
        onKeyDown={dropzoneProps.onKeyDown}
        onFocus={dropzoneProps.onFocus}
        onBlur={dropzoneProps.onBlur}
        onDrop={dropzoneProps.onDrop}
        onDragEnter={dropzoneProps.onDragEnter}
        onDragLeave={dropzoneProps.onDragLeave}
        onDragOver={dropzoneProps.onDragOver}
        role={dropzoneProps.role}
        tabIndex={dropzoneProps.tabIndex}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <svg
            className={`w-12 h-12 mx-auto ${
              isDragActive ? 'text-blue-500' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <div className="text-lg">
            {isDragActive ? (
              <p className="text-blue-500 font-medium">Drop your PDF here</p>
            ) : (
              <p className="text-gray-600">
                Drag & drop your PDF here, or{' '}
                <span className="text-blue-500 font-medium">click to select</span>
              </p>
            )}
          </div>

          <p className="text-sm text-gray-500">Only PDF files are supported</p>
        </div>
      </motion.div>

      {isUploading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-600">Processing your PDF...</span>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center text-red-600"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
} 