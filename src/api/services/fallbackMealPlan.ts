import { DailyPlan } from '@/types';

export function getFallbackMealPlan(): DailyPlan {
  return {
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
}
