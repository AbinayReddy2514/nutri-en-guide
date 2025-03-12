
import { UserProfile, DailyPlan, Meal } from '../types';

// In a real application, this would make API calls to your Node.js backend
// which would then call the Gemini API with the API key

const API_KEY = "AIzaSyDPIVypr2_JkqESrI3Ljz4Mn1HVj_AUO1o";

class GeminiApi {
  private async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async getNutrientRequirements(profile: UserProfile): Promise<Record<string, number>> {
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
      const response = await this.generateContent(prompt);
      // Extract the JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                        response.match(/```\n([\s\S]*?)\n```/) || 
                        response.match(/(\{[\s\S]*?\})/);
      
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
      
      // If no JSON formatting, try to parse the whole response
      return JSON.parse(response);
    } catch (error) {
      console.error('Error parsing nutrient requirements:', error);
      // Return default values if there's an error
      return {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 70
      };
    }
  }

  async getMealPlan(profile: UserProfile): Promise<DailyPlan> {
    // First, get the nutrient requirements
    const nutrients = await this.getNutrientRequirements(profile);
    
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
      const response = await this.generateContent(prompt);
      // Extract the JSON from the response
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || 
                        response.match(/```\n([\s\S]*?)\n```/) || 
                        response.match(/(\{[\s\S]*?\})/);
      
      let mealPlan;
      if (jsonMatch && jsonMatch[1]) {
        mealPlan = JSON.parse(jsonMatch[1]);
      } else {
        // If no JSON formatting, try to parse the whole response
        mealPlan = JSON.parse(response);
      }
      
      return {
        date: new Date().toISOString().split('T')[0],
        ...mealPlan
      };
    } catch (error) {
      console.error('Error parsing meal plan:', error);
      
      // Return a fallback meal plan if there's an error
      return this.getFallbackMealPlan();
    }
  }

  async getRecipe(mealName: string): Promise<string[]> {
    const prompt = `
      Please provide detailed preparation steps for the Indian dish "${mealName}".
      Format as a numbered list of steps, each step should be clear and concise.
      Return ONLY the numbered steps, no introduction or additional text.
    `;

    try {
      const response = await this.generateContent(prompt);
      // Split the response into steps
      return response
        .split('\n')
        .filter(step => step.trim().length > 0)
        .map(step => {
          // Remove numbers and periods at the beginning of steps
          return step.replace(/^\d+\.\s*/, '').trim();
        });
    } catch (error) {
      console.error('Error getting recipe:', error);
      return ['Recipe steps could not be generated. Please try again later.'];
    }
  }

  private getFallbackMealPlan(): DailyPlan {
    const fallbackPlan: DailyPlan = {
      date: new Date().toISOString().split('T')[0],
      meals: [
        {
          name: "Masala Dosa with Coconut Chutney",
          category: "breakfast",
          mealType: "breakfast",
          foods: [
            { name: "Dosa", quantity: "2 pieces", calories: 200 },
            { name: "Coconut Chutney", quantity: "2 tbsp", calories: 150 }
          ],
          nutrients: {
            calories: 350,
            protein: 10,
            carbs: 45,
            fat: 15
          },
          ingredients: [
            "1 cup rice flour", 
            "1/4 cup urad dal", 
            "1/2 tsp fenugreek seeds", 
            "Salt to taste", 
            "1 boiled potato", 
            "1 onion", 
            "1/2 tsp mustard seeds", 
            "1/2 tsp cumin seeds", 
            "1 green chili", 
            "1 tbsp oil"
          ],
          preparationSteps: ["Ferment rice and dal batter", "Make potato filling", "Cook dosa on hot griddle", "Serve with coconut chutney"]
        },
        {
          name: "Dal Tadka with Brown Rice and Cucumber Raita",
          category: "lunch",
          mealType: "lunch",
          foods: [
            { name: "Dal Tadka", quantity: "1 bowl", calories: 200 },
            { name: "Brown Rice", quantity: "1/2 cup", calories: 150 },
            { name: "Cucumber Raita", quantity: "1/2 cup", calories: 100 }
          ],
          nutrients: {
            calories: 450,
            protein: 20,
            carbs: 60,
            fat: 15
          },
          ingredients: [
            "1 cup yellow moong dal", 
            "1/2 cup brown rice", 
            "1 tomato", 
            "1 onion", 
            "1 tsp cumin seeds", 
            "1/2 tsp turmeric", 
            "1 tsp coriander powder", 
            "1 cup yogurt", 
            "1 cucumber", 
            "1 tbsp oil"
          ],
          preparationSteps: ["Cook dal with turmeric", "Prepare tempering with cumin and spices", "Cook brown rice separately", "Mix cucumber with yogurt for raita"]
        },
        {
          name: "Roasted Chana with Fruit Chaat",
          category: "snack",
          mealType: "dinner", // Setting meal type to dinner as per Meal type requirement
          foods: [
            { name: "Roasted Chana", quantity: "1/2 cup", calories: 150 },
            { name: "Fruit Chaat", quantity: "1 bowl", calories: 100 }
          ],
          nutrients: {
            calories: 250,
            protein: 15,
            carbs: 30,
            fat: 8
          },
          ingredients: [
            "1/2 cup roasted chana", 
            "1 apple", 
            "1 banana", 
            "1/2 cup pomegranate seeds", 
            "1/2 tsp chaat masala", 
            "Lemon juice"
          ],
          preparationSteps: ["Mix fruits together", "Add roasted chana", "Sprinkle chaat masala and lemon juice"]
        },
        {
          name: "Palak Paneer with Roti",
          category: "dinner",
          mealType: "dinner",
          foods: [
            { name: "Palak Paneer", quantity: "1 bowl", calories: 300 },
            { name: "Roti", quantity: "2 pieces", calories: 120 }
          ],
          nutrients: {
            calories: 420,
            protein: 25,
            carbs: 35,
            fat: 20
          },
          ingredients: [
            "2 cups spinach", 
            "200g paneer", 
            "1 onion", 
            "2 tomatoes", 
            "1 tsp ginger-garlic paste", 
            "1/2 tsp garam masala", 
            "1/2 tsp cumin powder", 
            "1 cup whole wheat flour", 
            "2 tbsp oil", 
            "Salt to taste"
          ],
          preparationSteps: ["Blanch and puree spinach", "Saute onions and spices", "Add tomatoes and spinach puree", "Add paneer cubes", "Make whole wheat rotis"]
        }
      ],
      totalNutrients: {
        calories: 1470,
        protein: 70,
        carbs: 170,
        fat: 58
      }
    };
    
    return fallbackPlan;
  }
}

export default new GeminiApi();
