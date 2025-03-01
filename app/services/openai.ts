import OpenAI from 'openai';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { Recipe, MealPlan, ChatMessage, RecipeGenerationRequest, MealPlanRequest, RecipeModificationRequest, NutritionalInfo } from '../types';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock data for recipes
const mockRecipeData = [
  {
    id: "recipe-pasta-001",
    title: "Garlic Butter Pasta with Herbs",
    ingredients: [
      "8 oz pasta (spaghetti or fettuccine)",
      "4 tbsp butter",
      "4 cloves garlic, minced",
      "1/4 cup fresh parsley, chopped",
      "2 tbsp fresh basil, chopped",
      "1/4 cup grated Parmesan cheese",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ],
    instructions: [
      "Cook pasta according to package instructions until al dente. Reserve 1/2 cup pasta water before draining.",
      "In a large skillet, melt butter over medium heat.",
      "Add minced garlic and sauté for 1-2 minutes until fragrant but not browned.",
      "Add drained pasta to the skillet and toss to coat with the garlic butter.",
      "Add herbs and Parmesan cheese, tossing to combine. Add pasta water as needed to create a silky sauce.",
      "Season with salt, pepper, and red pepper flakes if desired.",
      "Serve immediately with additional Parmesan cheese on top."
    ],
    nutritionalInfo: {
      calories: 420,
      protein: 12,
      carbs: 48,
      fat: 22
    },
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    servings: 2,
    difficulty: "Easy",
    tags: ["Italian", "Vegetarian", "Quick"]
  },
  {
    id: "recipe-salad-002",
    title: "Mediterranean Chickpea Salad",
    ingredients: [
      "1 can (15 oz) chickpeas, drained and rinsed",
      "1 cucumber, diced",
      "1 cup cherry tomatoes, halved",
      "1/2 red onion, finely diced",
      "1/2 cup feta cheese, crumbled",
      "1/4 cup kalamata olives, pitted and sliced",
      "2 tbsp fresh lemon juice",
      "3 tbsp olive oil",
      "1 tsp dried oregano",
      "Salt and pepper to taste",
      "Fresh parsley for garnish"
    ],
    instructions: [
      "In a large bowl, combine chickpeas, cucumber, tomatoes, red onion, feta cheese, and olives.",
      "In a small bowl, whisk together lemon juice, olive oil, oregano, salt, and pepper.",
      "Pour the dressing over the salad and toss gently to combine.",
      "Refrigerate for at least 30 minutes to allow flavors to meld.",
      "Garnish with fresh parsley before serving."
    ],
    nutritionalInfo: {
      calories: 350,
      protein: 15,
      carbs: 30,
      fat: 18
    },
    prepTime: "15 minutes",
    cookTime: "0 minutes",
    servings: 4,
    difficulty: "Easy",
    tags: ["Mediterranean", "Vegetarian", "Salad"]
  },
  {
    id: "recipe-salmon-003",
    title: "Honey Soy Glazed Salmon",
    ingredients: [
      "4 salmon fillets (6 oz each)",
      "3 tbsp soy sauce",
      "2 tbsp honey",
      "1 tbsp rice vinegar",
      "2 cloves garlic, minced",
      "1 tsp grated fresh ginger",
      "1 tbsp olive oil",
      "Sesame seeds and sliced green onions for garnish"
    ],
    instructions: [
      "In a small bowl, whisk together soy sauce, honey, rice vinegar, garlic, and ginger.",
      "Place salmon fillets in a shallow dish and pour marinade over them. Let marinate for 15-30 minutes.",
      "Heat olive oil in a large skillet over medium-high heat.",
      "Remove salmon from marinade (reserve the marinade) and place in the hot skillet, skin side down.",
      "Cook for 4-5 minutes, then flip and cook for another 3-4 minutes until salmon is cooked through.",
      "Pour the reserved marinade into the skillet and let it simmer and reduce for 1-2 minutes to create a glaze.",
      "Spoon the glaze over the salmon and garnish with sesame seeds and green onions."
    ],
    nutritionalInfo: {
      calories: 380,
      protein: 34,
      carbs: 12,
      fat: 22
    },
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    servings: 4,
    difficulty: "Medium",
    tags: ["Asian", "Seafood", "High Protein"]
  }
];

