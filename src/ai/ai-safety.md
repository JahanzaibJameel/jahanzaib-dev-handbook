# AI Safety & Ethics

## What is AI Safety & Ethics?

AI Safety & Ethics encompasses the principles, practices, and guidelines for developing and deploying artificial intelligence systems responsibly. It focuses on ensuring AI systems are safe, fair, transparent, and beneficial to humanity.

## Example

### Content Moderation System

```javascript
// utils/AISafetyFilter.js
class AISafetyFilter {
  constructor() {
    this.prohibitedContent = {
      hateSpeech: [
        'racial slurs', 'discriminatory language', 'hate symbols',
        'threats against protected groups'
      ],
      violence: [
        'graphic violence', 'self-harm instructions', 'terrorism',
        'weapon manufacturing instructions'
      ],
      illegalActivities: [
        'drug manufacturing', 'hacking tutorials', 'fraud schemes',
        'copyright infringement instructions'
      ],
      personalInfo: [
        'ssn', 'credit card numbers', 'private addresses',
        'medical records', 'password sharing'
      ]
    };
  }

  async filterContent(input, output) {
    const safetyChecks = [
      this.checkHateSpeech(input, output),
      this.checkViolence(input, output),
      this.checkIllegalActivities(input, output),
      this.checkPersonalInfo(input, output),
      this.checkBias(output)
    ];

    const results = await Promise.all(safetyChecks);
    const violations = results.filter(result => result.hasViolation);

    return {
      isSafe: violations.length === 0,
      violations: violations,
      filteredContent: violations.length > 0 ? 
        this.sanitizeOutput(output, violations) : output
    };
  }

  checkHateSpeech(input, output) {
    const hateSpeechPatterns = this.prohibitedContent.hateSpeech;
    const combinedText = (input + ' ' + output).toLowerCase();
    
    const detectedPatterns = hateSpeechPatterns.filter(pattern => 
      combinedText.includes(pattern.toLowerCase())
    );

    return {
      type: 'hate_speech',
      hasViolation: detectedPatterns.length > 0,
      patterns: detectedPatterns,
      severity: detectedPatterns.length > 2 ? 'high' : 'medium'
    };
  }

  checkBias(output) {
    // Detect gender, racial, or other biases
    const biasIndicators = [
      /women are|men are|girls are|boys are/gi,
      /all \w+ people are/gi,
      /typical \w+ behavior/gi
    ];

    const detectedBias = biasIndicators.map(pattern => {
      const matches = output.match(pattern);
      return matches ? matches.length : 0;
    }).reduce((sum, count) => sum + count, 0);

    return {
      type: 'bias',
      hasViolation: detectedBias > 0,
      count: detectedBias,
      severity: detectedBias > 3 ? 'high' : detectedBias > 0 ? 'medium' : 'low'
    };
  }

  sanitizeOutput(output, violations) {
    let sanitized = output;
    
    violations.forEach(violation => {
      if (violation.type === 'hate_speech') {
        sanitized = sanitized.replace(/hate speech detected/gi, '[CONTENT REMOVED]');
      }
      if (violation.type === 'personal_info') {
        sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REMOVED]');
        sanitized = sanitized.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD REMOVED]');
      }
    });

    return sanitized + '\n\n[Some content has been filtered for safety]';
  }
}
```

### Ethical AI Implementation

```javascript
// services/EthicalAIService.js
class EthicalAIService {
  constructor() {
    this.safetyFilter = new AISafetyFilter();
    this.usageLimits = {
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000
    };
    this.userUsage = new Map();
  }

  async generateResponse(prompt, options = {}) {
    const userId = options.userId || 'anonymous';
    
    // Check usage limits
    if (!this.checkUsageLimits(userId)) {
      throw new Error('Usage limit exceeded. Please try again later.');
    }

    // Add safety guidelines to prompt
    const safePrompt = this.addSafetyGuidelines(prompt);
    
    try {
      const response = await this.callAI(safePrompt, options);
      
      // Filter the response for safety
      const safetyCheck = await this.safetyFilter.filterContent(prompt, response);
      
      if (!safetyCheck.isSafe) {
        // Log violation for monitoring
        this.logSafetyViolation(userId, safetyCheck.violations);
        
        // Return safe response
        return safetyCheck.filteredContent;
      }
      
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Unable to generate response at this time.');
    }
  }

  addSafetyGuidelines(prompt) {
    return `
Please respond to the following request while adhering to these ethical guidelines:

1. Be helpful and harmless
2. Do not provide instructions for illegal activities
3. Do not generate hate speech or discriminatory content
4. Do not share personal information
5. Avoid making harmful assumptions about groups of people
6. If a request is harmful, politely decline and explain why

