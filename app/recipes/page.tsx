'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipeGenerationForm from '../components/RecipeGenerationForm';
import RecipeCard from '../components/RecipeCard';
import { Recipe, RecipeGenerationRequest } from '../types';
import { useGenerateRecipesMutation } from '../store/recipeApi';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [generateRecipes, { isLoading }] = useGenerateRecipesMutation();

  const handleGenerateRecipes = async (request: RecipeGenerationRequest) => {
    try {
      const result = await generateRecipes(request).unwrap();
      setRecipes(result.recipes);
      window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to generate recipes:', error);
      // In a real app, you would show an error message to the user
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Find Recipes with AI
          </h1>
          
          <div className="max-w-2xl mx-auto mb-16">
            <RecipeGenerationForm onSubmit={handleGenerateRecipes} isLoading={isLoading} />
          </div>
          
          <div id="results" className="scroll-mt-8">
            {recipes.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Your Recipe Suggestions
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </>
            )}
            
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Generating delicious recipes for you...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}