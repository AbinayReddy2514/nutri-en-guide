
import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// Create a local storage API that mimics the MongoDB API
const localStorageAPI = {
  // Authentication
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      try {
        // Get all users from local storage
        const usersJSON = localStorage.getItem('users') || '[]';
        const users: User[] = JSON.parse(usersJSON);
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }
        
        // Create a token (simple implementation)
        const token = `token-${Date.now()}`;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Store user data (without password)
        const userData = { ...user };
        delete userData.password;
        localStorage.setItem('user', JSON.stringify(userData));
        
        resolve(userData);
      } catch (error) {
        console.error('Login error:', error);
        reject(error);
      }
    });
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      try {
        // Get all users from local storage
        const usersJSON = localStorage.getItem('users') || '[]';
        const users: User[] = JSON.parse(usersJSON);
        
        // Check if user already exists
        const userExists = users.find(u => u.email === email);
        if (userExists) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        // Create new user
        const newUser: User = {
          _id: `user-${Date.now()}`,
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create a token
        const token = `token-${Date.now()}`;
        
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        
        // Store user data (without password)
        const userData = { ...newUser };
        delete userData.password;
        localStorage.setItem('user', JSON.stringify(userData));
        
        resolve(userData);
      } catch (error) {
        console.error('Signup error:', error);
        reject(error);
      }
    });
  },
  
  // Profile
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    return new Promise((resolve) => {
      try {
        // Get profiles from local storage
        const profilesJSON = localStorage.getItem('profiles') || '[]';
        const profiles: UserProfile[] = JSON.parse(profilesJSON);
        
        // Find profile for user
        const profile = profiles.find(p => p.userId === userId);
        
        resolve(profile || null);
      } catch (error) {
        console.error('Get profile error:', error);
        resolve(null);
      }
    });
  },
  
  createProfile: async (profile: UserProfile): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      try {
        // Get profiles from local storage
        const profilesJSON = localStorage.getItem('profiles') || '[]';
        const profiles: UserProfile[] = JSON.parse(profilesJSON);
        
        // Add ID to profile
        const newProfile = {
          ...profile,
          _id: `profile-${Date.now()}`
        };
        
        // Add to profiles array
        profiles.push(newProfile);
        
        // Save to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));
        
        resolve(newProfile);
      } catch (error) {
        console.error('Create profile error:', error);
        reject(error);
      }
    });
  },
  
  updateProfile: async (profileId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      try {
        // Get profiles from local storage
        const profilesJSON = localStorage.getItem('profiles') || '[]';
        const profiles: UserProfile[] = JSON.parse(profilesJSON);
        
        // Find index of profile
        const profileIndex = profiles.findIndex(p => p._id === profileId);
        
        if (profileIndex === -1) {
          reject(new Error('Profile not found'));
          return;
        }
        
        // Update profile
        profiles[profileIndex] = {
          ...profiles[profileIndex],
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));
        
        resolve(profiles[profileIndex]);
      } catch (error) {
        console.error('Update profile error:', error);
        reject(error);
      }
    });
  },
  
  // Recommendations
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    // Mock recommendations data
    return new Promise((resolve) => {
      // Sample recommendation data
      const mockRecommendation: DailyPlan = {
        userId,
        date: new Date().toISOString(),
        meals: [
          {
            mealType: 'breakfast',
            foods: [
              { name: 'Oatmeal with berries', quantity: '1 bowl', calories: 350 },
              { name: 'Greek yogurt', quantity: '1 cup', calories: 150 }
            ]
          },
          {
            mealType: 'lunch',
            foods: [
              { name: 'Grilled chicken salad', quantity: '1 plate', calories: 450 },
              { name: 'Whole grain bread', quantity: '1 slice', calories: 120 }
            ]
          },
          {
            mealType: 'dinner',
            foods: [
              { name: 'Baked salmon', quantity: '1 fillet', calories: 350 },
              { name: 'Steamed vegetables', quantity: '1 cup', calories: 100 },
              { name: 'Brown rice', quantity: '1/2 cup', calories: 150 }
            ]
          }
        ],
        nutrients: {
          calories: 1670,
          protein: 95,
          carbs: 185,
          fat: 60,
          fiber: 25
        }
      };
      resolve(mockRecommendation);
    });
  }
};

// Create a fallback API that uses localStorage
const api = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      return await localStorageAPI.login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    try {
      return await localStorageAPI.signup(name, email, password);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  getProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      return await localStorageAPI.getProfile(userId);
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },
  
  createProfile: async (profile: UserProfile): Promise<UserProfile> => {
    try {
      return await localStorageAPI.createProfile(profile);
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },
  
  updateProfile: async (profileId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      return await localStorageAPI.updateProfile(profileId, data);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    try {
      return await localStorageAPI.getRecommendations(userId);
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }
};

export default api;
