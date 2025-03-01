'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetRecipeByIdQuery } from '@/app/store/recipeApi';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  
  const { data, error, isLoading } = useGetRecipeByIdQuery(recipeId);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading recipe details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !data?.recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error! </strong>
                <span className="block sm:inline">We couldn't find that recipe. It may have been removed or the ID is incorrect.</span>
              </div>
              <div className="mt-6">
                <Link href="/recipes" className="text-green-600 hover:text-green-800 font-medium">
                  ← Back to Recipes
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const { recipe } = data;
  const {
    title,
    ingredients,
    instructions,
    nutritionalInfo,
    prepTime,
    cookTime,
    servings,
    difficulty,
    imageUrl,
    tags,
  } = recipe;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link href="/recipes" className="text-green-600 hover:text-green-800 font-medium">
              ← Back to Recipes
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="relative h-72 md:h-full w-full">
                  <Image
                    src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-1/2 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
                
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {prepTime && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Prep Time</p>
                      <p className="font-semibold">{prepTime}</p>
                    </div>
                  )}
                  
                  {cookTime && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Cook Time</p>
                      <p className="font-semibold">{cookTime}</p>
                    </div>
                  )}
                  
                  {servings && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Servings</p>
                      <p className="font-semibold">{servings}</p>
                    </div>
                  )}
                  
                  {difficulty && (
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <p className="font-semibold">{difficulty}</p>
                    </div>
                  )}
                </div>
                
                {nutritionalInfo && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Nutrition Facts</h3>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-green-50 p-2 rounded">
                        <p className="font-bold text-green-700">{nutritionalInfo.calories}</p>
                        <p className="text-xs text-gray-600">Calories</p>
                      </div>
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="font-bold text-blue-700">{nutritionalInfo.protein}g</p>
                        <p className="text-xs text-gray-600">Protein</p>
                      </div>
                      <div className="bg-yellow-50 p-2 rounded">
                        <p className="font-bold text-yellow-700">{nutritionalInfo.carbs}g</p>
                        <p className="text-xs text-gray-600">Carbs</p>
                      </div>
                      <div className="bg-red-50 p-2 rounded">
                        <p className="font-bold text-red-700">{nutritionalInfo.fat}g</p>
                        <p className="text-xs text-gray-600">Fat</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'ingredients'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('ingredients')}
                >
                  Ingredients
                </button>
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'instructions'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('instructions')}
                >
                  Instructions
                </button>
              </div>
              
              {activeTab === 'ingredients' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h2>
                  {ingredients && ingredients.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="text-gray-700">{ingredient}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No ingredients listed</p>
                  )}
                </div>
              )}
              
              {activeTab === 'instructions' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h2>
                  {instructions && instructions.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-4">
                      {instructions.map((instruction, index) => (
                        <li key={index} className="text-gray-700">{instruction}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500 italic">No instructions listed</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 