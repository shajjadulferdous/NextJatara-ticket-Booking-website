'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Link from 'next/link';

const slides = [
  {
    title: 'Travel Bangladesh, the easy way',
    subtitle: 'Bus, train, launch & flight tickets — all in one place.',
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=70',
    cta: 'Explore Tickets',
  },
  {
    title: 'Discover scenic routes',
    subtitle: 'From Cox&apos;s Bazar to Sylhet — premium operators at fair prices.',
    img: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1600&q=70',
    cta: 'See Latest Tickets',
  },
  {
    title: 'Secure payments with Stripe',
    subtitle: 'Pay safely. Get instant booking confirmation.',
    img: 'https://images.unsplash.com/photo-1556122071-e404cb6f31c0?auto=format&fit=crop&w=1600&q=70',
    cta: 'How it works',
  },
];

export default function HeroSlider() {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="rounded-3xl"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-[420px] md:h-[480px] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex items-center px-6 sm:px-12">
                <div className="max-w-xl text-white">
                  <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-violet-600/90 px-3 py-1 rounded-full">
                    NextJatra · TicketBari
                  </p>
                  <h1 className="mt-4 text-3xl sm:text-5xl font-black leading-tight">{s.title}</h1>
                  <p className="mt-3 text-base sm:text-lg text-white/90" dangerouslySetInnerHTML={{ __html: s.subtitle }} />
                  <Link
                    href="/tickets"
                    className="inline-block mt-6 bg-white text-violet-700 font-bold px-6 py-3 rounded-xl hover:bg-violet-50 transition"
                  >
                    {s.cta}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}