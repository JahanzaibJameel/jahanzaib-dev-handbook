# AI Project: ChatGPT Clone

## What is this Project?

A complete, production-ready ChatGPT clone built with Next.js, TypeScript, and OpenAI API that demonstrates advanced AI integration, real-time chat functionality, conversation management, and modern web development best practices.

## Project Overview

### Features
- Real-time AI chat interface
- Multiple AI model support (GPT-3.5, GPT-4, Claude)
- Conversation history and management
- Custom prompts and templates
- Code syntax highlighting
- Markdown rendering
- Export conversations (PDF, JSON, Markdown)
- Dark/Light theme support
- Voice input/output
- File upload for analysis
- Streaming responses
- Rate limiting and usage tracking
- Multi-language support

### Tech Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **OpenAI API** for AI responses
- **Tailwind CSS** for styling
- **Prisma** for database
- **PostgreSQL** for data storage
- **Redis** for caching
- **Socket.io** for real-time features
- **Framer Motion** for animations
- **React Query** for state management
- **NextAuth.js** for authentication

## Project Structure

```
chatgpt-clone/
# Configuration
next.config.js
package.json
tsconfig.json
tailwind.config.js
prisma.schema
.env.example

# Source Code
src/
  app/
    (auth)/
      login/
      register/
      dashboard/
    chat/
      layout.tsx
      page.tsx
      [id]/
    api/
      chat/
        route.ts
        models/
          route.ts
      auth/
        [...nextauth]/
      export/
        route.ts
        
  components/
    ui/
      Button/
      Input/
      Modal/
      Dropdown/
    chat/
      ChatInterface/
      MessageBubble/
      TypingIndicator/
      ConversationList/
      PromptTemplates/
    layout/
      Header/
      Sidebar/
      Navigation/
      
  lib/
    openai.ts
    prisma.ts
    redis.ts
    auth.ts
    utils.ts
    constants.ts
    
  hooks/
    useChat.ts
    useAuth.ts
    useTheme.ts
    useWebSocket.ts
    
  store/
    chatStore.ts
    authStore.ts
    settingsStore.ts
    
  types/
    chat.ts
    auth.ts
    api.ts
    
  styles/
    globals.css
    components.css
    
  assets/
    icons/
    images/
    sounds/

# Database
prisma/
  schema.prisma
  migrations/
  seed.ts

# Tests
__tests__/
  components/
  api/
  hooks/
  utils/

# Documentation
docs/
  API.md
  SETUP.md
  DEPLOYMENT.md
```

## Complete Implementation

### Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  conversations Conversation[]
  messages       Message[]
  settings       UserSettings?
  
  @@map("users")
}

model Conversation {
  id          String   @id @default(cuid())
  title       String
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    Message[]
  
  @@map("conversations")
}

model Message {
  id             String   @id @default(cuid())
  content        String
  role           MessageRole
  conversationId String
  userId         String
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("messages")
}

model PromptTemplate {
  id          String @id @default(cuid())
  title       String
  content     String
  category    String
  isPublic    Boolean @default(false)
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("prompt_templates")
}

