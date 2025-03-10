
export interface User {
  _id?: string;
  name: string;
  email: string;
  token?: string;
}

export interface UserProfile {
  _id?: string;
  userId?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  dietaryPreferences: string[];
  healthGoals: string[];
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
}

export interface Meal {
  name: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: string[];
  preparationSteps?: string[];
  image?: string;
}

export interface DailyPlan {
  date: string;
  meals: Meal[];
  totalNutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
