# AI Chat Application

A complete ChatGPT clone built with React Native and Node.js, featuring real-time AI conversations, message history, and advanced AI integration.

## 🎯 Project Overview

This is a production-ready AI chat application that demonstrates modern AI integration, real-time communication, and mobile app development. It showcases how to build intelligent applications using OpenAI's API while providing an excellent user experience.

### Key Features
- Real-time AI conversations with ChatGPT
- Message history and conversation management
- Multiple AI models (GPT-3.5, GPT-4)
- Voice input and text-to-speech
- Offline mode support
- User authentication and profiles
- Custom prompts and templates
- Dark/light theme support

## 🛠️ Tech Stack

### Frontend (React Native)
- **React Native**: Cross-platform mobile development
- **React Navigation**: App navigation
- **AsyncStorage**: Local data persistence
- **React Native Voice**: Speech-to-text
- **React Native TTS**: Text-to-speech
- **Gifted Chat**: Chat UI components

### Backend (Node.js)
- **Node.js/Express**: Server and API
- **OpenAI API**: AI integration
- **Socket.io**: Real-time communication
- **MongoDB**: Conversation storage
- **JWT**: Authentication
- **Redis**: Caching and rate limiting

## 📁 Project Structure

```text
ai-chat-app/
├── mobile/                    # React Native app
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── ChatInput/
│   │   │   ├── MessageList/
│   │   │   └── MessageBubble/
│   │   ├── screens/           # App screens
│   │   │   ├── ChatScreen/
│   │   │   └── SettingsScreen/
│   │   ├── services/          # API services
│   │   │   ├── openaiService.js
│   │   │   └── promptService.js
│   │   └── models/            # Database models
│   │       ├── User.js
│   │       └── Conversation.js
└── backend/                   # Node.js server
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── chatController.js
│   │   │   └── authController.js
│   │   ├── services/          # Business logic
│   │   │   ├── openaiService.js
│   │   │   └── promptService.js
│   │   └── models/            # Database models
│   │       ├── User.js
│   │       └── Conversation.js
└── docs/                      # Documentation
```

## 🏗️ Core Components

### Chat Input Component

```javascript
// mobile/src/components/ChatInput/ChatInput.js
import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  React.useEffect(() => {
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechResults = (e) => setMessage(e.value[0]);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleVoiceStart = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice start error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        {isRecording ? (
          <TouchableOpacity
            style={[styles.voiceButton, styles.recording]}
            onPress={() => Voice.stop()}
          >
            <Ionicons name="stop" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={handleVoiceStart}
            disabled={isLoading}
          >
            <Ionicons name="mic" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.disabled]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
        >
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#dc3545',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#e9ecef',
  },
});

export default ChatInput;
```

### AI Service Integration

```javascript
// mobile/src/services/aiService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

class AIService {
  constructor() {
    this.baseURL = 'https://your-api-domain.com/api';
  }

  // Send message to AI
  async sendMessage(message, conversationId = null, model = 'gpt-3.5-turbo') {
    try {
      const history = await this.getConversationHistory(conversationId);
      
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant.'
        },
        ...history,
        { role: 'user', content: message }
      ];

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          messages,
          model,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      await this.updateConversationHistory(conversationId, message, data.choices[0].message.content);
      
      return {
        id: data.id,
        message: data.choices[0].message.content,
        usage: data.usage,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw this.handleError(error);
    }
  }

  // Get conversation history
  async getConversationHistory(conversationId) {
    if (!conversationId) return [];
    
    try {
      const key = `conversation_${conversationId}`;
      const history = await AsyncStorage.getItem(key);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }

  // Update conversation history
  async updateConversationHistory(conversationId, userMessage, aiMessage) {
    if (!conversationId) return;
    
    try {
      const key = `conversation_${conversationId}`;
      const history = await this.getConversationHistory(conversationId);
      
      const newHistory = [
        ...history,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiMessage }
      ];
      
      // Keep only last 20 messages
      const trimmedHistory = newHistory.slice(-20);
      
      await AsyncStorage.setItem(key, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Update history error:', error);
    }
  }

  // Handle errors
  handleError(error) {
    if (error.message.includes('401')) {
      return new Error('Authentication expired. Please login again.');
    } else if (error.message.includes('429')) {
      return new Error('Too many requests. Please try again later.');
    } else {
      return new Error('An error occurred. Please try again.');
    }
  }
}

export default new AIService();
```

## 🔐 Backend AI Service

### OpenAI Integration

```javascript
// backend/src/services/openaiService.js
const OpenAI = require('openai');
const redis = require('../config/redis');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Generate chat completion
  async generateCompletion(messages, model = 'gpt-3.5-turbo', options = {}) {
    try {
      const cacheKey = this.generateCacheKey(messages, model, options);
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const response = await this.openai.chat.completions.create({
        model,
        messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });
      
      // Cache response for 1 hour
      await redis.setex(cacheKey, 3600, JSON.stringify(response));
      
      return response;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.status === 401) {
        throw new Error('Invalid API key.');
      } else {
        throw new Error('AI service temporarily unavailable.');
      }
    }
  }

  // Generate cache key
  generateCacheKey(messages, model, options) {
    const keyData = {
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      model,
      options: {
        maxTokens: options.maxTokens,
        temperature: options.temperature,
      },
    };
    
    return `openai:${Buffer.from(JSON.stringify(keyData)).toString('base64')}`;
  }
}

module.exports = new OpenAIService();
```

## 🧪 Testing

### Unit Tests

```javascript
// backend/__tests__/services/openaiService.test.js
const OpenAIService = require('../../src/services/openaiService');

describe('OpenAI Service', () => {
  describe('generateCacheKey', () => {
    it('should generate consistent cache key', () => {
      const messages = [
        { role: 'user', content: 'Hello' }
      ];
      const model = 'gpt-3.5-turbo';
      
      const key1 = OpenAIService.generateCacheKey(messages, model, {});
      const key2 = OpenAIService.generateCacheKey(messages, model, {});
      
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const messages1 = [{ role: 'user', content: 'Hello' }];
      const messages2 = [{ role: 'user', content: 'Hi' }];
      
      const key1 = OpenAIService.generateCacheKey(messages1, 'gpt-3.5-turbo', {});
      const key2 = OpenAIService.generateCacheKey(messages2, 'gpt-3.5-turbo', {});
      
      expect(key1).not.toBe(key2);
    });
  });
});
```

## 🚀 Deployment

### Environment Setup

```bash
# Backend environment variables
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/aichat
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret
```

### Docker Configuration

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 📊 Performance Optimization

### Caching Strategy

```javascript
// backend/src/middleware/cache.js
const redis = require('../config/redis');

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        redis.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = cache;
```

## 🔗 Live Demo & Repository

### GitHub Repository
```text
https://github.com/yourusername/ai-chat-app
```

### Live Demo
- **Mobile App**: [Link to deployed app]
- **API Documentation**: [Link to API docs]

### Demo Credentials
- **Email**: demo@aichat.com
- **Password**: demo123

## 🎯 Key Learning Outcomes

After building this project, you'll have mastered:

1. **AI Integration**
   - OpenAI API integration
   - Prompt engineering techniques
   - Token management and cost optimization

2. **Real-time Communication**
   - WebSocket implementation
   - Streaming responses
   - Voice recognition and synthesis

3. **Mobile Development**
   - React Native advanced patterns
   - Voice input integration
   - Offline data synchronization

4. **Backend Architecture**
   - Scalable API design
   - Caching strategies
   - Rate limiting and security

---

**Next Project**: SaaS Dashboard - Learn to build analytics dashboards! 📊
