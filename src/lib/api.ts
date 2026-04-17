const FUNC = {
  auth: 'https://functions.poehali.dev/50a9040b-05c1-416b-8bf0-05c4eaad87d2',
  products: 'https://functions.poehali.dev/82913488-73cd-4fe9-a05b-f3122f863af9',
  programs: 'https://functions.poehali.dev/3a8d6d4f-b5a0-4874-942a-1b6de5be4e70',
  bookings: 'https://functions.poehali.dev/3b8f438b-0ede-497a-8569-98a38e1af92c',
};

function getToken() {
  return localStorage.getItem('aura_token') || '';
}

function authHeaders() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function post(url: string, body: object, auth = false) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? authHeaders() : {}),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(url: string, params?: Record<string, string>, auth = false) {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(url + q, {
    headers: { ...(auth ? authHeaders() : {}) },
  });
  return res.json();
}

export const api = {
  register: (data: object) => post(FUNC.auth, { action: 'register', ...data }),
  login: (email: string, password: string) => post(FUNC.auth, { action: 'login', email, password }),
  me: () => get(FUNC.auth + '/me', undefined, true),

  getProducts: (category?: string) => get(FUNC.products, category ? { category } : undefined),
  getMyProducts: () => get(FUNC.products + '/my', undefined, true),
  addProduct: (data: object) => post(FUNC.products, data, true),

  getPrograms: () => get(FUNC.programs),
  getMyPrograms: () => get(FUNC.programs + '/my', undefined, true),
  addProgram: (data: object) => post(FUNC.programs, data, true),

  createBooking: (data: object) => post(FUNC.bookings, data, true),
  getMyBookings: () => get(FUNC.bookings, undefined, true),
};

export function saveAuth(token: string, role: string, firstName: string) {
  localStorage.setItem('aura_token', token);
  localStorage.setItem('aura_role', role);
  localStorage.setItem('aura_name', firstName);
}

export function clearAuth() {
  localStorage.removeItem('aura_token');
  localStorage.removeItem('aura_role');
  localStorage.removeItem('aura_name');
}

export function getRole() {
  return localStorage.getItem('aura_role') || '';
}

export function getUserName() {
  return localStorage.getItem('aura_name') || '';
}

export function isLoggedIn() {
  return !!localStorage.getItem('aura_token');
}
