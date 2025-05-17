import axios from 'axios';

// Create base axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Updated to port 5001
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // Enable cookies & credentials with CORS
  timeout: 10000 // Add a reasonable timeout (10 seconds)
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    // Log outgoing requests when not in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Request [${config.method.toUpperCase()} ${config.url}]:`, {
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Configuration Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log success responses when not in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`API Success [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.status);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // Network or server down errors
    if (!error.response) {
      console.error('Network Error: Server might be down or unreachable');
    }
    
    return Promise.reject(error);
  }
);

export default api;