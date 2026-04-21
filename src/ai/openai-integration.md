# OpenAI API Integration

## What is OpenAI API Integration?

OpenAI API Integration is the process of connecting your applications to OpenAI's powerful AI models, including GPT-4, GPT-3.5, DALL-E, and embedding models. This enables you to add advanced AI capabilities like text generation, code completion, image creation, and semantic understanding to your software.

## Example

### Basic OpenAI API Setup

```javascript
// config/openai.js
const OpenAI = require('openai');

class OpenAIService {
  constructor(apiKey, options = {}) {
    this.client = new OpenAI({
      apiKey: apiKey,
      timeout: options.timeout || 30000,
      maxRetries: options.maxRetries || 3,
    });
    
    this.defaultModel = options.defaultModel || 'gpt-3.5-turbo';
    this.maxTokens = options.maxTokens || 2000;
    this.temperature = options.temperature || 0.7;
  }

  // Chat completion
  async chatCompletion(messages, options = {}) {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model || this.defaultModel,
        messages: messages,
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
        stream: options.stream || false,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Chat completion error:', error);
      throw this.handleError(error);
    }
  }

  // Text completion (legacy)
  async textCompletion(prompt, options = {}) {
    try {
      const response = await this.client.completions.create({
        model: options.model || 'text-davinci-003',
        prompt: prompt,
        max_tokens: options.maxTokens || this.maxTokens,
        temperature: options.temperature || this.temperature,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0,
      });

      return response.choices[0].text;
    } catch (error) {
      console.error('Text completion error:', error);
      throw this.handleError(error);
    }
  }

  // Embeddings
  async createEmbedding(text, options = {}) {
    try {
      const response = await this.client.embeddings.create({
        model: options.model || 'text-embedding-ada-002',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Embedding error:', error);
      throw this.handleError(error);
    }
  }

  // Image generation
  async generateImage(prompt, options = {}) {
    try {
      const response = await this.client.images.generate({
        model: options.model || 'dall-e-3',
        prompt: prompt,
        n: options.n || 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        response_format: options.responseFormat || 'url',
      });

      return response.data[0];
    } catch (error) {
      console.error('Image generation error:', error);
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // API returned an error
      const status = error.response.status;
      const message = error.response.data?.error?.message || error.message;
      
      switch (status) {
        case 401:
          return new Error('Invalid API key. Please check your OpenAI API key.');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        case 400:
          return new Error(`Bad request: ${message}`);
        case 500:
          return new Error('OpenAI server error. Please try again later.');
        default:
          return new Error(`OpenAI API error (${status}): ${message}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. Please try again.');
    } else {
      return new Error(`Network error: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;
```

### React Native Integration

```javascript
// hooks/useOpenAI.js
import { useState, useCallback } from 'react';
import OpenAIService from '../config/openai';

export const useOpenAI = (apiKey, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  
  const openaiService = new OpenAIService(apiKey, options);

  const generateText = useCallback(async (messages, generateOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openaiService.chatCompletion(messages, generateOptions);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [openaiService]);

  const generateEmbedding = useCallback(async (text, embeddingOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openaiService.createEmbedding(text, embeddingOptions);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [openaiService]);

  const generateImage = useCallback(async (prompt, imageOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await openaiService.generateImage(prompt, imageOptions);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [openaiService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return {
    generateText,
    generateEmbedding,
    generateImage,
    loading,
    error,
    response,
    clearError,
    clearResponse,
  };
};
```

## Real Use Case

### AI-Powered Code Review Assistant

**GitHub Copilot** and similar tools use OpenAI integration for code assistance:

```javascript
// services/codeReviewService.js
class CodeReviewService {
  constructor(openaiService) {
    this.openai = openaiService;
  }

  async reviewCode(code, language, reviewType = 'general') {
    const prompts = {
      general: `Review this ${language} code for best practices, potential bugs, and improvements:\n\n${code}`,
      security: `Analyze this ${language} code for security vulnerabilities and suggest fixes:\n\n${code}`,
      performance: `Review this ${language} code for performance issues and optimizations:\n\n${code}`,
      style: `Check this ${language} code for coding style and conventions:\n\n${code}`
    };

    const prompt = prompts[reviewType] || prompts.general;
    
    const messages = [
      {
        role: 'system',
        content: `You are an expert ${language} developer. Provide detailed, actionable code review feedback. 
        Focus on specific issues and provide concrete suggestions for improvement.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const review = await this.openai.chatCompletion(messages, {
        temperature: 0.3, // Lower temperature for more consistent reviews
        maxTokens: 1500
      });

      return this.parseReview(review);
    } catch (error) {
      console.error('Code review failed:', error);
      throw error;
    }
  }

  parseReview(reviewText) {
    // Parse the AI response into structured format
    const sections = {
      issues: [],
      suggestions: [],
      bestPractices: [],
      security: [],
      performance: []
    };

    // Simple parsing - in production, use more sophisticated parsing
    const lines = reviewText.split('\n');
    let currentSection = null;

    lines.forEach(line => {
      if (line.includes('Issues:') || line.includes('Problems:')) {
        currentSection = 'issues';
      } else if (line.includes('Suggestions:')) {
        currentSection = 'suggestions';
      } else if (line.includes('Best Practices:')) {
        currentSection = 'bestPractices';
      } else if (line.includes('Security:')) {
        currentSection = 'security';
      } else if (line.includes('Performance:')) {
        currentSection = 'performance';
      } else if (line.startsWith('-') && currentSection) {
        sections[currentSection].push(line.substring(1).trim());
      }
    });

    return {
      summary: reviewText.substring(0, 200) + '...',
      detailedReview: reviewText,
      sections,
      reviewedAt: new Date().toISOString()
    };
  }

  async suggestImprovements(code, language) {
    const prompt = `Suggest specific improvements for this ${language} code. Provide refactored code examples:\n\n${code}`;

    const messages = [
      {
        role: 'system',
        content: `You are an expert ${language} developer. Provide concrete code improvements with before/after examples.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.openai.chatCompletion(messages, {
      temperature: 0.2,
      maxTokens: 2000
    });
  }
}

// React component for code review
const CodeReviewTool = ({ apiKey }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [reviewType, setReviewType] = useState('general');
  const [review, setReview] = useState(null);
  const { generateText, loading, error } = useOpenAI(apiKey);

  const reviewCode = async () => {
    if (!code.trim()) return;

    try {
      const reviewService = new CodeReviewService({ chatCompletion: generateText });
      const result = await reviewService.reviewCode(code, language, reviewType);
      setReview(result);
    } catch (err) {
      console.error('Review failed:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Code Review Assistant</h2>
      
      <div style={{ marginBottom: 10 }}>
        <label>
          Language:
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            style={{ marginLeft: 10, marginRight: 20 }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
          </select>
        </label>
        
        <label>
          Review Type:
          <select 
            value={reviewType} 
            onChange={(e) => setReviewType(e.target.value)}
            style={{ marginLeft: 10 }}
          >
            <option value="general">General</option>
            <option value="security">Security</option>
            <option value="performance">Performance</option>
            <option value="style">Style</option>
          </select>
        </label>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        style={{ 
          width: '100%', 
          height: 200, 
          marginBottom: 10,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5,
          fontFamily: 'monospace'
        }}
      />
      
      <button 
        onClick={reviewCode}
        disabled={loading || !code.trim()}
        style={{
          padding: 10,
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 20
        }}
      >
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {review && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 5 
        }}>
          <h3>Code Review Results</h3>
          <p><strong>Summary:</strong> {review.summary}</p>
          
          {Object.entries(review.sections).map(([section, items]) => (
            items.length > 0 && (
              <div key={section} style={{ marginBottom: 15 }}>
                <h4>{section.charAt(0).toUpperCase() + section.slice(1)}:</h4>
                <ul>
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};
```

## Pro Tip

**Implement Advanced Rate Limiting and Cost Management**

```javascript
// utils/aiResourceManager.js
class AIResourceManager {
  constructor(apiKey, limits = {}) {
    this.apiKey = apiKey;
    this.limits = {
      maxRequestsPerMinute: limits.maxRequestsPerMinute || 60,
      maxTokensPerMinute: limits.maxTokensPerMinute || 40000,
      maxCostPerHour: limits.maxCostPerHour || 10.0,
      ...limits
    };
    
    this.usage = {
      requests: [],
      tokens: [],
      costs: []
    };
    
    this.pricing = {
      'gpt-4': { prompt: 0.03, completion: 0.06 },
      'gpt-3.5-turbo': { prompt: 0.001, completion: 0.002 },
      'text-embedding-ada-002': { prompt: 0.0001 }
    };
  }

  // Check if we can make a request
  canMakeRequest(estimatedTokens, model) {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    // Check request rate limit
    const recentRequests = this.usage.requests.filter(time => time > oneMinuteAgo);
    if (recentRequests.length >= this.limits.maxRequestsPerMinute) {
      return { allowed: false, reason: 'Request rate limit exceeded' };
    }

    // Check token rate limit
    const recentTokens = this.usage.tokens
      .filter(token => token.time > oneMinuteAgo)
      .reduce((sum, token) => sum + token.count, 0);
    
    if (recentTokens + estimatedTokens > this.limits.maxTokensPerMinute) {
      return { allowed: false, reason: 'Token rate limit exceeded' };
    }

    // Check cost limit
    const estimatedCost = this.calculateCost(model, estimatedTokens, estimatedTokens * 0.75);
    const recentCosts = this.usage.costs
      .filter(cost => cost.time > oneHourAgo)
      .reduce((sum, cost) => sum + cost.amount, 0);
    
    if (recentCosts + estimatedCost > this.limits.maxCostPerHour) {
      return { allowed: false, reason: 'Cost limit exceeded' };
    }

    return { allowed: true };
  }

  // Record usage
  recordUsage(tokens, model, cost) {
    const now = Date.now();
    
    this.usage.requests.push(now);
    this.usage.tokens.push({ time: now, count: tokens });
    this.usage.costs.push({ time: now, amount: cost });

    // Clean old usage data
    this.cleanupOldUsage();
  }

  // Calculate cost
  calculateCost(model, promptTokens, completionTokens) {
    const modelPricing = this.pricing[model] || this.pricing['gpt-3.5-turbo'];
    const promptCost = (promptTokens / 1000) * modelPricing.prompt;
    const completionCost = (completionTokens / 1000) * modelPricing.completion;
    return promptCost + completionCost;
  }

  // Clean old usage data
  cleanupOldUsage() {
    const oneHourAgo = Date.now() - 3600000;
    
    this.usage.requests = this.usage.requests.filter(time => time > oneHourAgo);
    this.usage.tokens = this.usage.tokens.filter(token => token.time > oneHourAgo);
    this.usage.costs = this.usage.costs.filter(cost => cost.time > oneHourAgo);
  }

  // Get usage statistics
  getUsageStats() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const oneHourAgo = now - 3600000;

    return {
      requestsPerMinute: this.usage.requests.filter(time => time > oneMinuteAgo).length,
      tokensPerMinute: this.usage.tokens
        .filter(token => token.time > oneMinuteAgo)
        .reduce((sum, token) => sum + token.count, 0),
      costPerHour: this.usage.costs
        .filter(cost => cost.time > oneHourAgo)
        .reduce((sum, cost) => sum + cost.amount, 0),
      limits: this.limits
    };
  }
}

// Enhanced OpenAI service with resource management
class ManagedOpenAIService extends OpenAIService {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    this.resourceManager = new AIResourceManager(apiKey, options.limits);
  }

  async chatCompletion(messages, options = {}) {
    const model = options.model || this.defaultModel;
    const estimatedTokens = this.estimateTokens(messages);
    
    const canProceed = this.resourceManager.canMakeRequest(estimatedTokens, model);
    if (!canProceed.allowed) {
      throw new Error(`Request blocked: ${canProceed.reason}`);
    }

    try {
      const result = await super.chatCompletion(messages, options);
      
      // Record actual usage
      const actualTokens = this.countTokens(result) + estimatedTokens;
      const cost = this.resourceManager.calculateCost(model, estimatedTokens, this.countTokens(result));
      
      this.resourceManager.recordUsage(actualTokens, model, cost);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  estimateTokens(messages) {
    // Rough estimation: ~4 characters = 1 token
    const totalText = messages.map(msg => msg.content).join('');
    return Math.ceil(totalText.length / 4);
  }

  countTokens(text) {
    return Math.ceil(text.length / 4);
  }

  getUsageStats() {
    return this.resourceManager.getUsageStats();
  }
}
```

## Exercise

**Build an AI-Powered Content Creation Platform**

Create a comprehensive platform that uses OpenAI API for various content creation tasks:

```javascript
// services/contentCreationService.js
class ContentCreationService {
  constructor(openaiService) {
    this.openai = openaiService;
  }

  async generateBlogPost(topic, options = {}) {
    const {
      length = 'medium', // short, medium, long
      tone = 'professional', // casual, professional, humorous
      audience = 'general', // beginner, intermediate, expert
      includeCode = false
    } = options;

    const prompt = `
    Write a blog post about "${topic}" with these specifications:
    - Length: ${length} (${this.getWordCount(length)} words)
    - Tone: ${tone}
    - Target audience: ${audience}
    - Include code examples: ${includeCode}
    
    Structure the post with:
    1. Engaging introduction
    2. Main content with clear sections
    3. Practical examples
    4. Conclusion with key takeaways
    `;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert technical writer who creates engaging, informative blog posts.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.openai.chatCompletion(messages, {
      temperature: 0.7,
      maxTokens: this.getMaxTokens(length)
    });
  }

  async generateSocialMediaPost(content, platform = 'twitter') {
    const platformSpecs = {
      twitter: { maxLength: 280, style: 'concise and engaging' },
      linkedin: { maxLength: 1300, style: 'professional and insightful' },
      instagram: { maxLength: 2200, style: 'visual and conversational' }
    };

    const spec = platformSpecs[platform] || platformSpecs.twitter;

    const prompt = `
    Create a ${platform} post based on this content:
    "${content}"
    
    Requirements:
    - Maximum length: ${spec.maxLength} characters
    - Style: ${spec.style}
    - Include relevant hashtags
    - Add a call-to-action
    `;

    const messages = [
      {
        role: 'system',
        content: `You are a social media expert specializing in ${platform} content.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.openai.chatCompletion(messages, {
      temperature: 0.8,
      maxTokens: 500
    });
  }

  async generateCodeExample(language, task, difficulty = 'intermediate') {
    const prompt = `
    Generate a ${language} code example that demonstrates: "${task}"
    
    Difficulty level: ${difficulty}
    
    Requirements:
    - Include clear comments
    - Follow best practices
    - Handle edge cases
    - Provide usage examples
    - Include error handling
    `;

    const messages = [
      {
        role: 'system',
        content: `You are an expert ${language} developer who writes clean, well-documented code.`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.openai.chatCompletion(messages, {
      temperature: 0.3, // Lower temperature for more consistent code
      maxTokens: 1500
    });
  }

  async improveContent(content, improvementType = 'clarity') {
    const improvements = {
      clarity: 'improve clarity and readability',
      engagement: 'make more engaging and interesting',
      seo: 'optimize for search engines',
      conciseness: 'make more concise and to the point'
    };

    const prompt = `
    Improve this content to ${improvements[improvementType]}:
    
    "${content}"
    
    Maintain the original meaning while enhancing the ${improvementType}.
    `;

    const messages = [
      {
        role: 'system',
        content: 'You are an expert content editor who improves writing while preserving the author\'s voice.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    return await this.openai.chatCompletion(messages, {
      temperature: 0.5,
      maxTokens: Math.max(content.length, 1000)
    });
  }

  getWordCount(length) {
    const counts = {
      short: '300-500',
      medium: '800-1200',
      long: '1500-2500'
    };
    return counts[length] || counts.medium;
  }

  getMaxTokens(length) {
    const tokens = {
      short: 800,
      medium: 2000,
      long: 3500
    };
    return tokens[length] || tokens.medium;
  }
}

// React component for the content creation platform
const ContentCreationPlatform = ({ apiKey }) => {
  const [activeTab, setActiveTab] = useState('blog');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [options, setOptions] = useState({});
  const { generateText, loading, error } = useOpenAI(apiKey);

  const contentService = new ContentCreationService({ chatCompletion: generateText });

  const generateContent = async () => {
    if (!topic.trim() && !content.trim()) return;

    try {
      let result = '';
      
      switch (activeTab) {
        case 'blog':
          result = await contentService.generateBlogPost(topic, options);
          break;
        case 'social':
          result = await contentService.generateSocialMediaPost(content, options.platform);
          break;
        case 'code':
          result = await contentService.generateCodeExample(options.language, topic, options.difficulty);
          break;
        case 'improve':
          result = await contentService.improveContent(content, options.improvementType);
          break;
      }
      
      setGeneratedContent(result);
    } catch (err) {
      console.error('Content generation failed:', err);
    }
  };

  const renderOptions = () => {
    switch (activeTab) {
      case 'blog':
        return (
          <div>
            <label>
              Length:
              <select onChange={(e) => setOptions({...options, length: e.target.value})}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>
            <label>
              Tone:
              <select onChange={(e) => setOptions({...options, tone: e.target.value})}>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="humorous">Humorous</option>
              </select>
            </label>
          </div>
        );
      case 'social':
        return (
          <div>
            <label>
              Platform:
              <select onChange={(e) => setOptions({...options, platform: e.target.value})}>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
              </select>
            </label>
          </div>
        );
      case 'code':
        return (
          <div>
            <label>
              Language:
              <select onChange={(e) => setOptions({...options, language: e.target.value})}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="typescript">TypeScript</option>
              </select>
            </label>
            <label>
              Difficulty:
              <select onChange={(e) => setOptions({...options, difficulty: e.target.value})}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
          </div>
        );
      case 'improve':
        return (
          <div>
            <label>
              Improvement Type:
              <select onChange={(e) => setOptions({...options, improvementType: e.target.value})}>
                <option value="clarity">Clarity</option>
                <option value="engagement">Engagement</option>
                <option value="seo">SEO</option>
                <option value="conciseness">Conciseness</option>
              </select>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Content Creation Platform</h2>
      
      <div style={{ marginBottom: 20 }}>
        {['blog', 'social', 'code', 'improve'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              marginRight: 10,
              padding: 8,
              backgroundColor: activeTab === tab ? '#007bff' : '#f8f9fa',
              color: activeTab === tab ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: 5
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        {renderOptions()}
      </div>

      {(activeTab === 'blog' || activeTab === 'code') && (
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={activeTab === 'blog' ? 'Enter blog topic...' : 'Enter code task...'}
          style={{ 
            width: '100%', 
            marginBottom: 10,
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 5
          }}
        />
      )}

      {(activeTab === 'social' || activeTab === 'improve') && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={activeTab === 'social' ? 'Enter content to adapt...' : 'Enter content to improve...'}
          style={{ 
            width: '100%', 
            height: 150, 
            marginBottom: 10,
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 5
          }}
        />
      )}

      <button 
        onClick={generateContent}
        disabled={loading || (!topic.trim() && !content.trim())}
        style={{
          padding: 10,
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 20
        }}
      >
        {loading ? 'Generating...' : 'Generate Content'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {generatedContent && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 5 
        }}>
          <h3>Generated Content:</h3>
          <div style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: activeTab === 'code' ? 'monospace' : 'inherit'
          }}>
            {generatedContent}
          </div>
        </div>
      )}
    </div>
  );
};
```

**Your Tasks:**
1. Implement the content creation service with proper error handling
2. Add content templates and presets
3. Implement content saving and history
4. Add support for multiple AI models
5. Create analytics dashboard for usage tracking

This exercise teaches you advanced OpenAI API integration, content generation strategies, user interface design, and resource management for AI-powered applications.

---

**Next Up**: Build a complete ChatGPT Clone! ChatGPT Clone
