'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Spinner from '@/compontents/ui/Spinner';

export default function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message);
      setSubmitting(false);
    } else {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <p className="mt-3 text-sm text-rose-500">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
      >
        {submitting ? <Spinner size={18} /> : 'Pay Now'}
      </button>
    </form>
  );
}
