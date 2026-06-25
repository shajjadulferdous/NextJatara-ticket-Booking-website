// Centralised API client. Reads the JWT (issued via /api/auth/session-exchange)
// from localStorage and attaches it as Authorization: Bearer <token>.

const TOKEN_KEY = 'nextjatra.jwt';

export function setToken(token) {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}
export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, headers = {}, cache = 'no-store' } = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const token = getToken();
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { message: res.statusText }; }
    const error = new Error(err.message || 'Request failed');
    error.status = res.status;
    error.payload = err;
    throw error;
  }
  return res.json();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};