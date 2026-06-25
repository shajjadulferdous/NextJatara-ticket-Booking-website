'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main className="min-h-[calc(100vh-160px)] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="text-center max-w-md">
        <p className="text-sm font-bold tracking-widest text-red-600 uppercase">Something went wrong</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">Unexpected error</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {error?.message || 'Please try again.'}
        </p>
        <button
          onClick={reset}
          className="inline-block mt-6 bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-700 transition"
        >
          Try again
        </button>
      </div>
    </main>
  );
}