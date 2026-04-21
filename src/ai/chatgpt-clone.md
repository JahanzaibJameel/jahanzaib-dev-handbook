# Build: ChatGPT Clone

## What is it?

A ChatGPT Clone is a conversational AI application that mimics the functionality of OpenAI's ChatGPT interface. It provides real-time conversations with AI models, maintains conversation history, and offers a user-friendly chat interface.

## Example

### Core Chat Component

```javascript
// components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useAI } from '../hooks/useAI';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatInterface = ({ systemPrompt = "You are a helpful assistant." }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const { generateResponse, loading } = useAI();

  useEffect(() => {
    // Add welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build conversation context
      const conversationHistory = messages
        .slice(-10) // Keep last 10 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const prompt = `${systemPrompt}\n\nConversation History:\n${conversationHistory}\n\nuser: ${inputText}\nassistant:`;

      const response = await generateResponse(prompt, {
        model: 'gpt-3.5-turbo',
        maxTokens: 1000,
        temperature: 0.7
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }) => (
    <MessageBubble
      message={item}
      isUser={item.role === 'user'}
    />
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={{ flex: 1, padding: 16 }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
        
        {isTyping && <TypingIndicator />}
        
        <View style={{ 
          flexDirection: 'row', 
          padding: 16, 
          borderTopWidth: 1, 
          borderTopColor: '#e0e0e0' 
        }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginRight: 8,
              maxHeight: 100
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            editable={!loading}
          />
          
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 8,
              justifyContent: 'center',
              opacity: (inputText.trim() && !loading) ? 1 : 0.5
            }}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              {loading ? '...' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInterface;
```

### Message Bubble Component

```javascript
// components/MessageBubble.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isUser }) => {
  return (
    <View style={[
      styles.messageContainer,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        message.isError && styles.errorBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 4,
    alignItems: 'flex-start'
  },
  userContainer: {
    alignItems: 'flex-end'
  },
  assistantContainer: {
    alignItems: 'flex-start'
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 8
  },
  userBubble: {
    backgroundColor: '#007AFF'
  },
  assistantBubble: {
    backgroundColor: '#f0f0f0'
  },
  errorBubble: {
    backgroundColor: '#ffebee'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20
  },
  userText: {
    color: 'white'
  },
  assistantText: {
    color: '#333'
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginHorizontal: 12
  }
});

export default MessageBubble;
```

## Real Use Case

### Customer Service Chatbot

**Zendesk** and **Intercom** use similar chat interfaces for customer support:

```javascript
// services/CustomerServiceBot.js
class CustomerServiceBot {
  constructor() {
    this.systemPrompt = `
You are a helpful customer service representative for TechCorp.

Company Information:
- We sell software development tools
- Pricing: Basic $29/month, Pro $99/month, Enterprise custom
- Support: Email support for all, priority support for Pro+
- Refund policy: 30-day money-back guarantee

Guidelines:
- Always be empathetic and professional
- Provide accurate information about our products
- If you don't know something, admit it and offer to escalate
- Try to resolve issues on first contact
- Keep responses concise but helpful

Common Issues:
1. Login problems: Check email/password, suggest password reset
2. Billing questions: Direct to billing@techcorp.com
3. Technical issues: Ask for error messages and system info
4. Feature requests: Thank customer and add to feature request queue
`;
  }

  async handleCustomerMessage(message, customerContext) {
    const contextPrompt = `
Customer Context:
- Plan: ${customerContext.plan || 'Unknown'}
- Account age: ${customerContext.accountAge || 'Unknown'}
- Previous issues: ${customerContext.previousIssues || 'None'}

Current Message: ${message}

Please provide a helpful response following our guidelines.
`;

    return await this.generateResponse(contextPrompt);
  }

  async generateResponse(prompt) {
    // AI API call implementation
    return "AI response would go here";
  }
}
```

## Pro Tip

**Implement Conversation Persistence and Context Management**

```javascript
// utils/ConversationManager.js
class ConversationManager {
  constructor(maxMessages = 50) {
    this.maxMessages = maxMessages;
    this.conversations = new Map();
  }

  // Save conversation to local storage
  async saveConversation(userId, messages) {
    try {
      const conversationData = {
        userId,
        messages: messages.slice(-this.maxMessages), // Keep only recent messages
        lastUpdated: new Date().toISOString()
      };

      // Save to AsyncStorage (React Native) or localStorage (Web)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`chat_${userId}`, JSON.stringify(conversationData));
      } else {
        // React Native AsyncStorage implementation
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.setItem(`chat_${userId}`, JSON.stringify(conversationData));
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }

  // Load conversation from storage
  async loadConversation(userId) {
    try {
      let conversationData;
      
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`chat_${userId}`);
        conversationData = stored ? JSON.parse(stored) : null;
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        const stored = await AsyncStorage.getItem(`chat_${userId}`);
        conversationData = stored ? JSON.parse(stored) : null;
      }

      return conversationData?.messages || [];
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return [];
    }
  }

  // Clear conversation history
  async clearConversation(userId) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`chat_${userId}`);
      } else {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        await AsyncStorage.removeItem(`chat_${userId}`);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  }

  // Build context for AI model
  buildContext(messages, systemPrompt, maxTokens = 2000) {
    let context = systemPrompt + '\n\n';
    let tokenCount = this.estimateTokens(context);

    // Add messages in reverse order, staying within token limit
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const messageText = `${message.role}: ${message.content}\n`;
      const messageTokens = this.estimateTokens(messageText);

      if (tokenCount + messageTokens > maxTokens) {
        break;
      }

      context = messageText + context;
      tokenCount += messageTokens;
    }

    return context;
  }

  // Simple token estimation (rough approximation)
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }
}
```

## Exercise

**Build a Complete ChatGPT Clone with Advanced Features**

Create a full-featured chat application with the following components:

```javascript
// App.js - Main application
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ChatInterface from './components/ChatInterface';
import ConversationManager from './utils/ConversationManager';
import SettingsScreen from './screens/SettingsScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [settings, setSettings] = useState({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are a helpful assistant.'
  });

  const conversationManager = new ConversationManager();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'chat':
        return (
          <ChatInterface
            settings={settings}
            conversationManager={conversationManager}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onSettingsChange={setSettings}
            onBack={() => setCurrentScreen('chat')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ChatGPT Clone</Text>
        {currentScreen === 'chat' && (
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setCurrentScreen('settings')}
          >
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  settingsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  content: {
    flex: 1
  }
});

export default App;
```

**Your Tasks:**
1. Implement the complete ChatGPT clone with all components
2. Add conversation history persistence
3. Create a settings screen for model configuration
4. Implement message copying and sharing
5. Add voice input capability (optional advanced feature)
6. Create conversation export functionality
7. Implement multiple chat sessions support

This exercise teaches you:
- Building complex React Native applications
- AI API integration and error handling
- State management for chat applications
- Local storage and data persistence
- User interface design for chat apps
- Real-time communication patterns

---

**Next Up**: Learn about AI safety and ethical considerations! AI Safety & Ethics
