const BASE_URL = '/api/v1';

export function getStoredToken(): string | null {
  return localStorage.getItem('vgi_mobile_token');
}

export function setStoredToken(token: string) {
  localStorage.setItem('vgi_mobile_token', token);
}

export function clearStoredToken() {
  localStorage.removeItem('vgi_mobile_token');
  localStorage.removeItem('vgi_mobile_user');
}

export function getStoredUser(): any | null {
  const user = localStorage.getItem('vgi_mobile_user');
  return user ? JSON.parse(user) : null;
}

export function setStoredUser(user: any) {
  localStorage.setItem('vgi_mobile_user', JSON.stringify(user));
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: any; message?: string }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as any) || {})
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const body = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        clearStoredToken();
      }
      return { success: false, error: body.error || { message: 'Request failed' } };
    }
    return body;
  } catch (err: any) {
    return { success: false, error: { message: err.message || 'Network error' } };
  }
}
