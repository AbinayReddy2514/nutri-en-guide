
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// This is a mock API service that simulates backend responses
// In a real application, replace this with actual API calls to your MongoDB backend

// Mock data storage
let users: User[] = [];
let profiles: UserProfile[] = [];
let tokens: Record<string, string> = {};

const api = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    // In a real app, this would be a backend call
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, you would verify the password with bcrypt
    const token = `mock-jwt-token-${Date.now()}`;
    tokens[user._id!] = token;
    
    return { ...user, token };
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    // In a real app, this would be a backend call
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const newUser: User = {
      _id: `user-${Date.now()}`,
      name,
      email,
    };
    
    users.push(newUser);
    
    const token = `mock-jwt-token-${Date.now()}`;
    tokens[newUser._id!] = token;
    
    return { ...newUser, token };
  },
  
  // Profile
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const profile = profiles.find(p => p.userId === userId);
    return profile || null;
  },
  
  createProfile: async (profile: UserProfile): Promise<UserProfile> => {
    const newProfile = {
      ...profile,
      _id: `profile-${Date.now()}`,
    };
    
    profiles.push(newProfile);
    
    return newProfile;
  },
  
  updateProfile: async (profileId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    const index = profiles.findIndex(p => p._id === profileId);
    
    if (index === -1) {
      throw new Error('Profile not found');
    }
    
    profiles[index] = { ...profiles[index], ...data };
    
    return profiles[index];
  },
  
  // This would use the geminiApi service in a real application
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    // Simulate fetching data based on the user's profile
    // In a real app, this would use the Gemini API
    const mockPlan: DailyPlan = {
      date: new Date().toISOString().split('T')[0],
      meals: [],
      totalNutrients: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    };
    
    return mockPlan;
  }
};

export default api;
