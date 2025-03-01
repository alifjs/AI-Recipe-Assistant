import { NextRequest, NextResponse } from 'next/server';
import { chatWithAssistant } from '@/app/services/openai';
import { ChatMessage } from '@/app/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages || [];
    
    console.log('Chat API received messages:', messages);
    
    const response = await chatWithAssistant(messages);
    
    console.log('Chat API response:', response);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to chat with assistant' },
      { status: 500 }
    );
  }
} 