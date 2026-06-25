'use client';

import React, { useEffect, useState } from 'react';

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return { days, hours, mins, secs, ms };
}

export default function Countdown({ target, className = '' }) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t) {
    return <span className={`text-xs text-red-500 font-semibold ${className}`}>Departed</span>;
  }
  return (
    <span className={`text-xs font-semibold text-violet-700 dark:text-violet-300 ${className}`}>
      ⏱ {t.days}d {String(t.hours).padStart(2, '0')}h {String(t.mins).padStart(2, '0')}m {String(t.secs).padStart(2, '0')}s
    </span>
  );
}