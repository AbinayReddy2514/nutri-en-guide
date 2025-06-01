
import React, { useState } from 'react';
import { Meal } from '@/types';
import Button from './Button';
import RecipeModal from './RecipeModal';

interface RecommendationCardProps {
  meal: Meal;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ meal }) => {
  const [showRecipe, setShowRecipe] = useState(false);
  
  // Map meal categories to user-friendly names and icons
  const categoryInfo = {
    breakfast: {
      label: 'Breakfast',
      icon: '☀️',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    lunch: {
      label: 'Lunch',
      icon: '🍲',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    snack: {
      label: 'Evening Snack',
      icon: '🍌',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    dinner: {
      label: 'Dinner',
      icon: '🌙',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
  };
  
  const { label, bgColor, borderColor } = categoryInfo[meal.category];
  
  return (
    <>
      <div className={`rounded-xl ${bgColor} border ${borderColor} overflow-hidden transition-all duration-300 hover:shadow-md card-hover`}>
        <div className="p-4 sm:p-6">
          {/* Meal category badge */}
          <span className="inline-block px-3 py-1 bg-white/70 backdrop-blur-sm text-xs font-medium rounded-full mb-3">
            {label}
          </span>
          
          {/* Meal name */}
          <h3 className="text-xl font-semibold mb-3">{meal.name}</h3>
           {/* YouTube search button */}
  <button
    onClick={() => {
      const query = encodeURIComponent(meal.name);
      const youtubeUrl = `https://www.youtube.com/results?search_query=${query}`;
      window.open(youtubeUrl, "_blank");
    }}
    className="px-3 py-1 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-100 transition"
    type="button"
  >
    YouTube
  </button>
          
          {/* Nutrient info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground">Calories</p>
              <p className="font-medium">{meal.nutrients.calories} kcal</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground">Protein</p>
              <p className="font-medium">{meal.nutrients.protein}g</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground">Carbs</p>
              <p className="font-medium">{meal.nutrients.carbs}g</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-muted-foreground">Fat</p>
              <p className="font-medium">{meal.nutrients.fat}g</p>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Ingredients:</h4>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.map((ingredient, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 bg-white/70 backdrop-blur-sm text-xs rounded-md"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
          
          {/* Recipe button */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowRecipe(true)}
              className="w-full justify-center"
            >
              View Recipe
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recipe modal */}
      <RecipeModal 
        isOpen={showRecipe} 
        onClose={() => setShowRecipe(false)} 
        meal={meal}
      />
    </>
  );
};

export default RecommendationCard;
