'use client';

import React from 'react';

export default function Spinner({ size = 24, className = '' }) {
  return (
    <div role="status" aria-label="Loading" className={`flex items-center justify-center ${className}`}>
      <svg
        className="animate-spin text-violet-600"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}