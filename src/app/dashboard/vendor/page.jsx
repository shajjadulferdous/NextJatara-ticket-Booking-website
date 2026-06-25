'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaTicketAlt, FaClipboardList, FaDollarSign } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import Spinner from '@/compontents/ui/Spinner';

export default function VendorHome() {
  const { user } = useAuth();
  const [data, setData] = useState({ totalAdded: 0, totalSold: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/bookings/vendor/revenue')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: 'Add Ticket', icon: <FaPlus />, href: '/dashboard/vendor/addticket', color: 'bg-violet-100 text-violet-600' },
    { label: 'Tickets Added', value: data.totalAdded, icon: <FaTicketAlt />, href: '/dashboard/vendor/my-tickets', color: 'bg-blue-100 text-blue-600' },
    { label: 'Tickets Sold', value: data.totalSold, icon: <FaClipboardList />, href: '/dashboard/vendor/bookings', color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Revenue', value: `৳${data.totalRevenue}`, icon: <FaDollarSign />, href: '/dashboard/vendor/revenue', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome, {user?.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vendor portal · manage your fleet.</p>

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
              <p className="text-sm font-semibold text-violet-600 mt-2">Open →</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}