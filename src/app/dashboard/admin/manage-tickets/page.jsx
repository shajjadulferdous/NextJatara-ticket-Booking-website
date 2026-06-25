'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export default function AdminManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/tickets')
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handle = async (id, action) => {
    try {
      await api.patch(`/api/admin/tickets/${id}/${action}`);
      toast.success(`Ticket ${action}ed`);
      load();
    } catch (e) {
      toast.error(e.payload?.message || `Failed to ${action}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading tickets…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Manage Tickets</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Approve or reject tickets submitted by vendors.
      </p>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Vendor</th>
                <th className="px-5 py-4">Route</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {t.title}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    <div className="font-medium">{t.vendorName}</div>
                    <div>{t.vendorEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {t.origin} → {t.destination}
                  </td>
                  <td className="px-5 py-4 font-black text-violet-700 dark:text-violet-300">
                    ৳{Number(t.price || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        STATUS_STYLES[t.verification] || STATUS_STYLES.pending
                      }`}
                    >
                      {t.verification}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {t.verification === 'pending' ? (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handle(t._id, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          onClick={() => handle(t._id, 'reject')}
                          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-500">
                    No tickets in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
