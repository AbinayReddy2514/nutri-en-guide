
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// MongoDB Connection URL (in a real production app, this would be in an environment variable)
const MONGODB_URI = "mongodb+srv://abinayreddy2:reddy123@nguide.qffw4.mongodb.net/";

// Create an axios instance for making API calls
const apiClient = axios.create({
  baseURL: '/api',
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

const api = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to login');
    }
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/signup', { name, email, password });
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
