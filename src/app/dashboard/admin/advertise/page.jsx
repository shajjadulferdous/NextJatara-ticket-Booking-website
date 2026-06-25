'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaBullhorn, FaCheck, FaTimes } from 'react-icons/fa';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

export default function AdminAdvertise() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/api/admin/tickets'), api.get('/api/tickets/advertised')])
      .then(([all, advertised]) => {
        const approved = all.filter((t) => t.verification === 'approved');
        setTickets(approved);
        setCount(advertised.length);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (t) => {
    if (!t.isAdvertised && count >= 6) {
      toast.error('Maximum 6 advertised tickets allowed. Unadvertise one first.');
      return;
    }
    try {
      await api.patch(`/api/admin/tickets/${t._id}/advertise`);
      toast.success(t.isAdvertised ? 'Removed from advertise' : 'Now advertised');
      load();
    } catch (e) {
      toast.error(e.payload?.message || 'Failed to update');
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
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Advertise Tickets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Highlight up to 6 tickets on the home page slider.
          </p>
        </div>
        <div className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <FaBullhorn /> {count}/6 active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
        {tickets.map((t) => (
          <div
            key={t._id}
            className={`bg-white dark:bg-gray-800 border-2 rounded-2xl overflow-hidden flex flex-col transition ${
              t.isAdvertised
                ? 'border-violet-500 shadow-lg'
                : 'border-gray-100 dark:border-gray-700'
            }`}
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
              {t.isAdvertised && (
                <span className="absolute top-3 left-3 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Live
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
              <p className="text-lg font-black text-violet-700 dark:text-violet-300">
                ৳{Number(t.price || 0).toLocaleString()}
              </p>
              <button
                onClick={() => toggle(t)}
                className={`mt-auto w-full text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition ${
                  t.isAdvertised
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                {t.isAdvertised ? (
                  <>
                    <FaTimes /> Unadvertise
                  </>
                ) : (
                  <>
                    <FaCheck /> Advertise
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10">
            No approved tickets to advertise.
          </div>
        )}
      </div>
    </div>
  );
}
