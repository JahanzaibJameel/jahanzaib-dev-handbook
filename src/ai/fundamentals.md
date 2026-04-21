# AI Fundamentals

## What is AI Fundamentals?

AI Fundamentals covers the core concepts, architectures, and principles that form the foundation of artificial intelligence development. Understanding these fundamentals is crucial for building effective and responsible AI applications.

## Example

### Understanding AI Models

```javascript
// Different AI model types and their use cases
const AIModels = {
  // Large Language Models (LLMs)
  gpt4: {
    type: 'LLM',
    capabilities: ['text generation', 'reasoning', 'analysis'],
    useCases: ['chatbots', 'content creation', 'code generation'],
    limitations: ['knowledge cutoff', 'potential hallucinations']
  },
  
  // Embedding Models
  textEmbeddings: {
    type: 'Embedding',
    capabilities: ['text similarity', 'semantic search', 'clustering'],
    useCases: ['search engines', 'recommendation systems', 'document analysis'],
    limitations: ['context window limits', 'language dependency']
  },
  
  // Image Generation Models
  dalle: {
    type: 'Image Generation',
    capabilities: ['image creation', 'style transfer', 'image editing'],
    useCases: ['content creation', 'marketing materials', 'prototyping'],
    limitations: ['computational cost', 'prompt sensitivity']
  }
};

// Model selection helper
const selectModel = (task, requirements) => {
  switch (task) {
    case 'text_generation':
      return requirements.creativity ? 'gpt4' : 'gpt-3.5-turbo';
    case 'semantic_search':
      return 'text-embedding-ada-002';
    case 'image_generation':
      return 'dall-e-3';
    default:
      return 'gpt-3.5-turbo'; // Default choice
  }
};
```

### Tokenization and Processing

```javascript
// Understanding how AI processes text
const tokenizeText = (text) => {
  // Simplified tokenization example
  // In reality, AI models use more sophisticated tokenizers
  const words = text.toLowerCase().split(/\s+/);
  const tokens = words.map(word => word.replace(/[^a-z0-9]/g, ''));
  return tokens.filter(token => token.length > 0);
};

// Calculate approximate token usage
const estimateTokens = (text) => {
  // Rough estimation: ~4 characters = 1 token for English
  return Math.ceil(text.length / 4);
};

// Cost estimation
const estimateCost = (model, promptTokens, completionTokens) => {
  const pricing = {
    'gpt-4': { prompt: 0.03, completion: 0.06 }, // per 1K tokens
    'gpt-3.5-turbo': { prompt: 0.001, completion: 0.002 },
    'text-embedding-ada-002': { prompt: 0.0001, completion: 0 }
  };
  
  const modelPricing = pricing[model] || pricing['gpt-3.5-turbo'];
  const promptCost = (promptTokens / 1000) * modelPricing.prompt;
  const completionCost = (completionTokens / 1000) * modelPricing.completion;
  
  return promptCost + completionCost;
};

// Usage example
const prompt = "Explain quantum computing in simple terms";
const promptTokens = estimateTokens(prompt);
const completionTokens = 500; // Estimated response length

console.log(`Estimated cost for GPT-4: $${estimateCost('gpt-4', promptTokens, completionTokens)}`);
```

## Real Use Case

### Semantic Search Implementation

**Netflix** and **Spotify** use AI fundamentals for content recommendation:

```javascript
// Semantic search service
class SemanticSearchService {
  constructor(openai) {
    this.openai = openai;
    this.cache = new Map();
  }

  async generateEmbedding(text) {
    const cacheKey = `embed:${text}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
      });

      const embedding = response.data[0].embedding;
      this.cache.set(cacheKey, embedding);
      
      return embedding;
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw error;
    }
  }

  // Calculate similarity between two embeddings
  calculateSimilarity(embedding1, embedding2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  // Search for similar content
  async searchSimilar(query, documents) {
    const queryEmbedding = await this.generateEmbedding(query);
    
    const similarities = await Promise.all(
      documents.map(async (doc) => {
        const docEmbedding = await this.generateEmbedding(doc.content);
        const similarity = this.calculateSimilarity(queryEmbedding, docEmbedding);
        
        return { document: doc, similarity };
      })
    );

    // Sort by similarity (highest first)
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .filter(item => item.similarity > 0.7) // Threshold for relevance
      .map(item => item.document);
  }
}

// Usage in a content recommendation system
const recommendationService = new SemanticSearchService(openai);

const userPreferences = "I love sci-fi movies with time travel and philosophical themes";
const movieDatabase = [
  { title: "Inception", content: "A thief who steals corporate secrets through dream-sharing technology" },
  { title: "Interstellar", content: "Explorers travel through a wormhole in space to ensure humanity's survival" },
  { title: "The Matrix", content: "A computer hacker learns about the true nature of reality and his role in the war against its controllers" },
  { title: "Blade Runner", content: "A blade runner must pursue and terminate four replicants who stole a ship in space" }
];

const recommendations = await recommendationService.searchSimilar(
  userPreferences, 
  movieDatabase
);

console.log("Recommended movies:", recommendations);
```

## Pro Tip

**Implement Smart Caching and Batch Processing**

```javascript
// Advanced caching strategy for AI operations
class AIOptimizer {
  constructor() {
    this.cache = new Map();
    this.batchQueue = [];
    this.batchTimeout = null;
    this.batchSize = 10;
    this.batchDelay = 100; // ms
  }

