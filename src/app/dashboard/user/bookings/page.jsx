'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';
import Countdown from '@/compontents/ui/Countdown';
import CheckoutForm from '@/compontents/payment/CheckoutForm';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBooking, setPayingBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [payingMeta, setPayingMeta] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/api/bookings/mine')
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/api/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      load();
    } catch (e) {
      toast.error(e.payload?.message || 'Failed to cancel');
    }
  };

  const handlePay = async (booking) => {
    setPayingBooking(booking._id);
    setPayingMeta({ amount: booking.totalPrice, title: booking.ticketTitle });
    try {
      const res = await api.post(`/api/bookings/${booking._id}/pay`);
      if (res.clientSecret) {
        setClientSecret(res.clientSecret);
      } else if (res.success) {
        toast.success('Payment confirmed locally (no Stripe key configured)');
        await api.post(`/api/bookings/${booking._id}/confirm`);
        setPayingBooking(null);
        setPayingMeta(null);
        load();
      }
    } catch (e) {
      toast.error(e.payload?.message || 'Failed to initiate payment');
      setPayingBooking(null);
      setPayingMeta(null);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      await api.post(`/api/bookings/${payingBooking}/confirm`);
      toast.success('Payment successful');
    } catch (e) {
      toast.error('Confirm failed: ' + (e.payload?.message || e.message));
    }
    setPayingBooking(null);
    setClientSecret(null);
    setPayingMeta(null);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading bookings…
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Bookings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You haven&apos;t booked any tickets yet.
        </p>
        <Link
          href="/tickets"
          className="inline-block mt-6 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl"
        >
          Browse tickets
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">My Bookings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Pay for accepted bookings before departure to keep your seat.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
        {bookings.map((b) => {
          const departed = b.departureSchedule && new Date(b.departureSchedule) <= new Date();
          const status = b.status;
          const canPay = status === 'accepted' && !departed;
          const canCancel = status === 'pending';
          return (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-gray-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    b.image ||
                    b.bannerUrl ||
                    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=60'
                  }
                  alt={b.ticketTitle}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    STATUS_STYLES[status] || STATUS_STYLES.pending
                  }`}
                >
                  {status}
                </span>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                  {b.ticketTitle}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    <span className="font-semibold">{b.origin}</span> →{' '}
                    <span className="font-semibold">{b.destination}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {b.departureSchedule
                      ? new Date(b.departureSchedule).toLocaleString()
                      : 'TBD'}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Qty</span>
                  <span className="font-bold">{b.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="text-lg font-black text-violet-700 dark:text-violet-300">
                    ৳{Number(b.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
                {b.departureSchedule && (
                  <Countdown target={b.departureSchedule} />
                )}

                <div className="mt-auto flex flex-col gap-2 pt-2">
                  {canPay && (
                    <button
                      onClick={() => handlePay(b)}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold py-2.5 rounded-xl transition"
                    >
                      Pay Now
                    </button>
                  )}
                  {departed && status !== 'paid' && status !== 'rejected' && (
                    <p className="text-xs text-rose-500 text-center">
                      Departed — payment closed.
                    </p>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold py-2.5 rounded-xl transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {payingBooking && clientSecret && stripePromise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Pay ৳{Number(payingMeta?.amount || 0).toLocaleString()}
            </h2>
            <p className="text-sm text-gray-500 mb-4">{payingMeta?.title}</p>
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
            <button
              onClick={() => {
                setPayingBooking(null);
                setClientSecret(null);
                setPayingMeta(null);
              }}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
