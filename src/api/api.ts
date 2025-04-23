import axios from 'axios';
import { User, UserProfile, DailyPlan } from '../types';

// Initialize local storage with some default data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('profiles')) {
    localStorage.setItem('profiles', JSON.stringify([]));
  }
};

initializeLocalStorage();

const localStorageAPI = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      try {
        const usersJSON = localStorage.getItem('users') || '[]';
        const users: User[] = JSON.parse(usersJSON);
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }
        
        const token = `token-${Date.now()}`;
        localStorage.setItem('authToken', token);
        
        // Create a safe user object without password
        const safeUser: User = {
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
        
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        resolve(safeUser);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  signup: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      try {
        const usersJSON = localStorage.getItem('users') || '[]';
        const users: User[] = JSON.parse(usersJSON);
        
        if (users.find(u => u.email === email)) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        const newUser: User = {
          _id: `user-${Date.now()}`,
          name,
          email,
          password,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        const token = `token-${Date.now()}`;
        
        // Create a safe user object without password
        const safeUser: User = {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          token,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        
        resolve(safeUser);
      } catch (error) {
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
  
  getRecommendations: async (userId: string): Promise<DailyPlan> => {
    return new Promise((resolve) => {
      const mockRecommendation: DailyPlan = {
        date: new Date().toISOString(),
        meals: [
          {
            name: 'Healthy Breakfast',
            category: 'breakfast',
            mealType: 'breakfast',
            foods: [
              { name: 'Oatmeal with berries', quantity: '1 bowl', calories: 350 },
              { name: 'Greek yogurt', quantity: '1 cup', calories: 150 }
            ],
            nutrients: {
              calories: 500,
              protein: 15,
              carbs: 65,
              fat: 12
            },
            ingredients: ['oatmeal', 'berries', 'Greek yogurt']
          },
          // ... similar structure for lunch and dinner
        ],
        totalNutrients: {
          calories: 1670,
          protein: 95,
          carbs: 185,
          fat: 60
        }
      };
      resolve(mockRecommendation);
    });
  }
};

// Export the API interface
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