// Define the ModifyRecipeRequest type
interface ModifyRecipeRequest {
  dietaryPreference?: string;
  servingSize?: number;
}

// Generate recipes based on ingredients and preferences
export async function generateRecipes(request: RecipeGenerationRequest): Promise<Recipe[]> {
  try {
    const { ingredients = [], dietaryPreferences = [], mealType = '', excludeIngredients = [] } = request;
    
    // Try to use Gemini API first
    try {
      console.log('Generating recipes with Gemini API:', { ingredients, dietaryPreferences, mealType, excludeIngredients });
      
      const prompt = `Generate 3 recipes using these ingredients: ${ingredients.join(', ')}.
      ${dietaryPreferences.length > 0 ? `Dietary preferences: ${dietaryPreferences.join(', ')}.` : ''}
      ${mealType ? `Meal type: ${mealType}.` : ''}
      ${excludeIngredients.length > 0 ? `Exclude these ingredients: ${excludeIngredients.join(', ')}.` : ''}
      
      For each recipe, include:
      - Title
      - List of ingredients with measurements
      - Step-by-step instructions
      - Nutritional information (calories, protein, carbs, fat)
      - Preparation time
      - Cooking time
      - Number of servings
      
      IMPORTANT: For nutritional information, provide ONLY numeric values WITHOUT any units. For example, use "protein": 5 instead of "protein": "5g".
      DO NOT include units like "g" or "mg" with the nutritional values.
      DO NOT use quotes around numeric values in the nutritional information.
      
      Format the response as a JSON array of recipe objects. Ensure the JSON is valid and properly formatted.`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error("No content returned from Gemini");
      
      console.log('Gemini API response:', content);
      
      // Extract JSON from the response
      let jsonContent = '';
      
      // Try different regex patterns to extract JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/\[[\s\S]*\]/) ||
                        content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        // If we matched with the first two patterns, use the capture group
        if (jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        } else {
          // Otherwise use the full match (for the third pattern)
          jsonContent = jsonMatch[0];
        }
      } else {
        // If no JSON-like structure was found, throw an error
        throw new Error("Could not extract JSON from Gemini response");
      }
      
      // Clean up the JSON content
      jsonContent = jsonContent.trim();
      
      // Fix common JSON formatting issues
      // Replace single quotes with double quotes
      jsonContent = jsonContent.replace(/'/g, '"');
      
      // Fix trailing commas in objects and arrays
      jsonContent = jsonContent.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix escaped quotes in strings (e.g., "ensure it\"s vegan" -> "ensure it's vegan")
      jsonContent = jsonContent.replace(/\\"/g, "'");
      
      // Fix string concatenation in JSON (e.g., "Cauliflower " + "Rice" -> "Cauliflower Rice")
      jsonContent = jsonContent.replace(/"([^"]*)" \+ "([^"]*)"/g, '"$1$2"');
      
      // Fix nutritional values with units (e.g., "5g" -> 5)
      // First, handle values in quotes with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*"(\d+)g?"/g, '"$1": $2');
      
      // Then, handle values without quotes but with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*(\d+)g/g, '"$1": $2');
      
      console.log('Cleaned JSON content:', jsonContent);
      
      try {
        // Try to parse as a direct array first
        let recipes;
        try {
          recipes = JSON.parse(jsonContent);
          // If it's not an array, check if it has a recipes property
          if (!Array.isArray(recipes)) {
            recipes = recipes.recipes || [];
          }
        } catch (e) {
          // If that fails, try to parse as an object with a recipes property
          const parsedContent = JSON.parse(jsonContent);
          recipes = parsedContent.recipes || [];
        }
        
        // Format and return the recipes
        return recipes.map((recipe: any, index: number) => ({
          id: `generated-recipe-${Date.now().toString().slice(-6)}-${index + 1}`,
          title: recipe.title,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
          nutritionalInfo: convertNutritionFormat(recipe.nutritionalInfo || recipe.nutritionalInformation || recipe.nutrition),
          prepTime: recipe.prepTime || recipe.preparationTime || "0 minutes",
          cookTime: recipe.cookTime || recipe.cookingTime || "0 minutes",
          servings: recipe.servings || recipe.numberOfServings || 4,
          difficulty: recipe.difficulty || recipe.difficultyLevel || "Medium",
          tags: recipe.tags || [],
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
        }));
      } catch (jsonError) {
        console.error('Error parsing JSON from Gemini response:', jsonError);
        console.error('JSON content that failed to parse:', jsonContent);
        throw new Error('Invalid JSON format in Gemini response');
      }
    } catch (apiError) {
      console.error('Error with Gemini API, falling back to mock data:', apiError);
      
      // Fall back to mock data if API fails
      let filteredRecipes = [...mockRecipeData];
      
      if (dietaryPreferences.includes('Vegetarian')) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.tags.includes('Vegetarian') || !recipe.tags.includes('Seafood'));
      }
      
      if (dietaryPreferences.includes('Vegan')) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          !recipe.ingredients.some(i => 
            i.toLowerCase().includes('cheese') || 
            i.toLowerCase().includes('milk') || 
            i.toLowerCase().includes('butter') ||
            i.toLowerCase().includes('salmon')));
      }
      
      // Add IDs to each recipe
      return filteredRecipes.map((recipe, index) => ({
        ...recipe,
        id: `fallback-recipe-${Date.now().toString().slice(-6)}-${index + 1}`,
        imageUrl: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop`
      }));
    }
  } catch (error) {
    console.error('Error generating recipes:', error);
    throw error;
  }
}

// Mock meal plan data
const createMockMealPlan = (daysCount: number, dietaryPreferences: string[] = []): MealPlan => {
  const days = [];
  
  for (let i = 1; i <= daysCount; i++) {
    days.push({
      day: `Day ${i}`,
      breakfast: {
        id: `breakfast-day${i}-001`,
        title: "Avocado Toast with Poached Eggs",
        ingredients: [
          "2 slices whole grain bread",
          "1 ripe avocado",
          "2 eggs",
          "Salt and pepper to taste",
          "Red pepper flakes (optional)",
          "1 tbsp olive oil"
        ],
        instructions: [
          "Toast the bread until golden brown.",
          "Mash the avocado and spread on toast.",
          "Poach the eggs and place on top of avocado.",
          "Season with salt, pepper, and red pepper flakes."
        ],
        nutritionalInfo: {
          calories: 350,
          protein: 15,
          carbs: 30,
          fat: 20
        },
        prepTime: "5 minutes",
        cookTime: "10 minutes",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
      },
      lunch: {
        id: `lunch-day${i}-001`,
        title: "Quinoa Salad with Roasted Vegetables",
        ingredients: [
          "1 cup quinoa, cooked",
          "1 bell pepper, diced and roasted",
          "1 zucchini, diced and roasted",
          "1/2 red onion, diced and roasted",
          "1/4 cup feta cheese (omit for vegan)",
          "2 tbsp olive oil",
          "1 tbsp lemon juice",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Combine cooked quinoa and roasted vegetables in a bowl.",
          "Add feta cheese if using.",
          "Whisk together olive oil, lemon juice, salt, and pepper.",
          "Pour dressing over salad and toss to combine."
        ],
        nutritionalInfo: {
          calories: 380,
          protein: 12,
          carbs: 45,
          fat: 18
        },
        prepTime: "15 minutes",
        cookTime: "20 minutes",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
      },
      dinner: {
        id: `dinner-day${i}-001`,
        title: "Baked Salmon with Roasted Asparagus",
        ingredients: [
          "6 oz salmon fillet",
          "1 bunch asparagus, trimmed",
          "2 tbsp olive oil",
          "1 lemon, sliced",
          "2 cloves garlic, minced",
          "Salt and pepper to taste",
          "Fresh dill for garnish"
        ],
        instructions: [
          "Preheat oven to 400°F (200°C).",
          "Place salmon on a baking sheet lined with parchment paper.",
          "Arrange asparagus around salmon.",
          "Drizzle everything with olive oil and season with salt, pepper, and garlic.",
          "Top salmon with lemon slices.",
          "Bake for 12-15 minutes until salmon is cooked through.",
          "Garnish with fresh dill before serving."
        ],
        nutritionalInfo: {
          calories: 420,
          protein: 35,
          carbs: 10,
          fat: 25
        },
        prepTime: "10 minutes",
        cookTime: "15 minutes",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
      },
      snacks: [
        {
          id: `snack-day${i}-001`,
          title: "Greek Yogurt with Berries",
          ingredients: [
            "1 cup Greek yogurt",
            "1/2 cup mixed berries",
            "1 tbsp honey",
            "1 tbsp chopped nuts"
          ],
          instructions: [
            "Place yogurt in a bowl.",
            "Top with berries, honey, and nuts."
          ],
          nutritionalInfo: {
            calories: 200,
            protein: 15,
            carbs: 25,
            fat: 5
          },
          prepTime: "5 minutes",
          cookTime: "0 minutes",
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
        }
      ]
    });
  }
  
  return {
    id: `meal-plan-${daysCount}-day-${Date.now().toString().slice(-6)}`,
    name: `${daysCount}-Day Meal Plan ${dietaryPreferences.length > 0 ? `(${dietaryPreferences.join(', ')})` : ''}`,
    days,
    calorieGoal: 1800,
    dietaryPreferences
  };
};

// Generate a meal plan
export async function generateMealPlan(request: MealPlanRequest): Promise<MealPlan> {
  try {
    const { calorieGoal, dietaryPreferences = [], daysCount, excludeIngredients = [] } = request;
    
    // Try to use Gemini API first
    try {
      console.log('Generating meal plan with Gemini API:', { calorieGoal, dietaryPreferences, daysCount, excludeIngredients });
      
      const prompt = `Generate a ${daysCount}-day meal plan.
      ${calorieGoal ? `Daily calorie goal: ${calorieGoal} calories.` : ''}
      ${dietaryPreferences.length > 0 ? `Dietary preferences: ${dietaryPreferences.join(', ')}.` : ''}
      ${excludeIngredients.length > 0 ? `Exclude these ingredients: ${excludeIngredients.join(', ')}.` : ''}
      
      For each day, provide:
      1. Breakfast recipe
      2. Lunch recipe
      3. Dinner recipe
      4. Optional snack
      
      For each recipe, include:
      - Title
      - Ingredients list with measurements
      - Brief instructions
      - Nutritional information (calories, protein, carbs, fat)
      
      IMPORTANT: For nutritional information, provide ONLY numeric values WITHOUT any units. For example, use "protein": 5 instead of "protein": "5g".
      DO NOT include units like "g" or "mg" with the nutritional values.
      DO NOT use quotes around numeric values in the nutritional information.
      
      Format the response as a JSON object with a 'mealPlan' property containing an array of days. Ensure the JSON is valid and properly formatted.`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error("No content returned from Gemini");
      
      console.log('Gemini API response:', content);
      
      // Extract JSON from the response
      let jsonContent = '';
      
      // Try different regex patterns to extract JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        // If we matched with the first two patterns, use the capture group
        if (jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        } else {
          // Otherwise use the full match (for the third pattern)
          jsonContent = jsonMatch[0];
        }
      } else {
        // If no JSON-like structure was found, throw an error
        throw new Error("Could not extract JSON from Gemini response");
      }
      
      // Clean up the JSON content
      jsonContent = jsonContent.trim();
      
      // Fix common JSON formatting issues
      // Replace single quotes with double quotes
      jsonContent = jsonContent.replace(/'/g, '"');
      
      // Fix trailing commas in objects and arrays
      jsonContent = jsonContent.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix escaped quotes in strings (e.g., "ensure it\"s vegan" -> "ensure it's vegan")
      jsonContent = jsonContent.replace(/\\"/g, "'");
      
      // Fix string concatenation in JSON (e.g., "Cauliflower " + "Rice" -> "Cauliflower Rice")
      jsonContent = jsonContent.replace(/"([^"]*)" \+ "([^"]*)"/g, '"$1$2"');
      
      // Fix nutritional values with units (e.g., "5g" -> 5)
      // First, handle values in quotes with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*"(\d+)g?"/g, '"$1": $2');
      
      // Then, handle values without quotes but with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*(\d+)g/g, '"$1": $2');
      
      console.log('Cleaned JSON content:', jsonContent);
      
      try {
        const parsedContent = JSON.parse(jsonContent);
        const mealPlanData = parsedContent.mealPlan || [];
        
        // Generate a timestamp suffix for unique IDs
        const timestamp = Date.now().toString().slice(-6);
        
        // Format the meal plan
        const mealPlan: MealPlan = {
          id: `meal-plan-${timestamp}`,
          name: `${daysCount}-Day Meal Plan ${dietaryPreferences.length > 0 ? `(${dietaryPreferences.join(', ')})` : ''}`,
          days: mealPlanData.map((day: any, dayIndex: number) => ({
            day: `Day ${dayIndex + 1}`,
            breakfast: day.breakfast ? { 
              ...day.breakfast, 
              id: `breakfast-${timestamp}-day${dayIndex + 1}`, 
              imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
              nutritionalInfo: convertNutritionFormat(day.breakfast.nutrition || day.breakfast.nutritionalInfo || day.breakfast.nutritionalInformation)
            } : undefined,
            lunch: day.lunch ? { 
              ...day.lunch, 
              id: `lunch-${timestamp}-day${dayIndex + 1}`, 
              imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
              nutritionalInfo: convertNutritionFormat(day.lunch.nutrition || day.lunch.nutritionalInfo || day.lunch.nutritionalInformation)
            } : undefined,
            dinner: day.dinner ? { 
              ...day.dinner, 
              id: `dinner-${timestamp}-day${dayIndex + 1}`, 
              imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
              nutritionalInfo: convertNutritionFormat(day.dinner.nutrition || day.dinner.nutritionalInfo || day.dinner.nutritionalInformation)
            } : undefined,
            snacks: day.snack ? [{ 
              ...day.snack, 
              id: `snack-${timestamp}-day${dayIndex + 1}`, 
              imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
              nutritionalInfo: convertNutritionFormat(day.snack.nutrition || day.snack.nutritionalInfo || day.snack.nutritionalInformation)
            }] : [],
          })),
          calorieGoal,
          dietaryPreferences,
        };
        
        return mealPlan;
      } catch (jsonError) {
        console.error('Error parsing JSON from Gemini response:', jsonError);
        console.error('JSON content that failed to parse:', jsonContent);
        throw new Error('Invalid JSON format in Gemini response');
      }
    } catch (apiError) {
      console.error('Error with Gemini API, falling back to mock data:', apiError);
      
      // Fall back to mock data if API fails
      return createMockMealPlan(daysCount, dietaryPreferences);
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw error;
  }
}

// Helper function to convert nutrition format
function convertNutritionFormat(nutrition: any): NutritionalInfo {
  if (!nutrition) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
  }
  
  // Convert string values with units to numbers
  const convertToNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Extract numeric part from strings like "5g"
      const match = value.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    }
    return 0;
  };
  
  return {
    calories: convertToNumber(nutrition.calories),
    protein: convertToNumber(nutrition.protein),
    carbs: convertToNumber(nutrition.carbs),
    fat: convertToNumber(nutrition.fat)
  };
}

// Modify a recipe
export async function modifyRecipe(recipeId: string, request: ModifyRecipeRequest): Promise<Recipe> {
  try {
    const { dietaryPreference, servingSize } = request;
    
    // Try to use Gemini API first
    try {
      console.log('Modifying recipe with Gemini API:', { recipeId, dietaryPreference, servingSize });
      
      // Find the original recipe in mock data (in a real app, this would come from a database)
      const originalRecipe = mockRecipeData.find(recipe => recipe.id === recipeId) || mockRecipeData[0];
      
      const prompt = `Modify this recipe:
      Title: ${originalRecipe.title}
      Ingredients: ${originalRecipe.ingredients.join(', ')}
      Instructions: ${originalRecipe.instructions.join(' ')}
      
      ${dietaryPreference ? `Make it ${dietaryPreference}.` : ''}
      ${servingSize ? `Adjust for ${servingSize} servings.` : ''}
      
      IMPORTANT: For nutritional information, provide ONLY numeric values WITHOUT any units. For example, use "protein": 5 instead of "protein": "5g".
      DO NOT include units like "g" or "mg" with the nutritional values.
      DO NOT use quotes around numeric values in the nutritional information.
      
      Return the modified recipe as a JSON object with the same structure as the original. Ensure the JSON is valid and properly formatted.`;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error("No content returned from Gemini");
      
      console.log('Gemini API response:', content);
      
      // Extract JSON from the response
      let jsonContent = '';
      
      // Try different regex patterns to extract JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        // If we matched with the first two patterns, use the capture group
        if (jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        } else {
          // Otherwise use the full match (for the third pattern)
          jsonContent = jsonMatch[0];
        }
      } else {
        // If no JSON-like structure was found, throw an error
        throw new Error("Could not extract JSON from Gemini response");
      }
      
      // Clean up the JSON content
      jsonContent = jsonContent.trim();
      
      // Fix common JSON formatting issues
      // Replace single quotes with double quotes
      jsonContent = jsonContent.replace(/'/g, '"');
      
      // Fix trailing commas in objects and arrays
      jsonContent = jsonContent.replace(/,(\s*[\]}])/g, '$1');
      
      // Fix escaped quotes in strings (e.g., "ensure it\"s vegan" -> "ensure it's vegan")
      jsonContent = jsonContent.replace(/\\"/g, "'");
      
      // Fix string concatenation in JSON (e.g., "Cauliflower " + "Rice" -> "Cauliflower Rice")
      jsonContent = jsonContent.replace(/"([^"]*)" \+ "([^"]*)"/g, '"$1$2"');
      
      // Fix nutritional values with units (e.g., "5g" -> 5)
      // First, handle values in quotes with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*"(\d+)g?"/g, '"$1": $2');
      
      // Then, handle values without quotes but with units
      jsonContent = jsonContent.replace(/"(calories|protein|carbs|fat)":\s*(\d+)g/g, '"$1": $2');
      
      console.log('Cleaned JSON content:', jsonContent);
      
      try {
        const modifiedRecipe = JSON.parse(jsonContent);
        
        // Create a modified ID that preserves the original ID but indicates it's a modification
        const modifiedId = `${recipeId}-modified-${Date.now().toString().slice(-6)}`;
        
        // Ensure the recipe has the required fields for the Recipe type
        return {
          id: modifiedId, // Use a modified ID that's based on the original
          title: modifiedRecipe.title || originalRecipe.title,
          ingredients: modifiedRecipe.ingredients || originalRecipe.ingredients,
          instructions: modifiedRecipe.instructions || originalRecipe.instructions,
          nutritionalInfo: convertNutritionFormat(modifiedRecipe.nutritionalInfo || modifiedRecipe.nutritionalInformation || modifiedRecipe.nutrition || originalRecipe.nutritionalInfo),
          prepTime: modifiedRecipe.prepTime || modifiedRecipe.preparationTime || originalRecipe.prepTime,
          cookTime: modifiedRecipe.cookTime || modifiedRecipe.cookingTime || originalRecipe.cookTime,
          servings: modifiedRecipe.servings || servingSize || originalRecipe.servings,
          difficulty: modifiedRecipe.difficulty || modifiedRecipe.difficultyLevel || originalRecipe.difficulty,
          tags: modifiedRecipe.tags || originalRecipe.tags,
          imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
        };
      } catch (jsonError) {
        console.error('Error parsing JSON from Gemini response:', jsonError);
        console.error('JSON content that failed to parse:', jsonContent);
        throw new Error('Invalid JSON format in Gemini response');
      }
    } catch (apiError) {
      console.error('Error with Gemini API, falling back to mock data:', apiError);
      
      // Fall back to mock data if API fails
      const originalRecipe = mockRecipeData.find(recipe => recipe.id === recipeId) || mockRecipeData[0];
      
      // Create a modified ID that preserves the original ID but indicates it's a modification
      const modifiedId = `${recipeId}-modified-${Date.now().toString().slice(-6)}`;
      
      // Create a modified version based on the request
      const modifiedRecipe: Recipe = {
        ...originalRecipe,
        id: modifiedId,
        title: `${dietaryPreference ? dietaryPreference + ' ' : ''}${originalRecipe.title}`,
        servings: servingSize || originalRecipe.servings,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
      };
      
      return modifiedRecipe;
    }
  } catch (error) {
    console.error('Error modifying recipe:', error);
    throw error;
  }
}

// Mock chat responses
const mockChatResponses: Record<string, string> = {
  "default": "I'm your AI cooking assistant. How can I help you with recipes or cooking advice today?",
  "recipe": "To make a basic pasta dish, boil pasta according to package instructions. Meanwhile, sauté garlic in olive oil, add your favorite vegetables or protein, and season with salt and pepper. Drain the pasta and toss with the sauce. Finish with grated cheese if desired!",
  "substitute": "You can substitute eggs in baking with several alternatives: 1/4 cup applesauce, 1/4 cup mashed banana, 1 tablespoon ground flaxseed mixed with 3 tablespoons water, or 1/4 cup yogurt all work well as a replacement for one egg.",
  "technique": "To properly sear meat, make sure your pan is very hot before adding the meat. Pat the meat dry with paper towels first, as moisture prevents proper searing. Don't move the meat too soon - let it develop a crust before flipping. This usually takes 3-4 minutes per side depending on thickness."
};

// Chat with the AI assistant
export async function chatWithAssistant(messages: ChatMessage[]): Promise<string> {
  try {
    // Try to use Gemini API first
    try {
      console.log('Chatting with Gemini API');
      
      // Format messages for Gemini API
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      
      if (!lastUserMessage) {
        return mockChatResponses["default"];
      }
      
      // Create a context from previous messages
      let context = "";
      if (messages.length > 1) {
        const previousMessages = messages.slice(0, -1);
        context = previousMessages.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        context = "Previous conversation:\n" + context + "\n";
      }
      
      const prompt = `${context}User: ${lastUserMessage.content}\nYou are a helpful culinary assistant that can answer questions about cooking techniques, ingredient substitutions, and general food knowledge. Keep your answers concise and focused on cooking-related topics. Respond to the user's last message.`;
      
      console.log('Sending prompt to Gemini:', prompt);
      
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      if (!content) throw new Error("No content returned from Gemini");
      
      console.log('Gemini API response:', content);
      
      // Clean up the response if needed
      const cleanedResponse = content.replace(/^Assistant: /, '');
      
      return cleanedResponse;
    } catch (apiError) {
      console.error('Error with Gemini API, falling back to mock data:', apiError);
      
      // Fall back to mock responses if API fails
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      
      if (!lastUserMessage) {
        return mockChatResponses["default"];
      }
      
      const userQuery = lastUserMessage.content.toLowerCase();
      
      // Return appropriate mock response based on query content
      if (userQuery.includes("recipe") || userQuery.includes("make") || userQuery.includes("cook")) {
        return mockChatResponses["recipe"];
      } else if (userQuery.includes("substitute") || userQuery.includes("replace") || userQuery.includes("instead of")) {
        return mockChatResponses["substitute"];
      } else if (userQuery.includes("how to") || userQuery.includes("technique") || userQuery.includes("method")) {
        return mockChatResponses["technique"];
      } else {
        return "I'm not sure about that specific cooking question. Could you ask about recipes, ingredient substitutions, or cooking techniques?";
      }
    }
  } catch (error) {
    console.error('Error chatting with assistant:', error);
    return "I'm sorry, I encountered an error. Please try again later.";
  }
}

// Get a recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    // Find the recipe in mock data (in a real app, this would come from a database)
    const recipe = mockRecipeData.find(recipe => recipe.id === id);
    
    if (!recipe) {
      return null;
    }
    
    // Create a copy of the recipe with an imageUrl
    return {
      ...recipe,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
    };
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
} 