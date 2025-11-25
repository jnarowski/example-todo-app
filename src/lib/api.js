const API_BASE_URL = '/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to implement exponential backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to perform fetch with timeout
async function fetchWithTimeout(url, options, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (response.status === 204) {
    return null; // No content
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'API request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return null;
}

// Helper function to perform fetch with retry logic
async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`[API] ${options.method || 'GET'} ${url}${attempt > 0 ? ` (retry ${attempt})` : ''}`);

      const response = await fetchWithTimeout(url, options);
      const data = await handleResponse(response);

      console.log(`[API] ${options.method || 'GET'} ${url} - Success`);
      return data;
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx) or aborts
      if (error.status && error.status >= 400 && error.status < 500) {
        console.error(`[API] ${options.method || 'GET'} ${url} - Client error:`, error.message);
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === retries) {
        console.error(`[API] ${options.method || 'GET'} ${url} - Failed after ${retries + 1} attempts:`, error.message);
        break;
      }

      // Wait with exponential backoff before retrying
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      console.warn(`[API] ${options.method || 'GET'} ${url} - Error, retrying in ${delay}ms:`, error.message);
      await sleep(delay);
    }
  }

  throw lastError;
}

// Fetch all todos
export async function fetchTodos() {
  return fetchWithRetry(`${API_BASE_URL}/todos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Create a new todo
export async function createTodo(text) {
  return fetchWithRetry(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
}

// Update a todo
export async function updateTodo(id, updates) {
  return fetchWithRetry(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
}

// Delete a todo
export async function deleteTodo(id) {
  return fetchWithRetry(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
