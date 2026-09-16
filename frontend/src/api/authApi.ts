const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Etwas ist schiefgelaufen');
  }

  return data;
}

export function registerRequest(name: string, email: string, password: string) {
  return request<{ user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function loginRequest(email: string, password: string) {
  return request<{ user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logoutRequest() {
  return request<{ message: string }>('/auth/logout', { method: 'POST' });
}

export function getMeRequest() {
  return request<{ user: AuthUser }>('/auth/me');
}
