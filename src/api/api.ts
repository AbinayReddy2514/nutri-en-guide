
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// Create an axios instance for making API calls
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Updated to include the full server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 Unauthorized error, the token might be expired
    if (error.response && error.response.status === 401) {
      // Clear the stored user data
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const api = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to login');
    }
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/signup', { name, email, password });
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create account');
    }
  },
  
  // Profile
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await apiClient.get(`/profiles/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },
  
  createProfile: async (profile: UserProfile): Promise<UserProfile> => {
    try {
      const response = await apiClient.post('/profiles', profile);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create profile');
    }
  },
  
  updateProfile: async (profileId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put(`/profiles/${profileId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  },
  
  // This would use the geminiApi service
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    try {
      const response = await apiClient.get(`/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get recommendations');
    }
  }
};

export default api;
