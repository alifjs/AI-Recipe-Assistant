import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MealPlan, MealPlanRequest } from '../types';

export const mealPlanApi = createApi({
  reducerPath: 'mealPlanApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['MealPlan'],
  endpoints: (builder) => ({
    generateMealPlan: builder.mutation<{ mealPlan: MealPlan }, MealPlanRequest>({
      query: (request) => ({
        url: 'meal-plans',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useGenerateMealPlanMutation } = mealPlanApi; 