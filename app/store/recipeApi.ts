import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe, RecipeGenerationRequest, RecipeModificationRequest } from '../types';

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Recipe'],
  endpoints: (builder) => ({
    generateRecipes: builder.mutation<{ recipes: Recipe[] }, RecipeGenerationRequest>({
      query: (request) => ({
        url: 'recipes',
        method: 'POST',
        body: request,
      }),
    }),
    getRecipeById: builder.query<{ recipe: Recipe }, string>({
      query: (id) => `recipes/${id}`,
    }),
    modifyRecipe: builder.mutation<{ recipe: Recipe }, RecipeModificationRequest>({
      query: (request) => ({
        url: 'recipe-modifications',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { 
  useGenerateRecipesMutation, 
  useGetRecipeByIdQuery,
  useModifyRecipeMutation 
} = recipeApi; 