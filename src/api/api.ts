
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// Create an axios instance with base URL pointing to our MongoDB Atlas backend
const apiClient = axios.create({
  baseURL: 'https://nutrienguide-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/signup', { name, email, password });
      
      // Save token to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Profile
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  createProfile: async (profile: UserProfile): Promise<UserProfile> => {
    try {
      const response = await apiClient.post('/profile', profile);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },
  
  updateProfile: async (profileId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await apiClient.put(`/profile/${profileId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  // Recommendations
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    try {
      const response = await apiClient.get(`/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
};

export default api;