model UserSettings {
  id                   String @id @default(cuid())
  userId               String @unique
  theme                String @default("light")
  model                String @default("gpt-3.5-turbo")
  temperature          Float  @default(0.7)
  maxTokens           Int    @default(2048)
  streamingEnabled     Boolean @default(true)
  voiceEnabled         Boolean @default(false)
  language             String @default("en")
  
  user                 User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_settings")
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}
```

### OpenAI Service

```typescript
// src/lib/openai.ts
import { OpenAI } from 'openai';
import { Message } from '@/types/chat';
import { redis } from './redis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export class ChatService {
  private readonly defaultModel = 'gpt-3.5-turbo';
  private readonly defaultTemperature = 0.7;
  private readonly defaultMaxTokens = 2048;

  async generateResponse(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const {
      model = this.defaultModel,
      temperature = this.defaultTemperature,
      maxTokens = this.defaultMaxTokens,
      systemPrompt
    } = options;

    const completionMessages = this.formatMessages(messages, systemPrompt);

    try {
      const response = await openai.chat.completions.create({
        model,
        messages: completionMessages,
        temperature,
        max_tokens: maxTokens,
        stream: false,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async generateStreamingResponse(
    messages: Message[],
    options: ChatCompletionOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const {
      model = this.defaultModel,
      temperature = this.defaultTemperature,
      maxTokens = this.defaultMaxTokens,
      systemPrompt
    } = options;

    const completionMessages = this.formatMessages(messages, systemPrompt);

    try {
      const stream = await openai.chat.completions.create({
        model,
        messages: completionMessages,
        temperature,
        max_tokens: maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error('OpenAI streaming error:', error);
      throw new Error('Failed to generate streaming response');
    }
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      throw new Error('Failed to generate embeddings');
    }
  }

  async moderateContent(text: string): Promise<boolean> {
    try {
      const response = await openai.moderations.create({
        input: text,
      });

      return response.results[0]?.flagged || false;
    } catch (error) {
      console.error('Content moderation error:', error);
      return false;
    }
  }

  private formatMessages(messages: Message[], systemPrompt?: string): OpenAI.Chat.ChatCompletionMessageParam[] {
    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }

    messages.forEach((message) => {
      formattedMessages.push({
        role: message.role.toLowerCase() as 'user' | 'assistant' | 'system',
        content: message.content,
      });
    });

    return formattedMessages;
  }

  async cacheResponse(key: string, response: string, ttl: number = 3600): Promise<void> {
    await redis.setex(`chat:${key}`, ttl, response);
  }

  async getCachedResponse(key: string): Promise<string | null> {
    return await redis.get(`chat:${key}`);
  }

  async generateResponseWithCache(
    messages: Message[],
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(messages, options);
    
    const cached = await this.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.generateResponse(messages, options);
    await this.cacheResponse(cacheKey, response);
    
    return response;
  }

  private generateCacheKey(messages: Message[], options: ChatCompletionOptions): string {
    const messageHash = messages.map(m => `${m.role}:${m.content}`).join('|');
    const optionsHash = JSON.stringify(options);
    return Buffer.from(`${messageHash}:${optionsHash}`).toString('base64');
  }
}

export const chatService = new ChatService();
```

### Chat Interface Component

```typescript
// src/components/chat/ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Settings, Download } from 'lucide-react';

import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import PromptTemplates from './PromptTemplates';
import { Message, Conversation } from '@/types/chat';
import { chatService } from '@/lib/openai';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

interface ChatInterfaceProps {
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch conversation messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const response = await fetch(`/api/chat/${conversationId}/messages`);
      return response.json();
    },
    enabled: !!conversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, conversationId }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setInput('');
      queryClient.invalidateQueries(['messages', conversationId]);
      queryClient.invalidateQueries(['conversations']);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  // Stream response mutation
  const streamResponseMutation = useMutation({
    mutationFn: async (content: string) => {
      setIsTyping(true);
      setStreamingResponse('');

      try {
        await chatService.generateStreamingResponse(
          [...(messages || []), { content, role: 'user', id: '', createdAt: new Date() }],
          {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            stream: true,
          },
          (chunk) => {
            setStreamingResponse((prev) => prev + chunk);
          }
        );

        // Save the complete response
        await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            conversationId,
            assistantResponse: streamingResponse,
          }),
        });

        queryClient.invalidateQueries(['messages', conversationId]);
      } catch (error) {
        throw error;
      } finally {
        setIsTyping(false);
        setStreamingResponse('');
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to generate response',
        variant: 'destructive',
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = () => {
    if (!input.trim() || isTyping) return;

    if (user?.settings?.streamingEnabled) {
      streamResponseMutation.mutate(input);
    } else {
      sendMessageMutation.mutate(input);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Voice input is not supported in your browser',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleFileUpload = async (file: File) => {
    // Implement file analysis functionality
    toast({
      title: 'File Upload',
      description: 'File analysis coming soon!',
    });
  };

  const exportConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(`/api/chat/${conversationId}/export`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversationId}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export conversation',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingResponse]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ChatGPT Clone
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={exportConversation}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            {messages?.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MessageBubble
                  message={{
                    id: 'typing',
                    content: streamingResponse,
                    role: 'assistant',
                    createdAt: new Date(),
                  }}
                />
                {!streamingResponse && <TypingIndicator />}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows={1}
              disabled={isTyping}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => document.getElementById('file-upload')?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleVoiceInput}
              className={`p-2 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'} dark:text-gray-400 dark:hover:text-gray-200`}
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        />
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <PromptTemplates
          onClose={() => setShowTemplates(false)}
          onSelect={(template) => setInput(template.content)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
```

### API Route for Chat

```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { chatService } from '@/lib/openai';
import { z } from 'zod';

const chatRequestSchema = z.object({
  content: z.string().min(1).max(4000),
  conversationId: z.string().optional(),
  assistantResponse: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, conversationId, assistantResponse } = chatRequestSchema.parse(body);

    // Moderate content
    const isFlagged = await chatService.moderateContent(content);
    if (isFlagged) {
      return NextResponse.json({ error: 'Content flagged as inappropriate' }, { status: 400 });
    }

    let conversation = conversationId 
      ? await prisma.conversation.findFirst({
          where: { id: conversationId, userId: session.user.id },
        })
      : null;

    // Create new conversation if needed
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
          userId: session.user.id,
        },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content,
        role: 'USER',
        conversationId: conversation.id,
        userId: session.user.id,
      },
    });

    // If assistant response is provided (streaming), save it
    if (assistantResponse) {
      await prisma.message.create({
        data: {
          content: assistantResponse,
          role: 'ASSISTANT',
          conversationId: conversation.id,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ 
        message: userMessage,
        conversation,
        assistantResponse 
      });
    }

    // Generate AI response for non-streaming
    const previousMessages = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
    });

    const aiResponse = await chatService.generateResponseWithCache(
      previousMessages.map(m => ({ ...m, role: m.role as any })),
      {
        model: session.user.settings?.model || 'gpt-3.5-turbo',
        temperature: session.user.settings?.temperature || 0.7,
        maxTokens: session.user.settings?.maxTokens || 2048,
      }
    );

    // Save assistant response
    const assistantMessage = await prisma.message.create({
      data: {
        content: aiResponse,
        role: 'ASSISTANT',
        conversationId: conversation.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ 
      message: userMessage,
      conversation,
      assistantMessage 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ conversations });

  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Real Use Case

### Production Chat Applications

**ChatGPT**, **Claude**, and **Perplexity** implement similar patterns:

```typescript
// Advanced Chat Service with Multiple Models
class AdvancedChatService {
  private models = {
    'gpt-3.5-turbo': new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    'gpt-4': new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    'claude': new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
  };

  async generateResponseWithModel(
    messages: Message[],
    model: string,
    options: ChatCompletionOptions = {}
  ): Promise<string> {
    const modelService = this.models[model as keyof typeof this.models];
    if (!modelService) {
      throw new Error(`Model ${model} not supported`);
    }

    // Model-specific implementation
    if (model.startsWith('gpt')) {
      return await this.generateOpenAIResponse(modelService as OpenAI, messages, options);
    } else if (model === 'claude') {
      return await this.generateClaudeResponse(modelService as Anthropic, messages, options);
    }

    throw new Error('Unsupported model');
  }

  private async generateOpenAIResponse(
    client: OpenAI,
    messages: Message[],
    options: ChatCompletionOptions
  ): Promise<string> {
    // OpenAI-specific implementation
  }

  private async generateClaudeResponse(
    client: Anthropic,
    messages: Message[],
    options: ChatCompletionOptions
  ): Promise<string> {
    // Claude-specific implementation
  }
}
```

## Pro Tip

**Implement Advanced Caching and Rate Limiting**

```typescript
// src/lib/advancedCache.ts
import { redis } from './redis';

class AdvancedCache {
  async getWithFallback<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  async cacheWithTags(
    key: string,
    data: any,
    tags: string[],
    ttl: number = 3600
  ): Promise<void> {
    const pipeline = redis.pipeline();
    
    // Cache the data
    pipeline.setex(key, ttl, JSON.stringify(data));
    
    // Add to tag sets
    for (const tag of tags) {
      pipeline.sadd(`tag:${tag}`, key);
      pipeline.expire(`tag:${tag}`, ttl);
    }
    
    await pipeline.exec();
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = await redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await redis.del(...keys, `tag:${tag}`);
    }
  }
}

// src/lib/rateLimiter.ts
class RateLimiter {
  async checkRateLimit(
    identifier: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - window * 1000;

    const pipeline = redis.pipeline();
    
    // Remove old entries
    pipeline.zremrangebyscore(key, 0, windowStart);
    
    // Count current requests
    pipeline.zcard(key);
    
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`);
    
    // Set expiration
    pipeline.expire(key, window);
    
    const results = await pipeline.exec();
    const currentCount = results?.[1]?.[1] as number || 0;

    return {
      allowed: currentCount < limit,
      remaining: Math.max(0, limit - currentCount - 1),
      resetTime: now + window * 1000,
    };
  }
}
```

## Exercise

**Build the Complete ChatGPT Clone**

Create a production-ready AI chat application with the following requirements:

```typescript
// Exercise Tasks:
// 1. Set up the complete Next.js project structure
// 2. Implement all AI model integrations
// 3. Create real-time chat interface with streaming
// 4. Add conversation management and history
// 5. Implement user authentication and settings
// 6. Add advanced caching and rate limiting
// 7. Create comprehensive error handling
// 8. Add unit and integration tests
// 9. Implement file upload and analysis
// 10. Add voice input/output features

