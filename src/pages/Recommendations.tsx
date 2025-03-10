
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DailyPlan, UserProfile } from '@/types';
import Header from '@/components/Header';
import RecommendationCard from '@/components/RecommendationCard';
import Button from '@/components/Button';
import api from '@/api/api';
import geminiApi from '@/api/geminiApi';

const Recommendations = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<DailyPlan | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Fetch user profile and recommendations
  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      
      setLoading(true);
      
      try {
        // Fetch user profile
        const userProfile = await api.getProfile(user._id);
        
        if (!userProfile) {
          // Redirect to profile if no profile exists
          toast({
            title: 'Profile Required',
            description: 'Please complete your profile to get recommendations',
          });
          return <Navigate to="/profile" replace />;
        }
        
        setProfile(userProfile);
        
        // Get meal recommendations based on profile
        const recommendations = await geminiApi.getMealPlan(userProfile);
        setMealPlan(recommendations);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recommendations. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?._id]);
  
  const handleRegeneratePlan = async () => {
    if (!profile) return;
    
    setRegenerating(true);
    
    try {
      // Get new meal recommendations
      const newRecommendations = await geminiApi.getMealPlan(profile);
      setMealPlan(newRecommendations);
      
      toast({
        title: 'Success',
        description: 'Your meal plan has been regenerated',
      });
    } catch (error) {
      console.error('Error regenerating meal plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate meal plan. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setRegenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-16 container-custom">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Your Personalized Meal Plan</h1>
          <p className="text-muted-foreground">
            Based on your profile, here are our recommended Indian meals for today
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-16">
            <svg 
              className="animate-spin h-12 w-12 text-primary" 
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
        ) : (
          <>
            {/* Nutrition summary */}
            {mealPlan && (
              <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Daily Nutrition Summary</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Calories</p>
                    <p className="text-2xl font-semibold">{mealPlan.totalNutrients.calories} kcal</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Protein</p>
                    <p className="text-2xl font-semibold">{mealPlan.totalNutrients.protein}g</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Carbs</p>
                    <p className="text-2xl font-semibold">{mealPlan.totalNutrients.carbs}g</p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Fat</p>
                    <p className="text-2xl font-semibold">{mealPlan.totalNutrients.fat}g</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={handleRegeneratePlan}
                    loading={regenerating}
                  >
                    Regenerate Meal Plan
                  </Button>
                </div>
              </div>
            )}
            
            {/* Meal cards */}
            {mealPlan && mealPlan.meals && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {mealPlan.meals.map((meal, index) => (
                  <RecommendationCard key={index} meal={meal} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
