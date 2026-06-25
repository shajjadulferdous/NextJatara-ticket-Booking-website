'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

export default function VendorProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    api.get('/api/auth/me')
      .then(setProfile)
      .catch(console.error);
  }, [user?.email]);

  if (!profile) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading profile…
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Vendor Profile</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Your vendor account details.
      </p>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name" value={profile.name} />
        <Field label="Email" value={profile.email} />
        <Field label="Role" value={profile.role} />
        <Field label="User ID" value={profile.id} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white break-all">
        {value || '—'}
      </p>
    </div>
  );
}
