const API_BASE_URL = '/api';

async function fetchWithAuth(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Asigură-te că folosești cookie-uri pentru autentificare
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API request failed');
  }
  return response.json();
}

export const api = {
  createJob: (jobData) => fetchWithAuth('/jobs/create', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),
  getAppliedJobs: () => fetchWithAuth('/jobs/applied'),
  registerClient: (clientData) => fetchWithAuth('/auth/register-client', {
    method: 'POST',
    body: JSON.stringify(clientData),
  }),
  // Adaugă alte metode API aici
};