User Request: ${prompt}

Remember: Your response should be safe, ethical, and beneficial.
`;
  }

  checkUsageLimits(userId) {
    const now = Date.now();
    const usage = this.userUsage.get(userId) || {
      requests: [],
      lastReset: now
    };

    // Clean old requests (older than 24 hours)
    usage.requests = usage.requests.filter(timestamp => 
      now - timestamp < 24 * 60 * 60 * 1000
    );

    // Check limits
    const minuteAgo = now - 60 * 1000;
    const hourAgo = now - 60 * 60 * 1000;
    const dayAgo = now - 24 * 60 * 60 * 1000;

    const requestsPerMinute = usage.requests.filter(t => t > minuteAgo).length;
    const requestsPerHour = usage.requests.filter(t => t > hourAgo).length;
    const requestsPerDay = usage.requests.filter(t => t > dayAgo).length;

    if (requestsPerMinute >= this.usageLimits.requestsPerMinute ||
        requestsPerHour >= this.usageLimits.requestsPerHour ||
        requestsPerDay >= this.usageLimits.requestsPerDay) {
      return false;
    }

    // Add current request
    usage.requests.push(now);
    this.userUsage.set(userId, usage);
    
    return true;
  }

  logSafetyViolation(userId, violations) {
    const violationLog = {
      timestamp: new Date().toISOString(),
      userId: userId,
      violations: violations,
      severity: violations.some(v => v.severity === 'high') ? 'high' : 'medium'
    };

    // In production, send to monitoring service
    console.warn('Safety violation detected:', violationLog);
    
    // Could integrate with services like Sentry, DataDog, etc.
  }
}
```

## Real Use Case

### Content Moderation at Scale

**Facebook** and **Twitter** use AI safety systems to moderate billions of posts:

```javascript
// services/ContentModerator.js
class ContentModerator {
  constructor() {
    this.aiSafety = new AISafetyFilter();
    this.humanReviewQueue = [];
    this.automatedActions = {
      low: 'flag_for_review',
      medium: 'remove_content',
      high: 'suspend_user'
    };
  }

  async moderateContent(content, userContext) {
    const moderationResult = await this.analyzeContent(content, userContext);
    
    switch (moderationResult.action) {
      case 'approve':
        return { status: 'approved', content };
      
      case 'flag_for_review':
        await this.queueForHumanReview(content, moderationResult);
        return { status: 'pending_review', content };
      
      case 'remove_content':
        await this.removeContent(content, moderationResult);
        return { status: 'removed', reason: moderationResult.reason };
      
      case 'suspend_user':
        await this.suspendUser(userContext.userId, moderationResult);
        return { status: 'user_suspended', reason: moderationResult.reason };
      
      default:
        return { status: 'approved', content };
    }
  }

  async analyzeContent(content, userContext) {
    const safetyCheck = await this.aiSafety.filterContent('', content);
    
    if (!safetyCheck.isSafe) {
      const highSeverityViolations = safetyCheck.violations.filter(v => v.severity === 'high');
      const mediumSeverityViolations = safetyCheck.violations.filter(v => v.severity === 'medium');
      
      if (highSeverityViolations.length > 0) {
        return {
          action: this.automatedActions.high,
          reason: 'High severity safety violations detected',
          violations: highSeverityViolations
        };
      } else if (mediumSeverityViolations.length > 2) {
        return {
          action: this.automatedActions.medium,
          reason: 'Multiple medium severity violations',
          violations: mediumSeverityViolations
        };
      } else {
        return {
          action: this.automatedActions.low,
          reason: 'Content flagged for human review',
          violations: safetyCheck.violations
        };
      }
    }

    // Check for context-specific issues
    const contextCheck = this.analyzeUserContext(userContext);
    if (contextCheck.needsReview) {
      return {
        action: 'flag_for_review',
        reason: contextCheck.reason
      };
    }

    return { action: 'approve' };
  }

  analyzeUserContext(userContext) {
    // Check user's history, reputation, etc.
    if (userContext.violationCount > 5) {
      return { needsReview: true, reason: 'User has history of violations' };
    }
    
    if (userContext.accountAge < 7) {
      return { needsReview: true, reason: 'New account - extra review required' };
    }

    return { needsReview: false };
  }
}
```

## Pro Tip

**Implement Transparency and Explainability**

