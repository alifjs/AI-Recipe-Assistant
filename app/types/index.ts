export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo?: NutritionalInfo;
  imageUrl?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  tags?: string[];
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface MealPlan {
  id: string;
  name: string;
  days: MealPlanDay[];
  calorieGoal?: number;
  dietaryPreferences?: string[];
}

export interface MealPlanDay {
  day: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks?: Recipe[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface RecipeGenerationRequest {
  ingredients?: string[];
  dietaryPreferences?: string[];
  mealType?: string;
  excludeIngredients?: string[];
}

export interface MealPlanRequest {
  calorieGoal?: number;
  dietaryPreferences?: string[];
  daysCount: number;
  excludeIngredients?: string[];
}

export interface RecipeModificationRequest {
  recipeId: string;
  modifications: {
    dietaryPreference?: string;
    excludeIngredients?: string[];
    includeIngredients?: string[];
    servingSize?: number;
  };
} 