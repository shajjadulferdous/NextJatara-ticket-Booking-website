'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  rejected: 'bg-rose-100 text-rose-700',
  paid: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

export default function VendorBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/api/bookings/vendor')
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handle = async (id, action) => {
    try {
      await api.patch(`/api/bookings/${id}/${action}`);
      toast.success(`Booking ${action}ed`);
      load();
    } catch (e) {
      toast.error(e.payload?.message || `Failed to ${action}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading bookings…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Bookings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Approve or reject incoming booking requests for your tickets.
      </p>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Ticket</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Qty</th>
                <th className="px-5 py-4">Total</th>
                <th className="px-5 py-4">Departure</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {b.ticketTitle}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    <div className="font-medium">{b.userName}</div>
                    <div className="text-xs">{b.userEmail}</div>
                  </td>
                  <td className="px-5 py-4 font-bold">{b.quantity}</td>
                  <td className="px-5 py-4 font-black text-violet-700 dark:text-violet-300">
                    ৳{Number(b.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {b.departureSchedule
                      ? new Date(b.departureSchedule).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        STATUS_STYLES[b.status] || STATUS_STYLES.pending
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {b.status === 'pending' && (
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handle(b._id, 'accept')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                        >
                          <FaCheck /> Accept
                        </button>
                        <button
                          onClick={() => handle(b._id, 'reject')}
                          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-gray-500">
                    No bookings yet.
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
