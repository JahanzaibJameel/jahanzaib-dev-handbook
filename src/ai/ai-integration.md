# AI Integration

## What is AI Integration?

AI integration is the process of incorporating artificial intelligence capabilities into software applications to enhance functionality, automate processes, and provide intelligent user experiences. It transforms traditional applications into smart systems that can learn, predict, and adapt.

## Example

### OpenAI API Integration in Node.js

```javascript
// services/aiService.js
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(prompt, options = {}) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeText(text) {
    const prompt = `Analyze this text for sentiment, key topics, and insights: "${text}"`;
    return this.generateResponse(prompt);
  }
}

module.exports = AIService;
```

### React Native AI Integration

```javascript
// hooks/useAI.js
import { useState, useCallback } from 'react';
import AIService from '../services/aiService';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  const generateResponse = useCallback(async (prompt, options) => {
    setLoading(true);
    setError(null);
    
    try {
      const aiService = new AIService();
      const result = await aiService.generateResponse(prompt, options);
      setResponse(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { generateResponse, response, loading, error };
};
```

## Real Use Case

### Customer Support Chatbot

Companies like **Intercom** and **Zendesk** use AI integration to power customer support:

```javascript
// components/AIChatbot.js
import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { generateResponse, loading } = useAI();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Generate AI response
    const aiPrompt = `Customer asked: "${input}". Provide helpful customer support response.`;
    const aiResponse = await generateResponse(aiPrompt);
    
    const botMessage = { role: 'assistant', content: aiResponse };
    setMessages(prev => [...prev, botMessage]);
    setInput('');
  };

  return (
    <div className="chatbot">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
```

## Pro Tip

**Implement Rate Limiting and Caching**

```javascript
// utils/aiCache.js
class AICache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (LRU)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

// Enhanced AI Service with caching
class EnhancedAIService extends AIService {
  constructor() {
    super();
    this.cache = new AICache();
    this.rateLimiter = new Map(); // Simple rate limiting
  }

  async generateResponse(prompt, options = {}) {
    const cacheKey = `${prompt}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Simple rate limiting
    const clientId = options.clientId || 'default';
    const now = Date.now();
    const lastRequest = this.rateLimiter.get(clientId) || 0;
    
    if (now - lastRequest < 1000) { // 1 second between requests
      throw new Error('Rate limit exceeded. Please wait.');
    }
    
    this.rateLimiter.set(clientId, now);

    // Generate response
    const response = await super.generateResponse(prompt, options);
    
    // Cache the result
    this.cache.set(cacheKey, response);
    
    return response;
  }
}
```

## Exercise

**Build a Simple AI Content Generator**

Create a React Native component that uses AI to generate blog post titles based on a topic:

```javascript
// components/AIContentGenerator.js
import React, { useState } from 'react';
import { useAI } from '../hooks/useAI';

const AIContentGenerator = () => {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState([]);
  const { generateResponse, loading } = useAI();

  const generateTitles = async () => {
    if (!topic.trim()) return;

    const prompt = `Generate 5 catchy blog post titles about: "${topic}". Return as a numbered list.`;
    
    try {
      const response = await generateResponse(prompt);
      // Parse the numbered list
      const titleList = response
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());
      
      setTitles(titleList);
    } catch (error) {
      console.error('Failed to generate titles:', error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Blog Title Generator</h2>
      
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        style={{ 
          width: '100%', 
          padding: 10, 
          marginBottom: 10,
          border: '1px solid #ccc',
          borderRadius: 5
        }}
      />
      
      <button 
        onClick={generateTitles}
        disabled={loading || !topic.trim()}
        style={{
          padding: 10,
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Titles'}
      </button>

      {titles.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Generated Titles:</h3>
          {titles.map((title, i) => (
            <div key={i} style={{ 
              padding: 10, 
              backgroundColor: '#f8f9fa',
              marginBottom: 5,
              borderRadius: 5 
            }}>
              {title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;
```

**Your Tasks:**
1. Implement the AI content generator component
2. Add error handling for API failures
3. Create a loading indicator during AI generation
4. Add a feature to save favorite titles
5. Implement character limit for the topic input

This exercise teaches you practical AI integration, error handling, and user experience considerations when working with AI APIs.

---

**Next Up**: Learn about building a complete ChatGPT Clone! ChatGPT Clone
