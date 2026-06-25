'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from './auth-client';
import { api, setToken, clearToken } from './api';

// Combined hook: returns Better Auth session, our JWT-backed user, and a login/logout helper.
// On mount we exchange the BA session for a JWT (server reads user collection to get role).
// The JWT is what protects our /api/* endpoints.
export function useAuth({ requireRole } = {}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      if (isPending) return;
      if (!session?.user?.email) {
        clearToken();
        setUser(null);
        setReady(true);
        if (requireRole) router.replace('/login');
        return;
      }
      try {
        const { token, user: u } = await api.post('/api/auth/session-exchange', {
          email: session.user.email,
        });
        if (cancelled) return;
        setToken(token);
        setUser(u);
        if (requireRole) {
          const allowed = Array.isArray(requireRole) ? requireRole : [requireRole];
          if (!allowed.includes(u.role)) {
            router.replace('/login');
          }
        }
      } catch (err) {
        console.error('session-exchange failed', err);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    bootstrap();
    return () => { cancelled = true; };
  }, [session, isPending, requireRole, router]);

  return { session, user, ready, isPending };
}