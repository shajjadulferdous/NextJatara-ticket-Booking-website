import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-160px)] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="text-center max-w-md">
        <p className="text-sm font-bold tracking-widest text-violet-600 uppercase">Error 404</p>
        <h1 className="mt-2 text-4xl font-black text-gray-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block mt-6 bg-violet-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}