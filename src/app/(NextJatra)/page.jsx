'use client';

import React, { useEffect, useState } from 'react';
import HeroSlider from '@/compontents/ui/Section';
import TicketCard from '@/compontents/ui/TicketCard';
import { WhyChooseUs, PopularRoutes } from '@/compontents/ui/Sections';
import Spinner from '@/compontents/ui/Spinner';
import { api } from '@/lib/api';

export default function HomePage() {
  const [advertised, setAdvertised] = useState([]);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [a, l] = await Promise.all([
          api.get('/api/tickets/advertised'),
          api.get('/api/tickets/latest'),
        ]);
        if (!cancelled) {
          setAdvertised(Array.isArray(a) ? a : []);
          setLatest(Array.isArray(l) ? l : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-7xl mx-auto w-full px-6 pt-6">
        <HeroSlider />
      </section>

      <section className="max-w-7xl mx-auto w-full px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Advertisement</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Featured Tickets</h2>
          </div>
        </div>
        {loading ? (
          <div className="py-16"><Spinner size={36} /></div>
        ) : advertised.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No advertised tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertised.map((t) => <TicketCard key={t._id} ticket={t} />)}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto w-full px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Just Added</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">Latest Tickets</h2>
          </div>
        </div>
        {loading ? (
          <div className="py-16"><Spinner size={36} /></div>
        ) : latest.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No tickets available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.map((t) => <TicketCard key={t._id} ticket={t} compact />)}
          </div>
        )}
      </section>

      <WhyChooseUs />
      <PopularRoutes />
    </div>
  );
}