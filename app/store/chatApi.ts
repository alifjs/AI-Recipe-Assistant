import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChatMessage } from '../types';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    chatWithAssistant: builder.mutation<{ response: string }, { messages: ChatMessage[] }>({
      query: (request) => ({
        url: 'chat',
        method: 'POST',
        body: request,
      }),
    }),
  }),
});

export const { useChatWithAssistantMutation } = chatApi; 