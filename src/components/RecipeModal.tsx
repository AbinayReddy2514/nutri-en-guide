import React, { useState, useEffect } from 'react';
import { Meal } from '@/types';
import Button from './Button';
import { X } from 'lucide-react';
import geminiApi from '@/api/geminiApi';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal: Meal;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, meal }) => {
  const [recipeSteps, setRecipeSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          // If meal already has preparation steps, use those
          if (meal.preparationSteps && meal.preparationSteps.length > 0) {
            setRecipeSteps(meal.preparationSteps);
          } else {
            // Otherwise fetch from API
            const steps = await geminiApi.getRecipe(meal.name);
            setRecipeSteps(steps);
          }
        } catch (error) {
          console.error('Error fetching recipe:', error);
          setRecipeSteps(['Could not load recipe steps. Please try again later.']);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRecipe();
    }
  }, [isOpen, meal]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-auto bg-white rounded-xl shadow-lg animate-fade-up">
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{meal.name}</h2>
          <p className="text-sm text-muted-foreground mb-6">Recipe Instructions</p>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <svg 
                className="animate-spin h-8 w-8 text-primary" 
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
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Ingredients:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Preparation:</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  {recipeSteps.map((step, index) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>
            </>
          )}
          
          <div className="mt-8 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
