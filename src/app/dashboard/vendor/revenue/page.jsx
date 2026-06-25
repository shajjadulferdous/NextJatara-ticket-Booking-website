'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function VendorRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/bookings/vendor/revenue')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading revenue…
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { label: 'Tickets Added', value: data.totalAdded, color: 'bg-blue-100 text-blue-600' },
    { label: 'Tickets Sold', value: data.totalSold, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Revenue', value: `৳${Number(data.totalRevenue || 0).toLocaleString()}`, color: 'bg-violet-100 text-violet-600' },
  ];

  const byTicket = (data.byTicket || []).map((r, i) => ({
    name: r.title?.slice(0, 14) || `Ticket ${i + 1}`,
    revenue: r.revenue,
    sold: r.sold,
  }));

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Revenue</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Earnings broken down across your ticket inventory.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className="p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl"
          >
            <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-xl font-black`}>
              ৳
            </div>
            <p className="mt-4 text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Revenue by ticket</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byTicket}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)' }}
                />
                <Bar dataKey="revenue" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">Sales share</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byTicket}
                  dataKey="sold"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {byTicket.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
