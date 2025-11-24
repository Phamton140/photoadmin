
/**
 * Utility function to perform API requests with automatic token injection and error handling.
 *
 * Features:
 * 1. Automatically retrieves 'authToken' from localStorage and adds it to the Authorization header.
 * 2. Sets default Content-Type and Accept headers to application/json.
 * 3. Automatically handles 401 Unauthorized responses by clearing the token and redirecting to /login.
 * 4. Throws informative errors for non-2xx responses.
 *
 * @param {string} endpoint - The API endpoint (e.g., "/login", "/users").
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {object} body - The request body (for POST, PUT methods).
 * @returns {Promise<any>} - The parsed JSON response data.
 */
const API_BASE_URL = "https://darksalmon-chamois-397403.hostingersite.com/api";

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem('authToken');

  // Define base headers
  const headers = {
    'Accept': 'application/json',
  };

  // Inject Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  // Handle Body and Content-Type
  if (body) {
    // Check if the body is FormData (used for file uploads)
    if (body instanceof FormData) {
      // CRITICAL: When sending FormData, we MUST NOT set the Content-Type header manually.
      // The browser will automatically set 'Content-Type: multipart/form-data' 
      // and generate the correct boundary string required by the server.
      config.body = body;
    } else {
      // For standard JSON requests
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  const url = `${API_BASE_URL}${endpoint}`;

  // Debug: Log the outgoing request
  console.log(`API Request: ${method} ${url}`);

  try {
    const response = await fetch(url, config);

    // Handle Unauthorized (401) access immediately
    if (response.status === 401) {
      console.warn('Unauthorized access detected. Clearing session and redirecting to login.');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData'); // Clean up user data as well
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    // Attempt to parse JSON response
    let data;
    let text; 
    try {
      text = await response.text();
      // Check if response is empty
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      if (response.ok) {
        // If 200 OK but not JSON (e.g. empty body), return empty object
        data = {};
      } else {
        console.warn('Failed to parse JSON response:', parseError);
        data = { message: text || 'Unknown error occurred.' };
      }
    }

    // Handle other HTTP errors (4xx, 5xx)
    if (!response.ok) {
      const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
      console.error(`API Error (${response.status}):`, errorMessage);
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Re-throw the error so the calling component can handle specific UI states (like loading spinners)
    throw error;
  }
};
