
import { UserProfile } from '@/types';
import { generateContent, parseJsonResponse } from '../utils/geminiUtils';
import { DEFAULT_NUTRIENTS } from '../config/geminiConfig';

export async function getNutrientRequirements(profile: UserProfile): Promise<Record<string, number>> {
  const prompt = `
    Calculate the daily nutrient requirements for a person with the following characteristics:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Height: ${profile.height} cm
    - Weight: ${profile.weight} kg
    - Activity level: ${profile.activityLevel}
    - Health goals: ${profile.healthGoals.join(', ')}
    
    Please provide only JSON output with the following structure:
    {
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  `;

  try {
    const response = await generateContent(prompt);
    return parseJsonResponse(response);
  } catch (error) {
    console.error('Error parsing nutrient requirements:', error);
    return DEFAULT_NUTRIENTS;
  }
}

