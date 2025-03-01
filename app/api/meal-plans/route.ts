import { NextRequest, NextResponse } from 'next/server';
import { generateMealPlan } from '@/app/services/openai';
import { MealPlanRequest } from '@/app/types';

export async function POST(request: NextRequest) {
  try {
    const body: MealPlanRequest = await request.json();
    
    const mealPlan = await generateMealPlan(body);
    
    return NextResponse.json({ mealPlan });
  } catch (error) {
    console.error('Error in meal plans API:', error);
    return NextResponse.json(
      { error: 'Failed to generate meal plan' },
      { status: 500 }
    );
  }
} 