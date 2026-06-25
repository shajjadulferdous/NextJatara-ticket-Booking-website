'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import TicketCard from '@/compontents/ui/TicketCard';
import Spinner from '@/compontents/ui/Spinner';
import { api } from '@/lib/api';

const TRANSPORTS = ['Bus', 'Train', 'Launch', 'Plane'];

export default function AllTicketsPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [transport, setTransport] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const [items, setItems] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const q = new URLSearchParams();
      if (from) q.set('from', from);
      if (to) q.set('to', to);
      if (transport) q.set('transport', transport);
      q.set('sort', sort);
      q.set('page', String(page));
      q.set('limit', String(limit));
      const data = await api.get(`/api/tickets?${q.toString()}`);
      setItems(data.items || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [from, to, transport, sort, page, limit]);

  useEffect(() => {
    const t = setTimeout(fetchTickets, 250);
    return () => clearTimeout(t);
  }, [fetchTickets]);

  const reset = () => {
    setFrom(''); setTo(''); setTransport('all'); setSort('newest'); setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Browse</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">All Tickets</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{total} approved ticket{total === 1 ? '' : 's'} available.</p>
      </div>

      {/* Search / filter / sort bar */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={from}
            onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            placeholder="From (origin)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          />
        </div>
        <div className="lg:col-span-2 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={to}
            onChange={(e) => { setTo(e.target.value); setPage(1); }}
            placeholder="To (destination)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={transport}
            onChange={(e) => { setTransport(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm appearance-none"
          >
            <option value="all">All Transports</option>
            {TRANSPORTS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2 flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
          <button onClick={reset} className="px-4 py-3 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            Reset
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {loading ? (
          <div className="py-16 flex justify-center"><Spinner size={36} /></div>
        ) : err ? (
          <p className="text-red-500 text-center py-12">{err}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-16">No tickets match your filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((t) => <TicketCard key={t._id} ticket={t} />)}
            </div>
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 font-semibold"
              >
                Prev
              </button>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page >= pages}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 font-semibold"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}