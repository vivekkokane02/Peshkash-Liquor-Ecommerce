const API_URL = 'https://peshkash-liquor-ecommerce.vercel.app/api' || 'http://localhost:5000/api';

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // Network failure (server down, no connection) — never a JSON body to parse.
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0, 'NETWORK_ERROR');
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      body?.message || 'Something went wrong. Please try again.',
      res.status,
      body?.error?.code,
      body?.error?.details
    );
  }

  return body;
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
