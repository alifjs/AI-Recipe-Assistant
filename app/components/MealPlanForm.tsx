'use client';

import { useState } from 'react';
import { MealPlanRequest } from '../types';

interface MealPlanFormProps {
  onSubmit: (request: MealPlanRequest) => void;
  isLoading: boolean;
}

export default function MealPlanForm({ onSubmit, isLoading }: MealPlanFormProps) {
  const [daysCount, setDaysCount] = useState(3);
  const [calorieGoal, setCalorieGoal] = useState<number | undefined>(undefined);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [excludeIngredients, setExcludeIngredients] = useState<string[]>([]);
  const [currentExcludeIngredient, setCurrentExcludeIngredient] = useState('');

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

  const calorieOptions = [
    { label: 'No specific goal', value: undefined },
    { label: '1200 calories', value: 1200 },
    { label: '1500 calories', value: 1500 },
    { label: '1800 calories', value: 1800 },
    { label: '2000 calories', value: 2000 },
    { label: '2200 calories', value: 2200 },
    { label: '2500 calories', value: 2500 },
  ];

  const handleDietaryPreferenceChange = (preference: string) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: MealPlanRequest = {
      daysCount,
      calorieGoal,
      dietaryPreferences: dietaryPreferences.length > 0 ? dietaryPreferences : undefined,
      excludeIngredients: excludeIngredients.length > 0 ? excludeIngredients : undefined,
    };
    
    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Meal Plan</h2>
      
      {/* Days Count */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Number of Days
        </label>
        <div className="flex items-center">
          <input
            type="range"
            min={1}
            max={7}
            value={daysCount}
            onChange={(e) => setDaysCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            {daysCount} {daysCount === 1 ? 'day' : 'days'}
          </span>
        </div>
      </div>
      
      {/* Calorie Goal */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Daily Calorie Goal
        </label>
        <select
          value={calorieGoal?.toString() || ''}
          onChange={(e) => setCalorieGoal(e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {calorieOptions.map((option, index) => (
            <option key={index} value={option.value?.toString() || ''}>
              {option.label}
            </option>
          ))}
        </select>
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
      
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 transition-colors'
        }`}
      >
        {isLoading ? 'Generating Meal Plan...' : 'Generate Meal Plan'}
      </button>
    </form>
  );
} 