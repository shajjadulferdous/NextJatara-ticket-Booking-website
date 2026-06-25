'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

export default function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/bookings/transactions/mine')
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading transactions…
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Transactions</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          No completed payments yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Transactions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        History of all successful payments.
      </p>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">
                    {t.transactionId}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {t.ticketTitle}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {t.paymentDate ? new Date(t.paymentDate).toLocaleString() : '—'}
                  </td>
                  <td className="px-5 py-4 text-right font-black text-violet-700 dark:text-violet-300">
                    ৳{Number(t.amount || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
