import { NextRequest, NextResponse } from 'next/server';
import { generateRecipes } from '@/app/services/openai';
import { RecipeGenerationRequest } from '@/app/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecipeGenerationRequest = await request.json();
    
    const recipes = await generateRecipes(body);
    
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error in recipes API:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
} 