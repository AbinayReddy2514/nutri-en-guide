
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// Create an axios instance for making API calls
const apiClient = axios.create({
  baseURL: 'https://nutrienguide-server.lovable.dev/api', // Updated server URL
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
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

const api = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/signup', { name, email, password });
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  },
  
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
