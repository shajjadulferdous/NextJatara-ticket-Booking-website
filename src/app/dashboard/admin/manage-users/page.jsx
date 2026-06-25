'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserShield, FaUserCog, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '@/lib/api';
import Spinner from '@/compontents/ui/Spinner';

const ROLE_STYLES = {
  admin: 'bg-violet-100 text-violet-700',
  vendor: 'bg-blue-100 text-blue-700',
  user: 'bg-gray-100 text-gray-700',
};

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/api/admin/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const promote = async (id, role) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role });
      toast.success(`Role changed to ${role}`);
      load();
    } catch (e) {
      toast.error(e.payload?.message || 'Failed to change role');
    }
  };

  const toggleFraud = async (id, currentFraud) => {
    try {
      await api.patch(`/api/admin/users/${id}/fraud`, { isFraud: !currentFraud });
      toast.success(!currentFraud ? 'Vendor flagged as fraud' : 'Vendor restored');
      load();
    } catch (e) {
      toast.error(e.payload?.message || 'Failed to update fraud status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-500">
        <Spinner size={20} /> Loading users…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Manage Users</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Promote roles or flag fraudulent vendors.
      </p>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isFraud = u.isFraud === true;
                return (
                  <tr
                    key={u._id}
                    className="border-t border-gray-100 dark:border-gray-700"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                      {u.name}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{u.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          ROLE_STYLES[u.role] || ROLE_STYLES.user
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {isFraud ? (
                        <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                          <FaExclamationTriangle /> Fraud
                        </span>
                      ) : (
                        <span className="text-xs text-emerald-600 font-bold">Active</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex flex-wrap gap-2 justify-end">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => promote(u._id, 'admin')}
                            className="bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <FaUserShield /> Make Admin
                          </button>
                        )}
                        {u.role !== 'vendor' && (
                          <button
                            onClick={() => promote(u._id, 'vendor')}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <FaUserCog /> Make Vendor
                          </button>
                        )}
                        {u.role === 'vendor' && (
                          <button
                            onClick={() => toggleFraud(u._id, isFraud)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 ${
                              isFraud
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            }`}
                          >
                            <FaExclamationTriangle />
                            {isFraud ? 'Unflag' : 'Mark as Fraud'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                    No users in the system.
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
