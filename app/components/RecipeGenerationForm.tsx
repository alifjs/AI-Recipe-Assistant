'use client';

import { useState } from 'react';
import { RecipeGenerationRequest } from '../types';

interface RecipeGenerationFormProps {
  onSubmit: (request: RecipeGenerationRequest) => void;
  isLoading: boolean;
}

export default function RecipeGenerationForm({ onSubmit, isLoading }: RecipeGenerationFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [currentExcludeIngredient, setCurrentExcludeIngredient] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [mealType, setMealType] = useState('');

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Low-Carb',
    'Paleo',
    'Whole30',
  ];

  const mealTypeOptions = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Dessert',
    'Appetizer',
  ];

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleAddExcludeIngredient = () => {
    if (currentExcludeIngredient.trim() && !excludeIngredients.includes(currentExcludeIngredient.trim())) {
      setExcludeIngredients([...excludeIngredients, currentExcludeIngredient.trim()]);
      setCurrentExcludeIngredient('');
    }
  };

  const handleRemoveExcludeIngredient = (ingredient: string) => {
    setExcludeIngredients(excludeIngredients.filter(i => i !== ingredient));
  };

  const handleDietaryPreferenceChange = (preference: string) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: RecipeGenerationRequest = {
      ingredients,
      excludeIngredients,
      dietaryPreferences,
      mealType: mealType || undefined,
    };
    
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Recipes</h2>
      
      {/* Ingredients */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Ingredients You Have
        </label>
        <div className="flex">
          <input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add an ingredient..."
          />
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        {ingredients.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="ml-2 text-green-800 hover:text-green-900"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Exclude Ingredients */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Ingredients to Exclude
        </label>
        <div className="flex">
          <input
            type="text"
            value={currentExcludeIngredient}
            onChange={(e) => setCurrentExcludeIngredient(e.target.value)}
            className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add an ingredient to exclude..."
          />
          <button
            type="button"
            onClick={handleAddExcludeIngredient}
            className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        {excludeIngredients.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {excludeIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemoveExcludeIngredient(ingredient)}
                  className="ml-2 text-red-800 hover:text-red-900"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Dietary Preferences */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Dietary Preferences
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {dietaryOptions.map((option) => (
            <label
              key={option}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                dietaryPreferences.includes(option)
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={dietaryPreferences.includes(option)}
                onChange={() => handleDietaryPreferenceChange(option)}
                className="sr-only"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Meal Type */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Meal Type
        </label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Any meal type</option>
          {mealTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || ingredients.length === 0}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          isLoading || ingredients.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 transition-colors'
        }`}
      >
        {isLoading ? 'Generating Recipes...' : 'Generate Recipes'}
      </button>
    </form>
  );
} 