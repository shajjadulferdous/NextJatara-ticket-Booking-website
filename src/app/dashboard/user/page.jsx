'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTicketAlt, FaCheckCircle, FaHourglassHalf, FaSearch } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import Spinner from '@/compontents/ui/Spinner';

export default function UserHome() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/bookings/mine')
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = bookings.length;
  const paid = bookings.filter((b) => b.status === 'paid').length;
  const pending = bookings.filter((b) => b.status === 'pending' || b.status === 'accepted').length;

  const tiles = [
    { label: 'Total Bookings', value: total, icon: <FaTicketAlt />, href: '/dashboard/user/bookings', color: 'bg-violet-100 text-violet-600' },
    { label: 'Paid', value: paid, icon: <FaCheckCircle />, href: '/dashboard/user/bookings', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Pending / Accepted', value: pending, icon: <FaHourglassHalf />, href: '/dashboard/user/bookings', color: 'bg-amber-100 text-amber-600' },
    { label: 'Browse Tickets', icon: <FaSearch />, href: '/tickets', color: 'bg-blue-100 text-blue-600', action: 'Explore →' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hello, {user?.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Welcome back. Here&apos;s a snapshot of your bookings.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-md transition"
          >
            <div className={`w-12 h-12 rounded-xl ${t.color} flex items-center justify-center text-xl`}>
              {t.icon}
            </div>
            <p className="mt-4 text-sm text-gray-500">{t.label}</p>
            {t.value !== undefined ? (
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {loading ? <Spinner size={18} /> : t.value}
              </p>
            ) : (
              <p className="text-sm font-semibold text-violet-600 mt-2">{t.action}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
