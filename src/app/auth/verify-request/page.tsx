'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
      >
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h1>
        <p className="text-gray-600 mb-8">
          A sign-in link has been sent to your email address. Please click the link to continue.
        </p>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Didn't receive an email?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Try again
            </Link>
          </p>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500">
              The link will expire in 24 hours. If you don't see the email, check your spam folder.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 