const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const res = await fetch(`${URL}${path}`, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...options.headers } : options.headers
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || data?.message || 'request failed');
  return data;
};

export const api = {
  get: (q = '') => request(`/tasks?${q}`),
  add: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  edit: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  del: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};