// Implementation Checklist:

// 1. Project Setup
// - Create Next.js 14 project with App Router
// - Configure TypeScript and ESLint
// - Set up Prisma and PostgreSQL
// - Configure authentication with NextAuth.js
// - Set up Redis for caching

// 2. Core Features
// - AI model integration (OpenAI, Claude)
// - Real-time chat with streaming
// - Conversation management
// - User settings and preferences
// - Message history and search

// 3. Advanced Features
// - Multiple AI models
// - Custom prompt templates
// - File upload and analysis
// - Voice input/output
// - Export conversations
// - Rate limiting and usage tracking

// 4. UI/UX
// - Beautiful chat interface
// - Dark/light theme support
// - Responsive design
// - Animations and transitions
// - Accessibility features

// 5. Performance & Security
// - Advanced caching strategies
// - Rate limiting
// - Content moderation
// - Input validation
// - Error handling

// 6. Testing
// - Unit tests for services
// - Component tests
// - Integration tests
// - E2E tests with Playwright

// 7. Deployment
// - Docker configuration
// - Environment setup
// - CI/CD pipeline
// - Monitoring and logging
```

**Your Tasks:**
1. Set up the complete Next.js project with App Router
2. Implement all AI model integrations (OpenAI, Claude)
3. Create real-time chat interface with streaming responses
4. Add conversation management and history features
5. Implement user authentication and personalized settings
6. Add advanced caching and rate limiting
7. Create comprehensive error handling and user feedback
8. Add unit and integration tests
9. Implement file upload and AI analysis features
10. Add voice input/output capabilities

This exercise teaches you:
- Next.js 14 App Router and server components
- AI API integration and streaming responses
- Real-time communication with WebSockets
- Advanced state management and caching
- Database design with Prisma
- Authentication and authorization
- Rate limiting and performance optimization
- Modern UI/UX design patterns
- Testing strategies for complex applications
- Production deployment and monitoring

---

**Next Up**: Learn about building Real Projects walkthroughs! Project Showcase
