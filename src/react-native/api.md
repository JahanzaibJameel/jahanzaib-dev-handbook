# API Integration

Learn how to integrate REST APIs and GraphQL in React Native applications, handle data fetching, manage loading states, and implement proper error handling.

## **What is API Integration?**

API integration in React Native involves connecting your mobile app to backend services to fetch, send, and synchronize data. This enables your app to interact with databases, third-party services, and other systems.

### **Key Concepts**
- **HTTP Requests**: GET, POST, PUT, DELETE operations
- **Data Formats**: JSON, XML, form data
- **Authentication**: API keys, tokens, OAuth
- **Error Handling**: Network errors, server errors, timeouts
- **State Management**: Loading, success, error states

---

## **REST API Integration**

### **Using Fetch API**

The built-in `fetch` API is the most common way to make HTTP requests in React Native.

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
};
```

### **POST Request Example**

```javascript
const createUser = async (userData) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    const newUser = await response.json();
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Usage
const handleCreateUser = async () => {
  try {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    };
    
    const newUser = await createUser(userData);
    // Update state or navigate
  } catch (error) {
    // Handle error
  }
};
```

---

## **Using Axios Library**

Axios is a popular HTTP client library that provides additional features and better error handling.

### **Installation**
```bash
npm install axios
```

### **Basic Usage**

```javascript
import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET request
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    throw error;
  }
};

// POST request
const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
```

### **Request and Response Interceptors**

```javascript
// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request sent:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      logout();
    }
    return Promise.reject(error);
  }
);
```

---

## **GraphQL Integration**

### **Using Apollo Client**

Apollo Client is a comprehensive GraphQL client for React Native.

#### **Installation**
```bash
npm install @apollo/client graphql
```

#### **Setup**

```javascript
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: 'https://your-graphql-endpoint.com/graphql',
  cache: new InMemoryCache(),
});

// Wrap your app with ApolloProvider
const App = () => {
  return (
    <ApolloProvider client={client}>
      <YourApp />
    </ApolloProvider>
  );
};
```

#### **GraphQL Query Example**

```javascript
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
    }
  }
`;

const UserList = () => {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <ActivityIndicator size="large" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
};
```

#### **GraphQL Mutation Example**

```javascript
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

const CreateUserForm = () => {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async () => {
    try {
      await createUser({
        variables: { input: formData },
      });
      // Handle success
      console.log('User created successfully');
    } catch (error) {
      // Handle error
      console.error('Error creating user:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData({...formData, phone: text})}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button
        title={loading ? "Creating..." : "Create User"}
        onPress={handleSubmit}
        disabled={loading}
      />
      {error && <Text style={{ color: 'red' }}>Error: {error.message}</Text>}
    </View>
  );
};
```

---

## **Authentication & Authorization**

### **API Key Authentication**

```javascript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'X-API-Key': 'your-api-key-here',
  },
});
```

### **Bearer Token Authentication**

```javascript
const getAuthenticatedData = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    
    const response = await fetch('https://api.example.com/protected-data', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, handle refresh or logout
        await handleTokenRefresh();
      }
      throw new Error('Authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching protected data:', error);
    throw error;
  }
};
```

### **OAuth 2.0 Flow**

```javascript
import { AuthSession } from 'expo-auth-session';

const handleOAuthLogin = async () => {
  try {
    // Configure OAuth
    const discovery = await AuthSession.fetchDiscoveryAsync('https://oauth.example.com');
    const request = new AuthSession.AuthRequest({
      clientId: 'your-client-id',
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'your-app-scheme',
      }),
    });

    // Open OAuth flow
    const result = await request.promptAsync(discovery);
    
    if (result.type === 'success') {
      // Exchange code for token
      const tokenResponse = await exchangeCodeForToken(result.params.code);
      await AsyncStorage.setItem('authToken', tokenResponse.access_token);
      return tokenResponse;
    }
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
};
```

---

## **Error Handling Strategies**

### **Custom Error Handler**

```javascript
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new ApiError('Bad Request', status, data);
      case 401:
        throw new ApiError('Unauthorized', status, data);
      case 403:
        throw new ApiError('Forbidden', status, data);
      case 404:
        throw new ApiError('Not Found', status, data);
      case 500:
        throw new ApiError('Server Error', status, data);
      default:
        throw new ApiError('Unknown Error', status, data);
    }
  } else if (error.request) {
    // Network error
    throw new ApiError('Network Error', 0, null);
  } else {
    // Other error
    throw new ApiError(error.message, 0, null);
  }
};
```

### **Retry Logic**

```javascript
const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      lastError = new Error(`Server error: ${response.status}`);
    } catch (error) {
      lastError = error;
      
      // Don't retry on network errors for last attempt
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw lastError;
};
```

---

## **Caching Strategies**

### **Simple In-Memory Cache**

```javascript
class SimpleCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

const getCachedData = async (url) => {
  const cacheKey = url;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  cache.set(cacheKey, data);
  
  return data;
};
```

### **AsyncStorage Cache**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCachedData = async (url, ttl = 5 * 60 * 1000) => {
  const cacheKey = `cache_${url}`;
  const cachedItem = await AsyncStorage.getItem(cacheKey);
  
  if (cachedItem) {
    const { data, timestamp } = JSON.parse(cachedItem);
    
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  await AsyncStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now(),
  }));
  
  return data;
};
```

---

## **Real-Time Data with WebSockets**

### **WebSocket Connection**

```javascript
import { useEffect, useState } from 'react';