  // Smart caching with TTL
  cacheWithTTL(key, value, ttlMs = 300000) { // 5 minutes default
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }
    this.cache.delete(key);
    return null;
  }

  // Batch processing for efficiency
  addToBatch(request) {
    this.batchQueue.push(request);
    
    if (this.batchQueue.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.processBatch(), this.batchDelay);
    }
  }

  async processBatch() {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue.splice(0, this.batchSize);
    clearTimeout(this.batchTimeout);
    this.batchTimeout = null;

    try {
      // Process all requests in a single API call if possible
      const responses = await this.processBatchRequests(batch);
      
      // Resolve all promises
      batch.forEach((request, index) => {
        request.resolve(responses[index]);
      });
    } catch (error) {
      // Reject all promises on error
      batch.forEach(request => request.reject(error));
    }
  }

  async processBatchRequests(batch) {
    // Example: Batch embedding generation
    const texts = batch.map(req => req.text);
    
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: texts,
    });

    return response.data.map(item => item.embedding);
  }

  // Optimized API call with caching and batching
  async optimizedCall(text, operation) {
    const cacheKey = `${operation}:${text}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    // Add to batch if it's a batchable operation
    if (operation === 'embedding') {
      return new Promise((resolve, reject) => {
        this.addToBatch({ text, resolve, reject });
      });
    }

    // Single request for non-batchable operations
    const result = await this.singleCall(text, operation);
    this.cacheWithTTL(cacheKey, result);
    
    return result;
  }
}
```

## Exercise

**Build an AI-Powered Content Analysis Tool**

Create a tool that analyzes text for sentiment, topics, and key insights:

```javascript
// utils/textAnalyzer.js
class TextAnalyzer {
  constructor(openai) {
    this.openai = openai;
  }

  async analyzeSentiment(text) {
    const prompt = `
    Analyze the sentiment of this text and respond with a JSON object:
    Text: "${text}"
    
    Response format:
    {
      "sentiment": "positive|negative|neutral",
      "confidence": 0.0-1.0,
      "emotions": ["emotion1", "emotion2"],
      "explanation": "brief explanation"
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async extractTopics(text, maxTopics = 5) {
    const prompt = `
    Extract the main topics from this text and respond with a JSON array:
    Text: "${text}"
    
    Response format:
    ["topic1", "topic2", "topic3", "topic4", "topic5"]
    
    Limit to ${maxTopics} most important topics.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateInsights(text) {
    const prompt = `
    Analyze this text and provide key insights in JSON format:
    Text: "${text}"
    
    Response format:
    {
      "summary": "brief summary",
      "keyPoints": ["point1", "point2", "point3"],
      "implications": ["implication1", "implication2"],
      "recommendations": ["recommendation1", "recommendation2"]
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // Comprehensive analysis
  async fullAnalysis(text) {
    const [sentiment, topics, insights] = await Promise.all([
      this.analyzeSentiment(text),
      this.extractTopics(text),
      this.generateInsights(text)
    ]);

    return {
      sentiment,
      topics,
      insights,
      textLength: text.length,
      wordCount: text.split(/\s+/).length,
      analyzedAt: new Date().toISOString()
    };
  }
}

// React component for the analysis tool
const TextAnalysisTool = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const analyzer = new TextAnalyzer(openai);
      const result = await analyzer.fullAnalysis(text);
      setAnalysis(result);
    } catch (err) {
      setError('Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Text Analysis Tool</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
        style={{ 
          width: '100%', 
          height: 150, 
          marginBottom: 10,
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 5
        }}
      />
      
      <button 
        onClick={analyzeText}
        disabled={loading || !text.trim()}
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
        {loading ? 'Analyzing...' : 'Analyze Text'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: 20 }}>
          {error}
        </div>
      )}

      {analysis && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: 15, 
          borderRadius: 5,
          marginBottom: 20 
        }}>
          <h3>Analysis Results</h3>
          
          <div style={{ marginBottom: 15 }}>
            <h4>Sentiment</h4>
            <p><strong>Sentiment:</strong> {analysis.sentiment.sentiment}</p>
            <p><strong>Confidence:</strong> {(analysis.sentiment.confidence * 100).toFixed(1)}%</p>
            <p><strong>Emotions:</strong> {analysis.sentiment.emotions.join(', ')}</p>
          </div>

          <div style={{ marginBottom: 15 }}>
            <h4>Topics</h4>
            <ul>
              {analysis.topics.map((topic, i) => (
                <li key={i}>{topic}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Key Insights</h4>
            <p><strong>Summary:</strong> {analysis.insights.summary}</p>
            <p><strong>Key Points:</strong></p>
            <ul>
              {analysis.insights.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
```

**Your Tasks:**
1. Implement the text analyzer with proper error handling
2. Add caching to reduce API costs
3. Create a visualization for sentiment analysis results
4. Implement text preprocessing for better accuracy
5. Add support for multiple languages

This exercise teaches you AI fundamentals, API integration, data processing, and user interface design for AI-powered applications.

---

**Next Up**: Master the art of Prompt Engineering! Prompt Engineering
