'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaChair, FaDollarSign } from 'react-icons/fa';
import Countdown from '@/compontents/ui/Countdown';
import Spinner from '@/compontents/ui/Spinner';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=70';

export default function TicketDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const t = await api.get(`/api/tickets/${id}`);
        if (!cancelled) setTicket(t);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="py-32 flex justify-center"><Spinner size={36} /></div>;
  if (error || !ticket) return <div className="text-center py-32 text-red-500">{error || 'Ticket not found'}</div>;

  const remaining = (ticket.quantity || 0) - (ticket.sold || 0);
  const departed = new Date(ticket.departureSchedule) <= new Date();
  const canBook = !departed && remaining > 0;

  const handleBook = async () => {
    if (!user) {
      toast.error('Please login to book a ticket');
      router.push('/login');
      return;
    }
    if (qty < 1 || qty > remaining) {
      toast.error(`Quantity must be 1–${remaining}`);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/bookings', { ticketId: ticket._id, quantity: qty });
      toast.success('Booking placed! Awaiting vendor confirmation.');
      setOpen(false);
      router.push('/dashboard/user/bookings');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ticket.bannerUrl || PLACEHOLDER}
              alt={ticket.title}
              className="w-full h-80 object-cover"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
            />
          </div>
          <div className="mt-6">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-200 px-3 py-1 rounded-full">
              <FaBus /> {ticket.transportType}
            </span>
            <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{ticket.title}</h1>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info icon={<FaMapMarkerAlt />} label="From" value={ticket.origin} />
              <Info icon={<FaMapMarkerAlt />} label="To" value={ticket.destination} />
              <Info icon={<FaCalendarAlt />} label="Departure" value={new Date(ticket.departureSchedule).toLocaleString()} />
              <Info icon={<FaChair />} label="Seats available" value={`${remaining} / ${ticket.quantity}`} />
              <Info icon={<FaDollarSign />} label="Per unit" value={`৳${Number(ticket.price).toLocaleString()}`} />
            </div>

            {Array.isArray(ticket.amenities) && ticket.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-slate-900 dark:text-white">Perks</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticket.amenities.map((p) => (
                    <span key={p} className="text-xs font-semibold bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-200 px-3 py-1.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 h-fit">
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
            <p className="text-sm text-gray-500">Price per ticket</p>
            <p className="text-3xl font-black text-violet-700 dark:text-violet-300">৳{Number(ticket.price).toLocaleString()}</p>

            <div className="mt-4">
              <p className="text-xs uppercase font-bold text-gray-500">Departure in</p>
              <Countdown target={ticket.departureSchedule} className="text-base mt-1" />
            </div>

            <button
              onClick={() => setOpen(true)}
              disabled={!canBook}
              className="mt-6 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition"
            >
              {departed ? 'Departed' : remaining === 0 ? 'Sold Out' : 'Book Now'}
            </button>
            {!canBook && remaining > 0 && !departed && (
              <p className="mt-2 text-xs text-gray-500 text-center">Login to book this ticket.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Booking modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Ticket</h2>
            <p className="text-sm text-gray-500 mt-1">{ticket.title}</p>
            <div className="mt-4">
              <label className="text-sm font-semibold">Quantity (max {remaining})</label>
              <input
                type="number"
                min={1}
                max={remaining}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(remaining, Number(e.target.value))))}
                className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
              />
            </div>
            <div className="mt-4 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-sm">
              <div className="flex justify-between"><span>Unit price</span><span>৳{ticket.price}</span></div>
              <div className="flex justify-between mt-1"><span>Quantity</span><span>{qty}</span></div>
              <div className="flex justify-between mt-2 font-bold text-violet-700 dark:text-violet-300 border-t border-violet-200 dark:border-violet-800 pt-2">
                <span>Total</span><span>৳{Number(ticket.price) * qty}</span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold">Cancel</button>
              <button onClick={handleBook} disabled={submitting} className="flex-1 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold">
                {submitting ? 'Booking…' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
      <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold text-slate-900 dark:text-white">{value || '—'}</p>
      </div>
    </div>
  );
}