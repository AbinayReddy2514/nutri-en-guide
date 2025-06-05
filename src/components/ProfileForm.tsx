
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types';
import api from '@/api/api';
import Button from './Button';

const ProfileForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    age: 30,
    gender: 'male',
    height: 170,
    weight: 70,
    dietaryPreferences: [],
    healthGoals: [],
    activityLevel: 'moderate',
  });
  
  const [existingProfileId, setExistingProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  
  // Dietary preferences options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Non-vegetarian',
    'Gluten-free',
    'Dairy-free',
    'Low-carb',
    'Keto',
    'Paleo',
  ];
  
  // Health goals options
  const healthGoalOptions = [
    'Weight loss',
    'Weight gain',
    'Maintenance',
    'Muscle building',
    'Improve energy',
    'Better digestion',
    'Reduce inflammation',
    'Better sleep',
  ];
  
  // Activity level options
  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3 times/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5 times/week)' },
    { value: 'active', label: 'Active (daily exercise or intense exercise 3-4 times/week)' },
    { value: 'very active', label: 'Very Active (intense exercise 6-7 times/week)' },
  ];
  
  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;
      
      try {
        const userProfile = await api.getProfile(user._id);
        
        if (userProfile) {
          setProfile(userProfile);
          setExistingProfileId(userProfile._id || null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsFetchingProfile(false);
      }
    };
    
    fetchProfile();
  }, [user?._id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (name === 'age' || name === 'height' || name === 'weight') {
      setProfile(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCheckboxChange = (category: 'dietaryPreferences' | 'healthGoals', value: string) => {
    setProfile(prev => {
      const currentValues = [...prev[category]];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value],
        };
      }
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?._id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Include the user ID in the profile data
      const profileData = {
        ...profile,
        userId: user._id,
      };
      
      let result;
      
      if (existingProfileId) {
        // Update existing profile
        result = await api.updateProfile(existingProfileId, profileData);
      } else {
        // Create new profile
        result = await api.createProfile(profileData);
        setExistingProfileId(result._id || null);
      }
      
      toast({
        title: 'Success',
        description: 'Your profile has been saved',
      });
      
      // Navigate to recommendations
      navigate('/recommendations');
    } catch (error) {
      let message = 'An unknown error occurred';
      
      if (error instanceof Error) {
        message = error.message;
      }
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (isFetchingProfile) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg 
          className="animate-spin h-10 w-10 text-primary" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="8"
                max="120"
                value={profile.age}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                Activity Level
              </label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={profile.activityLevel}
                onChange={handleInputChange}
                className="input-field"
              >
                {activityLevelOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height (cm)
              </label>
              <input
                id="height"
                name="height"
                type="number"
                min="50"
                max="200"
                value={profile.height}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="20"
                max="280"
                value={profile.weight}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-lg font-medium">Dietary Preferences</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dietaryOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.dietaryPreferences.includes(option)}
                  onChange={() => handleCheckboxChange('dietaryPreferences', option)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="border-t border-border pt-6 space-y-4">
          <h3 className="text-lg font-medium">Health Goals</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healthGoalOptions.map(option => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.healthGoals.includes(option)}
                  onChange={() => handleCheckboxChange('healthGoals', option)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end pt-6 border-t border-border">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Save Profile & Get Recommendations
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
