// ANPASSEN fuer Produktion: VITE_API_URL in einer .env-Datei im frontend-Ordner
// auf die echte Backend-URL setzen (z.B. https://mein-projekt.onrender.com/api)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
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

export function forgotPasswordRequest(email: string) {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPasswordRequest(token: string, newPassword: string) {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export function verifyEmailRequest(token: string) {
  return request<{ message: string }>(`/auth/verify?token=${encodeURIComponent(token)}`);
}

export function resendVerificationRequest() {
  return request<{ message: string }>('/auth/resend-verification', { method: 'POST' });
}

export function changePasswordRequest(currentPassword: string, newPassword: string) {
  return request<{ message: string }>('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function updateProfileRequest(name: string) {
  return request<{ message: string; user: AuthUser }>('/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export function changeEmailRequest(newEmail: string, currentPassword: string) {
  return request<{ message: string }>('/auth/change-email', {
    method: 'POST',
    body: JSON.stringify({ newEmail, currentPassword }),
  });
}

export function deleteAccountRequest(password: string) {
  return request<{ message: string }>('/auth/me', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
