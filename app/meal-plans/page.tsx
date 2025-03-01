'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MealPlanForm from '../components/MealPlanForm';
import { MealPlan, MealPlanRequest } from '../types';
import { useGenerateMealPlanMutation } from '../store/mealPlanApi';
import RecipeCard from '../components/RecipeCard';

export default function MealPlansPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [generateMealPlan, { isLoading }] = useGenerateMealPlanMutation();

  const handleGenerateMealPlan = async (request: MealPlanRequest) => {
    try {
      const result = await generateMealPlan(request).unwrap();
      setMealPlan(result.mealPlan);
      window.scrollTo({ top: document.getElementById('results')?.offsetTop, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to generate meal plan:', error);
      // In a real app, you would show an error message to the user
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Create Your Meal Plan
          </h1>
          
          <div className="max-w-2xl mx-auto mb-16">
            <MealPlanForm onSubmit={handleGenerateMealPlan} isLoading={isLoading} />
          </div>
          
          <div id="results" className="scroll-mt-8">
            {mealPlan && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {mealPlan.name}
                </h2>
                
                {mealPlan.calorieGoal && (
                  <p className="text-gray-600 mb-6">
                    Daily calorie goal: <span className="font-semibold">{mealPlan.calorieGoal} calories</span>
                  </p>
                )}
                
                {mealPlan.days.map((day, index) => (
                  <div key={index} className="mb-10 border-b border-gray-200 pb-8 last:border-0">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 bg-green-100 p-2 rounded-md">
                      {day.day}
                    </h3>
                    
                    <div className="space-y-8">
                      {day.breakfast && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="mr-2">🍳</span> Breakfast
                          </h4>
                          <div className="md:w-2/3">
                            <RecipeCard recipe={day.breakfast} />
                          </div>
                        </div>
                      )}
                      
                      {day.lunch && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="mr-2">🥗</span> Lunch
                          </h4>
                          <div className="md:w-2/3">
                            <RecipeCard recipe={day.lunch} />
                          </div>
                        </div>
                      )}
                      
                      {day.dinner && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="mr-2">🍽️</span> Dinner
                          </h4>
                          <div className="md:w-2/3">
                            <RecipeCard recipe={day.dinner} />
                          </div>
                        </div>
                      )}
                      
                      {day.snacks && day.snacks.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <span className="mr-2">🍎</span> Snacks
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.snacks.map((snack, snackIndex) => (
                              <RecipeCard key={snackIndex} recipe={snack} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Creating your personalized meal plan...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 