```javascript
// utils/AITransparency.js
class AITransparency {
  constructor() {
    this.modelInfo = {
      'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        version: '0613',
        trainingData: 'Up to September 2021',
        limitations: 'May not have information about recent events',
        capabilities: ['text generation', 'analysis', 'translation']
      },
      'gpt-4': {
        name: 'GPT-4',
        version: '0613',
        trainingData: 'Up to September 2021',
        limitations: 'May not have information about recent events',
        capabilities: ['advanced reasoning', 'code generation', 'analysis']
      }
    };
  }

  generateTransparencyReport(request, response, model) {
    return {
      timestamp: new Date().toISOString(),
      model: this.modelInfo[model] || { name: 'Unknown Model' },
      requestMetadata: {
        inputLength: request.length,
        estimatedTokens: this.estimateTokens(request),
        requestType: this.categorizeRequest(request)
      },
      responseMetadata: {
        outputLength: response.length,
        estimatedTokens: this.estimateTokens(response),
        confidenceLevel: this.estimateConfidence(response)
      },
      safetyChecks: {
        contentFiltered: false,
        biasDetected: false,
        personalInfoDetected: false
      },
      limitations: [
        'AI responses may contain inaccuracies',
        'Information may be outdated',
        'AI does not have personal experiences',
        'Critical decisions should be verified'
      ]
    };
  }

  addTransparencyFooter(response) {
    const footer = `
---
*This response was generated by an AI system. Please verify important information and use critical judgment.*
*AI Limitations: May contain errors, outdated information, or biases. Always fact-check critical information.*
`;
    return response + footer;
  }

  categorizeRequest(request) {
    const categories = {
      'factual': ['what is', 'who is', 'when did', 'where is', 'how does'],
      'creative': ['write', 'create', 'generate', 'imagine'],
      'coding': ['code', 'program', 'debug', 'function', 'algorithm'],
      'analysis': ['analyze', 'compare', 'evaluate', 'explain'],
      'personal': ['i need', 'help me', 'my', 'i am']
    };

    const lowerRequest = request.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerRequest.includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  estimateConfidence(response) {
    // Simple confidence estimation based on response characteristics
    const indicators = {
      high: response.length > 200 && response.includes('specific'),
      medium: response.length > 50 && response.includes('generally'),
      low: response.length < 50 || response.includes('uncertain')
    };

    for (const [level, condition] of Object.entries(indicators)) {
      if (condition) return level;
    }
    
    return 'medium';
  }
}
```

## Exercise

**Build an Ethical AI Application with Safety Features**

Create a complete AI application with comprehensive safety measures:

```javascript
// App.js - Ethical AI Chat Application
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import ChatInterface from './components/ChatInterface';
import EthicalAIService from './services/EthicalAIService';
import AITransparency from './utils/AITransparency';

const EthicalAIApp = () => {
  const [aiService] = useState(() => new EthicalAIService());
  const [transparency] = useState(() => new AITransparency());
  const [showTransparency, setShowTransparency] = useState(false);
  const [lastTransparencyReport, setLastTransparencyReport] = useState(null);

  const handleSendMessage = async (message, userId) => {
    try {
      const response = await aiService.generateResponse(message, { userId });
      
      // Generate transparency report
      const report = transparency.generateTransparencyReport(
        message, 
        response, 
        'gpt-3.5-turbo'
      );
      
      setLastTransparencyReport(report);
      
      return transparency.addTransparencyFooter(response);
    } catch (error) {
      if (error.message.includes('Usage limit')) {
        Alert.alert(
          'Usage Limit',
          'You\'ve reached the usage limit. Please try again later.',
          [{ text: 'OK' }]
        );
      } else if (error.message.includes('safety')) {
        Alert.alert(
          'Content Warning',
          'Your request was flagged for safety concerns. Please rephrase your request.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'Unable to process your request. Please try again.',
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  };

  const showTransparencyInfo = () => {
    if (lastTransparencyReport) {
      Alert.alert(
        'AI Transparency Report',
        `Model: ${lastTransparencyReport.model.name}\n` +
        `Request Type: ${lastTransparencyReport.requestMetadata.requestType}\n` +
        `Confidence: ${lastTransparencyReport.responseMetadata.confidenceLevel}\n` +
        `Safety Checks: ${lastTransparencyReport.safetyChecks.contentFiltered ? 'Content Filtered' : 'Passed'}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ChatInterface
        onSendMessage={handleSendMessage}
        onTransparencyRequest={showTransparencyInfo}
      />
    </View>
  );
};

export default EthicalAIApp;
```

**Your Tasks:**
1. Implement the complete ethical AI application
2. Add comprehensive content filtering
3. Create user usage tracking and limits
4. Implement transparency reporting
5. Add bias detection and mitigation
6. Create a user consent system
7. Implement audit logging for compliance

This exercise teaches you:
- AI safety principles and implementation
- Content moderation techniques
- Ethical AI development practices
- User protection and privacy
- Transparency and explainability
- Compliance and regulatory considerations

---

**Next Up**: Learn about full-stack development with modern web technologies! Full-Stack Development
