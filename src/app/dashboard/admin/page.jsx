'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaUsers, FaTicketAlt, FaCheckCircle, FaBullhorn } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import Spinner from '@/compontents/ui/Spinner';

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, tickets: 0, pending: 0, advertised: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/api/admin/users'), api.get('/api/admin/tickets')])
      .then(([users, tickets]) => {
        setStats({
          users: users.length,
          tickets: tickets.length,
          pending: tickets.filter((t) => t.verification === 'pending').length,
          advertised: tickets.filter((t) => t.isAdvertised).length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tiles = [
    { label: 'Total Users', value: stats.users, icon: <FaUsers />, href: '/dashboard/admin/manage-users', color: 'bg-violet-100 text-violet-600' },
    { label: 'Total Tickets', value: stats.tickets, icon: <FaTicketAlt />, href: '/dashboard/admin/manage-tickets', color: 'bg-blue-100 text-blue-600' },
    { label: 'Pending Approval', value: stats.pending, icon: <FaCheckCircle />, href: '/dashboard/admin/manage-tickets', color: 'bg-amber-100 text-amber-600' },
    { label: 'Advertised', value: stats.advertised, icon: <FaBullhorn />, href: '/dashboard/admin/advertise', color: 'bg-emerald-100 text-emerald-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Welcome, {user?.name}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Admin control center.</p>

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
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {loading ? <Spinner size={18} /> : t.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}