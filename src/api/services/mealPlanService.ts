
import { UserProfile, DailyPlan } from '@/types';
import { generateContent, parseJsonResponse } from '../utils/geminiUtils';
import { getNutrientRequirements } from './nutrientService';
import { getFallbackMealPlan } from './fallbackMealPlan';

export async function getMealPlan(profile: UserProfile): Promise<DailyPlan> {
  const nutrients = await getNutrientRequirements(profile);
  const dietaryPreferences = profile.dietaryPreferences.join(', ');
  
  const prompt = `
    Generate an Indian meal plan for one day for a person with the following details:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Height: ${profile.height} cm
    - Weight: ${profile.weight} kg
    - Activity level: ${profile.activityLevel}
    - Health goals: ${profile.healthGoals.join(', ')}
    - Dietary preferences: ${dietaryPreferences}
    
    Daily nutrient targets:
    - Calories: ${nutrients.calories} kcal
    - Protein: ${nutrients.protein} g
    - Carbohydrates: ${nutrients.carbs} g
    - Fat: ${nutrients.fat} g
    
    Please provide meals for breakfast, lunch, evening snack, and dinner.
    Each meal should include:
    1. Name of the dish
    2. Nutrient content (calories, protein, carbs, fat)
    3. Ingredients with quantities
    4. Brief preparation steps
    
    Please provide only JSON output with the following structure:
    {
      "meals": [
        {
          "name": "string",
          "category": "breakfast/lunch/snack/dinner",
          "nutrients": {
            "calories": number,
            "protein": number,
            "carbs": number,
            "fat": number
          },
          "ingredients": ["string"],
          "preparationSteps": ["string"]
        }
      ],
      "totalNutrients": {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      }
    }
  `;

  try {
    const response = await generateContent(prompt);
    const mealPlan = parseJsonResponse(response);
    
    return {
      date: new Date().toISOString().split('T')[0],
      ...mealPlan
    };
  } catch (error) {
    console.error('Error parsing meal plan:', error);
    return getFallbackMealPlan();
  }
}

