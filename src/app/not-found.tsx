'use client';

import Link from 'next/link';
import { FileText, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-brand-600" />
        </div>

        {/* Error code */}
        <div className="text-6xl font-bold text-surface-300 mb-4">404</div>

        {/* Message */}
        <h1 className="text-2xl font-semibold text-surface-800 mb-3">
          Page not found
        </h1>
        <p className="text-surface-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border border-surface-200 text-surface-600 rounded-xl font-medium hover:bg-surface-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        {/* Help text */}
        <p className="text-sm text-surface-400 mt-8">
          If you think this is an error, please{' '}
          <a href="/" className="text-brand-600 hover:underline">
            contact our support
          </a>
          .
        </p>
      </div>
    </div>
  );
}