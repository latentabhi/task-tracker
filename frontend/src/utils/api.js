const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getUserId = () => {
  let id = localStorage.getItem('flowtask_uid');
  if (!id) {
    id = `Guest_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('flowtask_uid', id);
  }
  return id;
};

const request = async (path, options = {}) => {
  const headers = {
    'X-User-ID': getUserId(),
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers
  };
  const res = await fetch(`${URL}${path}`, {
    ...options,
    headers
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || data?.message || 'request failed');
  return data;
};

export const api = {
  getUser: getUserId,
  setUser: (id) => localStorage.setItem('flowtask_uid', id),
  get: (q = '') => request(`/tasks?${q}`),
  add: (task) => request('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  edit: (id, task) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  del: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};
