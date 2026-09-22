// VGI CAMPUS API Client (React Native JavaScript)

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5050/api/v1';

let inMemoryToken = null;
let inMemoryUser = null;

export function getStoredToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('vgi_mobile_token');
    }
  } catch (e) {}
  return inMemoryToken;
}

export function setStoredToken(token) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vgi_mobile_token', token);
    }
  } catch (e) {}
  inMemoryToken = token;
}

export function clearStoredToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('vgi_mobile_token');
      localStorage.removeItem('vgi_mobile_user');
    }
  } catch (e) {}
  inMemoryToken = null;
  inMemoryUser = null;
}

export function getStoredUser() {
  try {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('vgi_mobile_user');
      return user ? JSON.parse(user) : null;
    }
  } catch (e) {}
  return inMemoryUser;
}

export function setStoredUser(user) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vgi_mobile_user', JSON.stringify(user));
    }
  } catch (e) {}
  inMemoryUser = user;
}

export async function apiRequest(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    // Add a 6-second timeout so user is not stuck if backend is offline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const body = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        clearStoredToken();
      }
      return { 
        success: false, 
        error: body.error || { message: body.message || 'Authentication or request failed' } 
      };
    }
    return body;
  } catch (err) {
    console.warn('[VGI CAMPUS] Backend API connection error:', err.message);
    return { 
      success: false, 
      error: { 
        message: 'Server side error' 
      } 
    };
  }
}
