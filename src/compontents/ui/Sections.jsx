'use client';

import React from 'react';
import { FaShieldAlt, FaBolt, FaHeadset, FaRoute } from 'react-icons/fa';

export function WhyChooseUs() {
  const items = [
    { icon: <FaShieldAlt />, title: 'Verified Operators', text: 'Every vendor is reviewed. Book only with confidence.' },
    { icon: <FaBolt />, title: 'Instant Confirmation', text: 'Real-time seat allocation and e-ticket in seconds.' },
    { icon: <FaHeadset />, title: '24/7 Support', text: 'Our travel experts are always one call away.' },
    { icon: <FaRoute />, title: 'All Routes Covered', text: 'Bus, train, launch, plane — over 200 routes nationwide.' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Why Choose Us</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">Travel made simple</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.title} className="p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center text-xl">
              {it.icon}
            </div>
            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{it.title}</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PopularRoutes() {
  const routes = [
    { from: 'Dhaka', to: 'Cox&apos;s Bazar', price: 1200, transport: 'Bus' },
    { from: 'Dhaka', to: 'Sylhet', price: 850, transport: 'Train' },
    { from: 'Dhaka', to: 'Chittagong', price: 950, transport: 'Bus' },
    { from: 'Dhaka', to: 'Sundarbans', price: 1500, transport: 'Launch' },
    { from: 'Dhaka', to: 'Rajshahi', price: 780, transport: 'Train' },
    { from: 'Dhaka', to: 'Barisal', price: 1100, transport: 'Launch' },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Popular Routes</p>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">Trending destinations</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {routes.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{r.from} → {r.to}</p>
              <p className="text-xs text-gray-500">{r.transport}</p>
            </div>
            <p className="text-violet-700 dark:text-violet-300 font-black">৳{r.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}