const useWebSocket = (url) => {
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const websocket = new WebSocket(url);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError(error);
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws && connected) {
      ws.send(JSON.stringify(message));
    }
  };

  return { data, error, connected, sendMessage };
};

// Usage
const ChatComponent = () => {
  const { data, error, connected, sendMessage } = useWebSocket('ws://localhost:8080');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    sendMessage({ text: message, timestamp: Date.now() });
    setMessage('');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Connected: {connected ? 'Yes' : 'No'}</Text>
      
      {error && <Text style={{ color: 'red' }}>Error: {error.message}</Text>}
      
      {data && (
        <View style={{ marginVertical: 10 }}>
          <Text>Received: {JSON.stringify(data)}</Text>
        </View>
      )}
      
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      
      <Button
        title="Send"
        onPress={handleSendMessage}
        disabled={!connected}
      />
    </View>
  );
};
```

---

## **File Upload**

### **Uploading Files**

```javascript
const uploadFile = async (fileUri, fileName) => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    type: 'image/jpeg', // or appropriate MIME type
    name: fileName,
  });

  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Usage with ImagePicker
import * as ImagePicker from 'expo-image-picker';

const handleImageUpload = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadResult = await uploadFile(result.uri, 'image.jpg');
      console.log('Upload successful:', uploadResult);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};
```

---

## **API Testing**

### **Mock API for Testing**

```javascript
// Mock API service for testing
const mockApi = {
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ],

  getUsers: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockApi.users), 1000);
    });
  },

  createUser: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = { id: Date.now(), ...userData };
        mockApi.users.push(newUser);
        resolve(newUser);
      }, 500);
    });
  },
};

// Test component
const TestUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await mockApi.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
};
```

---

## **Best Practices**

### **Performance Optimization**
- Use connection pooling for multiple requests
- Implement proper caching strategies
- Debounce search requests
- Use pagination for large datasets
- Optimize image uploads with compression

### **Security**
- Never store sensitive data in plain text
- Use HTTPS for all API communications
- Implement proper authentication and authorization
- Validate and sanitize all inputs
- Handle sensitive data securely

### **Error Handling**
- Implement comprehensive error handling
- Provide meaningful error messages to users
- Implement retry logic for failed requests
- Log errors for debugging
- Handle network connectivity issues

### **Code Organization**
- Create separate API service files
- Use constants for API endpoints
- Implement proper TypeScript types
- Use environment variables for configuration
- Document API contracts

---

## **Real Use Case**

### **E-commerce Product Catalog**

```javascript
// API service
class ProductService {
  constructor() {
    this.baseURL = 'https://api.ecommerce.com';
  }

  async getProducts(category = null, page = 1, limit = 20) {
    try {
      let url = `${this.baseURL}/products?page=${page}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductDetails(productId) {
    try {
      const response = await fetch(`${this.baseURL}/products/${productId}`);
      if (!response.ok) throw new Error('Failed to fetch product details');

      const product = await response.json();
      return product;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }

  async searchProducts(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const response = await fetch(`${this.baseURL}/products/search?${params}`);
      if (!response.ok) throw new Error('Search failed');

      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

// React component
const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const productService = new ProductService();

  const loadProducts = async (pageNum = 1, reset = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await productService.getProducts(null, pageNum);
      
      if (reset) {
        setProducts(result.products);
      } else {
        setProducts(prev => [...prev, ...result.products]);
      }
      
      setHasMore(result.hasMore);
      setPage(pageNum);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = () => {
    if (hasMore && !loading) {
      loadProducts(page + 1);
    }
  };

  useEffect(() => {
    loadProducts(1, true);
  }, []);

  const renderProduct = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1 }}>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={{ width: '100%', height: 200, marginBottom: 10 }}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
      <Text style={{ color: 'green', fontSize: 18 }}>${item.price}</Text>
      <Text style={{ color: 'gray' }}>{item.description}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {error && (
        <View style={{ padding: 10, backgroundColor: '#ffebee' }}>
          <Text style={{ color: 'red' }}>Error: {error}</Text>
        </View>
      )}
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" /> : null
        }
        ListEmptyComponent={
          !loading && products.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 50 }}>
              No products found
            </Text>
          ) : null
        }
      />
    </View>
  );
};
```

---

## **Pro Tip**

**Implement request deduplication to prevent duplicate API calls for the same data. Create a request cache that tracks ongoing requests and returns the same promise to multiple callers. This is especially useful in React Native where components might re-render and trigger the same API calls multiple times.**

```javascript
class RequestCache {
  constructor() {
    this.cache = new Map();
  }

  async get(key, requestFn) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const promise = requestFn();
    this.cache.set(key, promise);

    // Clear cache after request completes
    promise.finally(() => {
      this.cache.delete(key);
    });

    return promise;
  }
}

const requestCache = new RequestCache();

const fetchUserWithCache = (userId) => {
  return requestCache.get(`user_${userId}`, () => {
    return fetch(`https://api.example.com/users/${userId}`)
      .then(response => response.json());
  });
};
```

---

## **Exercise / Mini Task**

**Task**: Create a simple weather app that fetches weather data from a public API and displays the current weather and forecast.

**Requirements**:
1. Use the OpenWeatherMap API (free tier available)
2. Display current temperature, weather conditions, and location
3. Show a 5-day forecast
4. Implement proper error handling
5. Add loading states
6. Cache weather data for 10 minutes
7. Handle network connectivity issues

**Bonus**:
- Add search functionality for different cities
- Implement pull-to-refresh
- Add weather icons based on conditions
- Show last updated time

---

*API integration is a crucial skill for React Native development. Master these concepts to build robust, responsive applications that can communicate effectively with backend services.*
