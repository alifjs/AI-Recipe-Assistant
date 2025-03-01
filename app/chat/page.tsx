'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatInterface from '../components/ChatInterface';
import { ChatMessage } from '../types';
import { useChatWithAssistantMutation } from '../store/chatApi';

export default function ChatPage() {
  const [chatWithAssistant, { isLoading }] = useChatWithAssistantMutation();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI cooking assistant. Ask me anything about recipes, cooking techniques, or ingredient substitutions!',
    },
  ]);

  const handleSendMessage = async (newMessages: ChatMessage[]) => {
    try {
      setMessages(newMessages);
      
      console.log('Sending messages to API:', newMessages);
      const result = await chatWithAssistant({ messages: newMessages }).unwrap();
      console.log('Received response from API:', result);
      
      if (result && result.response) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: result.response } as ChatMessage,
        ]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Failed to chat with assistant:', error);
      // In a real app, you would show an error message to the user
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' } as ChatMessage,
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Chat with AI Cooking Assistant
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <ChatInterface 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading} 
              messages={messages}
            />
            
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                What You Can Ask
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Cooking Techniques</h3>
                  <p className="text-gray-600 text-sm">
                    "What's the best way to sear a steak?"
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "How do I properly caramelize onions?"
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Ingredient Substitutions</h3>
                  <p className="text-gray-600 text-sm">
                    "What can I use instead of buttermilk?"
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "Vegan alternatives to eggs in baking?"
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Cooking Times & Temperatures</h3>
                  <p className="text-gray-600 text-sm">
                    "What's the internal temperature for medium-rare steak?"
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "How long to roast a 5lb chicken?"
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold text-gray-800 mb-2">Food Storage & Safety</h3>
                  <p className="text-gray-600 text-sm">
                    "How long can I keep cooked rice in the fridge?"
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    "Is it safe to refreeze thawed meat?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 