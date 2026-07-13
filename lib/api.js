const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('flowtype-storage');
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        const token = parsed.state?.token;
        if (token) {
          return { Authorization: `Bearer ${token}` };
        }
      } catch (e) {
        // Corrupted storage — ignore
      }
    }
  }
  return {};
};

/**
 * Parses API responses.
 * Backend now wraps everything in { success, data, message }.
 */
const handleResponse = async (res) => {
  const body = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    throw new Error(body.message || `Request failed (${res.status})`);
  }

  // Return the `data` field if present, otherwise the whole body
  return body.data !== undefined ? body.data : body;
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  put: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    });
    return handleResponse(res);
  },
};
