'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
};

export default function VendorMyTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/api/tickets/mine')
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, verification) => {
    if (verification === 'rejected') {
      toast.error('Rejected tickets cannot be deleted');
      return;
    }
    if (!confirm('Delete this ticket permanently?')) return;
    try {
      await api.delete(`/api/tickets/${id}`);
      toast.success('Ticket deleted');
      load();
    } catch (e) {
      toast.error(e.payload?.message || 'Delete failed');
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {tickets.length} ticket{tickets.length === 1 ? '' : 's'} in your inventory.
          </p>
        </div>
        <Link
          href="/dashboard/vendor/addticket"
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
        >
          <FaPlus /> Add Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          You haven&apos;t added any tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
          {tickets.map((t) => {
            const remaining = (t.quantity || 0) - (t.sold || 0);
            const disabled = t.verification === 'rejected';
            return (
              <div
                key={t._id}
                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-gray-100 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      t.bannerUrl ||
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=60'
                    }
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      STATUS_STYLES[t.verification] || STATUS_STYLES.pending
                    }`}
                  >
                    {t.verification || 'pending'}
                  </span>
                  {t.isAdvertised && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-600 text-white">
                      Advertised
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t.origin} → {t.destination}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price</span>
                    <span className="font-bold text-violet-700 dark:text-violet-300">
                      ৳{Number(t.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Remaining</span>
                    <span className="font-bold">{Math.max(0, remaining)}</span>
                  </div>
                  {disabled && (
                    <p className="text-xs text-rose-500 mt-1">
                      This ticket was rejected — no further edits.
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      onClick={() => router.push(`/dashboard/vendor/my-tickets/edit?id=${t._id}`)}
                      disabled={disabled}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-600 text-sm font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(t._id, t.verification)}
                      disabled={disabled}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 disabled:opacity-40 text-rose-600 text-sm font-bold py-2 rounded-xl flex items-center justify-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
