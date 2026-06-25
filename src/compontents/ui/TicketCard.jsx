'use client';

import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBus, FaChair } from 'react-icons/fa';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=60';

export default function TicketCard({ ticket, showRoute = true, compact = false }) {
  const remaining = (ticket.quantity || 0) - (ticket.sold || 0);
  const perks = Array.isArray(ticket.amenities) ? ticket.amenities : [];
  return (
    <div className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ticket.bannerUrl || PLACEHOLDER}
          alt={ticket.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
        />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-violet-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          <FaBus size={11} /> {ticket.transportType || 'Bus'}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
          {ticket.title}
        </h3>
        {showRoute && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FaMapMarkerAlt className="text-violet-600" />
            <span className="font-semibold">{ticket.origin || '—'}</span>
            <span className="text-gray-400">→</span>
            <FaMapMarkerAlt className="text-violet-600" />
            <span className="font-semibold">{ticket.destination || '—'}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="text-lg font-black text-violet-700 dark:text-violet-300">
              ৳{Number(ticket.price || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Available</p>
            <p className="text-sm font-bold text-slate-800 dark:text-gray-100 flex items-center gap-1 justify-end">
              <FaChair /> {Math.max(0, remaining)}
            </p>
          </div>
        </div>
        {perks.length > 0 && !compact && (
          <div className="flex flex-wrap gap-1.5">
            {perks.slice(0, 3).map((p) => (
              <span
                key={p}
                className="text-[11px] font-semibold bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-200 px-2 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/tickets/${ticket._id}`}
          className="mt-auto inline-flex justify-center items-center bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition"
        >
          See details
        </Link>
      </div>
    </div>
  );
}