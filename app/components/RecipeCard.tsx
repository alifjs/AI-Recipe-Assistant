'use client';

import React from 'react';
import { Recipe } from '../types';
import Image from 'next/image';
import Link from 'next/link';

interface RecipeCardProps {
  recipe: Recipe;
  showNutrition?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, showNutrition = true }) => {
  const {
    id,
    title,
    description,
    ingredients,
    nutritionalInfo,
    prepTime,
    cookTime,
    imageUrl,
    difficulty,
  } = recipe;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-3">{description}</p>}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {prepTime && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              Prep: {prepTime}
            </span>
          )}
          {cookTime && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              Cook: {cookTime}
            </span>
          )}
          {difficulty && (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {difficulty}
            </span>
          )}
        </div>
        
        {showNutrition && nutritionalInfo && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Nutrition per serving:</h4>
            <div className="grid grid-cols-4 gap-1 text-xs">
              <div className="bg-green-50 p-1 rounded text-center">
                <span className="block font-bold text-green-700">{nutritionalInfo.calories}</span>
                <span className="text-gray-500">Cal</span>
              </div>
              <div className="bg-blue-50 p-1 rounded text-center">
                <span className="block font-bold text-blue-700">{nutritionalInfo.protein}g</span>
                <span className="text-gray-500">Protein</span>
              </div>
              <div className="bg-yellow-50 p-1 rounded text-center">
                <span className="block font-bold text-yellow-700">{nutritionalInfo.carbs}g</span>
                <span className="text-gray-500">Carbs</span>
              </div>
              <div className="bg-red-50 p-1 rounded text-center">
                <span className="block font-bold text-red-700">{nutritionalInfo.fat}g</span>
                <span className="text-gray-500">Fat</span>
              </div>
            </div>
          </div>
        )}
        
        {ingredients && ingredients.length > 0 ? (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Main Ingredients:</h4>
            <p className="text-gray-600 text-sm">
              {ingredients.slice(0, 3).join(', ')}
              {ingredients.length > 3 && '...'}
            </p>
          </div>
        ) : (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Main Ingredients:</h4>
            <p className="text-gray-600 text-sm italic">No ingredients listed</p>
          </div>
        )}
      </div>
      
      <div className="px-4 pb-4 mt-auto">
        <Link 
          href={`/recipes/${id}`} 
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-center transition duration-200"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard; 