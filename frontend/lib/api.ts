const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('journalapp_token')
}

export function setToken(token: string) {
  localStorage.setItem('journalapp_token', token)
}

export function clearToken() {
  localStorage.removeItem('journalapp_token')
}

export function getStoredUsername(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('journalapp_username')
}

export function setStoredUsername(username: string) {
  localStorage.setItem('journalapp_username', username)
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (res.status === 401 || res.status === 403) {
    clearToken()
    const err = new Error('Session expired. Please log in again.') as Error & { status?: number }
    err.status = res.status
    throw err
  }
  const text = await res.text()
  if (!res.ok) {
    const err = new Error(text || `Request failed (${res.status})`) as Error & { status?: number }
    err.status = res.status
    throw err
  }
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    // backend returned plain text (e.g. JWT token, "User created")
    return text
  }
}

export const api = {
  // --- Auth ---
  signup: (username: string, password: string) =>
    request('/public/signup', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username: string, password: string) =>
    request('/public/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  // --- Journal ---
  getEntries: () => request('/journal').catch((e) => {
    if (e.status === 404) return []
    throw e
  }),
  createEntry: (entry: { title: string; content: string; tags: string[] }) =>
    request('/journal', { method: 'POST', body: JSON.stringify(entry) }),
  updateEntry: (id: string, entry: { title?: string; content?: string; tags?: string[] }) =>
    request(`/journal/id/${id}`, { method: 'PUT', body: JSON.stringify(entry) }),
  deleteEntry: (id: string) => request(`/journal/id/${id}`, { method: 'DELETE' }),
  getStats: () => request('/journal/stats'),

  // --- Habits ---
  getHabits: () => request('/habit').catch((e) => {
    if (e.status === 404) return []
    throw e
  }),
  createHabit: (habit: { name: string; category?: string; reminderTime?: string }) =>
    request('/habit', { method: 'POST', body: JSON.stringify(habit) }),
  updateHabit: (id: string, habit: Record<string, unknown>) =>
    request(`/habit/id/${id}`, { method: 'PUT', body: JSON.stringify(habit) }),
  deleteHabit: (id: string) => request(`/habit/id/${id}`, { method: 'DELETE' }),
  toggleHabit: (id: string, date: string) =>
    request(`/habit/id/${id}/toggle?date=${date}`, { method: 'PATCH' }),

  // --- User ---
  updateUser: (user: Record<string, unknown>) =>
    request('/user', { method: 'PUT', body: JSON.stringify(user) }),
  deleteUser: () => request('/user', { method: 'DELETE' }),
}
