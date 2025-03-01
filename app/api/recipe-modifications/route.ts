import { NextRequest, NextResponse } from 'next/server';
import { modifyRecipe } from '@/app/services/openai';
import { RecipeModificationRequest } from '@/app/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecipeModificationRequest = await request.json();
    
    const modifiedRecipe = await modifyRecipe(body);
    
    return NextResponse.json({ recipe: modifiedRecipe });
  } catch (error) {
    console.error('Error in recipe modifications API:', error);
    return NextResponse.json(
      { error: 'Failed to modify recipe' },
      { status: 500 }
    );
  }
} 