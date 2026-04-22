# Integration Testing

Integration testing verifies that different parts of your application work together correctly. It tests the interaction between components, services, databases, and external APIs.

## 🎯 What is Integration Testing?

Integration testing sits between unit testing and end-to-end testing. It combines multiple units to test their interactions and ensure they work together as expected.

### Why Integration Testing Matters

- **Catch Integration Issues**: Find problems when components interact
- **Database Integration**: Verify data flow between app and database
- **API Integration**: Test communication with external services
- **Component Integration**: Ensure UI components work together
- **Real Environment**: Test with actual dependencies

## 🛠️ Integration Testing Tools

### React Native Testing

```bash
npm install --save-dev @testing-library/react-native jest
```

### React/Next.js Testing

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Node.js API Testing

```bash
npm install --save-dev supertest mongodb-memory-server
```

## 🧪 React Native Integration Testing

### Testing Component Integration

```javascript
// __tests__/integration/LoginFlow.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import LoginScreen from '../../src/screens/LoginScreen';
import store from '../../src/store';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
}));

describe('Login Flow Integration', () => {
  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <NavigationContainer>
          {component}
        </NavigationContainer>
      </Provider>
    );
  };

  it('completes login flow successfully', async () => {
    const mockResponse = {
      user: { id: 1, name: 'John', email: 'john@example.com' },
      token: 'mock-jwt-token'
    };

    // Mock API call
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const { getByPlaceholderText, getByText } = renderWithProviders(
      <LoginScreen navigation={mockNavigation} />
    );

    // Enter credentials
    fireEvent.changeText(getByPlaceholderText('Email'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');

    // Submit form
    fireEvent.press(getByText('Login'));

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });

    // Verify token storage
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'auth_token',
      mockResponse.token
    );
  });
});
```

## 🧪 Node.js API Integration Testing

### Testing Database Integration

```javascript
// __tests__/integration/userController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('User Controller Integration', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('POST /api/users', () => {
    it('creates user and saves to database', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Verify response
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);

      // Verify database
      const userInDb = await User.findOne({ email: userData.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb.name).toBe(userData.name);
    });
  });
});
```

## 🔧 Integration Testing Best Practices

### Test Organization

```text
__tests__/
├── integration/
│   ├── auth/
│   │   ├── loginFlow.test.js
│   │   └── protectedRoutes.test.js
│   ├── api/
│   │   ├── userController.test.js
│   │   └── fileUpload.test.js
│   └── components/
│       ├── shoppingCart.test.js
│       └── userProfile.test.js
```

### Test Data Management

```javascript
// __tests__/utils/testData.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export class TestDatabase {
  async connect() {
    this.server = await MongoMemoryServer.create();
    const uri = this.server.getUri();
    this.connection = await mongoose.connect(uri);
  }

  async disconnect() {
    await mongoose.disconnect();
    await this.server.stop();
  }

  async clear() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

## **API Integration Testing**

### **Testing External API Integration**

```javascript
// __tests__/integration/weatherService.test.js
import WeatherService from '../../src/services/WeatherService';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API server
const server = setupServer(
  rest.get('https://api.openweathermap.org/data/2.5/weather', (req, res, ctx) => {
    const city = req.url.searchParams.get('q');
    
    if (city === 'London') {
      return res(
        ctx.json({
          name: 'London',
          main: { temp: 15, humidity: 70 },
          weather: [{ main: 'Clouds', description: 'cloudy' }]
        })
      );
    }
    
    if (city === 'InvalidCity') {
      return res(
        ctx.status(404),
        ctx.json({ message: 'city not found' })
      );
    }
    
    return res(
      ctx.status(500),
      ctx.json({ message: 'Internal server error' })
    );
  })
);

describe('WeatherService Integration', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches weather data successfully', async () => {
    const weather = await WeatherService.getWeather('London');
    
    expect(weather.name).toBe('London');
    expect(weather.main.temp).toBe(15);
    expect(weather.weather[0].main).toBe('Clouds');
  });

  it('handles city not found error', async () => {
    await expect(WeatherService.getWeather('InvalidCity'))
      .rejects.toThrow('city not found');
  });

  it('handles server errors', async () => {
    await expect(WeatherService.getWeather('ServerError'))
      .rejects.toThrow('Internal server error');
  });
});

### **Testing File Upload Integration**

```javascript
// __tests__/integration/fileUpload.test.js
import request from 'supertest';
import path from 'path';
import fs from 'fs';
import app from '../../src/app';

describe('File Upload Integration', () => {
  const testFilePath = path.join(__dirname, '../fixtures/test-image.jpg');
  
  beforeAll(() => {
    // Create test file if it doesn't exist
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'fake image content');
    }
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('uploads file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', testFilePath)
      .expect(200);

    expect(response.body.message).toBe('File uploaded successfully');
    expect(response.body.file).toHaveProperty('filename');
    expect(response.body.file).toHaveProperty('path');
  });

  it('rejects invalid file types', async () => {
    const invalidFile = path.join(__dirname, '../fixtures/invalid-file.txt');
    fs.writeFileSync(invalidFile, 'text content');

    try {
      await request(app)
        .post('/api/upload')
        .attach('file', invalidFile)
        .expect(400);
    } finally {
      fs.unlinkSync(invalidFile);
    }
  });
});

---

## **Component Integration Testing**

### **Testing Multi-Component Workflows**

```javascript
// __tests__/integration/shoppingCart.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import ShoppingCart from '../../src/components/ShoppingCart';
import ProductList from '../../src/components/ProductList';
import store from '../../src/store';

// Mock API service
jest.mock('../../src/services/ProductService', () => ({
  getProducts: jest.fn(),
  addToCart: jest.fn(),
  getCart: jest.fn(),
}));

import ProductService from '../../src/services/ProductService';

describe('Shopping Cart Integration', () => {
  const mockProducts = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 10 },
    { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
  ];

  const mockCart = {
    items: [],
    total: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ProductService.getProducts.mockResolvedValue(mockProducts);
    ProductService.getCart.mockResolvedValue(mockCart);
    ProductService.addToCart.mockResolvedValue({ success: true });
  });

  const renderWithStore = (component) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  it('adds product to cart and updates total', async () => {
    const { getByText, getByTestId } = renderWithStore(
      <>
        <ProductList />
        <ShoppingCart />
      </>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(getByText('Laptop')).toBeTruthy();
    });

    // Add laptop to cart
    fireEvent.press(getByTestId('add-to-cart-1'));

    // Verify cart update
    await waitFor(() => {
      expect(ProductService.addToCart).toHaveBeenCalledWith(1, 1);
    });
  });

  it('shows out of stock message for unavailable products', async () => {
    // Mock out of stock product
    ProductService.getProducts.mockResolvedValue([
      { ...mockProducts[0], stock: 0 }
    ]);

    const { getByText, queryByTestId } = renderWithStore(
      <ProductList />
    );

    await waitFor(() => {
      expect(getByText('Out of Stock')).toBeTruthy();
      expect(queryByTestId('add-to-cart-1')).toBeFalsy();
    });
  });
});

---

## **Database Integration Testing**

### **Testing with Test Database**

```javascript
// __tests__/integration/sequelize.test.js
const { Sequelize, DataTypes } = require('sequelize');
const { setupTestDatabase, teardownTestDatabase } = require('../utils/database');

describe('Database Integration', () => {
  let sequelize;
  let User;
  let Post;

  beforeAll(async () => {
    sequelize = await setupTestDatabase();
    
    // Define models
    User = sequelize.define('User', {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
    });

    Post = sequelize.define('Post', {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    });

    // Set up associations
    User.hasMany(Post);
    Post.belongsTo(User);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await teardownTestDatabase(sequelize);
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Post.destroy({ where: {} });
  });

  it('creates user with posts', async () => {
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    await Post.create({
      title: 'First Post',
      content: 'This is my first post',
      userId: user.id,
    });

    await Post.create({
      title: 'Second Post',
      content: 'This is my second post',
      userId: user.id,
    });

    // Test the association
    const userWithPosts = await User.findByPk(user.id, {
      include: [Post],
    });

    expect(userWithPosts.Posts).toHaveLength(2);
    expect(userWithPosts.Posts[0].title).toBe('First Post');
    expect(userWithPosts.Posts[1].title).toBe('Second Post');
  });

  it('enforces foreign key constraints', async () => {
    await expect(
      Post.create({
        title: 'Orphan Post',
        content: 'This post has no user',
        userId: 999, // Non-existent user ID
      })
    ).rejects.toThrow();
  });
});

### **Testing Database Migrations**

```javascript
// __tests__/integration/migrations.test.js
const { sequelize } = require('../../src/database');
const migrationRunner = require('../../src/migrations/runner');

describe('Database Migrations', () => {
  beforeAll(async () => {
    // Use test database
    process.env.NODE_ENV = 'test';
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('runs all migrations successfully', async () => {
    const migrations = await migrationRunner.runPending();
    
    expect(migrations.length).toBeGreaterThan(0);
    expect(migrations.every(m => m.status === 'executed')).toBe(true);
  });

  it('creates expected tables after migration', async () => {
    await migrationRunner.runPending();
    
    const [results] = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    const tableNames = results.map(r => r.table_name);
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('posts');
    expect(tableNames).toContain('comments');
  });
});

---

## **Advanced Integration Patterns**

### **Contract Testing**

```javascript
// __tests__/integration/contract.test.js
import { Pact } from '@pact-foundation/pact';
import { API } from '../../src/api';

describe('API Contract Testing', () => {
  const provider = new Pact({
    consumer: 'mobile-app',
    provider: 'user-service',
    port: 1234,
  });

  beforeAll(async () => {
    await provider.setup();
  });

  afterAll(async () => {
    await provider.finalize();
  });

  describe('Get User', () => {
    beforeEach(async () => {
      await provider.addInteraction({
        state: 'user exists',
        uponReceiving: 'a request for user 123',
        withRequest: {
          method: 'GET',
          path: '/api/users/123',
          headers: {
            Authorization: Pact.like('Bearer token'),
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: {
            id: 123,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      });
    });

    it('returns user data', async () => {
      const api = new API(provider.mockService.baseUrl);
      const user = await api.getUser(123, 'Bearer token');

      expect(user.id).toBe(123);
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });
  });
});

### **Performance Integration Testing**

```javascript
// __tests__/integration/performance.test.js
import request from 'supertest';
import app from '../../src/app';

describe('Performance Integration Tests', () => {
  it('responds within acceptable time limits', async () => {
    const startTime = Date.now();
    
    await request(app)
      .get('/api/users')
      .expect(200);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(1000); // 1 second max
  });

  it('handles concurrent requests', async () => {
    const concurrentRequests = 10;
    const promises = [];

    for (let i = 0; i < concurrentRequests; i++) {
      promises.push(
        request(app)
          .get('/api/users')
          .expect(200)
      );
    }

    const results = await Promise.all(promises);
    
    // All requests should succeed
    results.forEach(response => {
      expect(response.status).toBe(200);
    });
  });
});

---

## **Real Use Case**

### **Complete E-commerce Integration Test**

```javascript
// __tests__/integration/ecommerce.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import EcommerceApp from '../../src/EcommerceApp';
import { setupTestDatabase } from '../utils/database';

describe('E-commerce Integration Tests', () => {
  let database;

  beforeAll(async () => {
    database = await setupTestDatabase();
  });

  afterAll(async () => {
    await database.close();
  });

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <NavigationContainer>
          <EcommerceApp />
        </NavigationContainer>
      </Provider>
    );
  };

  it('completes full purchase flow', async () => {
    const { getByText, getByPlaceholderText, getByTestId } = renderApp();

    // 1. Browse products
    await waitFor(() => {
      expect(getByText('Featured Products')).toBeTruthy();
    });

    // 2. Search for product
    fireEvent.changeText(getByPlaceholderText('Search products'), 'laptop');
    fireEvent.press(getByTestId('search-button'));

    // 3. Select product
    await waitFor(() => {
      expect(getByText('Premium Laptop')).toBeTruthy();
    });
    fireEvent.press(getByText('Premium Laptop'));

    // 4. Add to cart
    fireEvent.press(getByTestId('add-to-cart'));

    // 5. View cart
    fireEvent.press(getByTestId('view-cart'));

    // 6. Proceed to checkout
    fireEvent.press(getByText('Proceed to Checkout'));

    // 7. Fill shipping information
    fireEvent.changeText(getByPlaceholderText('Full Name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Address'), '123 Main St');
    fireEvent.changeText(getByPlaceholderText('City'), 'New York');

    // 8. Select payment method
    fireEvent.press(getByText('Credit Card'));

    // 9. Place order
    fireEvent.press(getByText('Place Order'));

    // 10. Verify order confirmation
    await waitFor(() => {
      expect(getByText('Order Placed Successfully!')).toBeTruthy();
      expect(getByText('Order #')).toBeTruthy();
    });
  });

  it('handles out of stock scenario', async () => {
    // Mock product with zero stock
    jest.spyOn(ProductService, 'getProductById').mockResolvedValue({
      id: 1,
      name: 'Out of Stock Product',
      price: 99.99,
      stock: 0,
    });

    const { getByText, getByTestId, queryByText } = renderApp();

    // Navigate to product
    fireEvent.press(getByText('Out of Stock Product'));

    // Verify out of stock state
    expect(getByText('Out of Stock')).toBeTruthy();
    expect(queryByText('Add to Cart')).toBeFalsy();
    expect(getByTestId('notify-when-available')).toBeTruthy();
  });
});

---

## **Pro Tip**

**Use contract testing to ensure your frontend and backend APIs remain compatible as they evolve independently. This catches integration issues early in development rather than in production.**

```javascript
// Contract test example
describe('API Contract', () => {
  it('maintains backward compatibility', async () => {
    const response = await api.getUsers();
    
    // Ensure required fields exist
    expect(response.users[0]).toHaveProperty('id');
    expect(response.users[0]).toHaveProperty('name');
    expect(response.users[0]).toHaveProperty('email');
    
    // Ensure no breaking changes
    expect(response.users[0]).not.toHaveProperty('deprecated_field');
  });
});

---

## **Exercise / Mini Task**

**Task**: Create comprehensive integration tests for a social media application with the following features:

1. **User Authentication**: Login, registration, token management
2. **Post Management**: Create, read, update, delete posts
3. **Social Features**: Like, comment, follow users
4. **Real-time Updates**: WebSocket integration for live notifications
5. **File Upload**: Profile pictures and post images

**Requirements**:
- Test complete user flows from registration to posting
- Verify database consistency across operations
- Test API integration with proper error handling
- Include WebSocket integration testing
- Test file upload and storage
- Use test database and mock external services

**Bonus**:
- Add contract testing for API compatibility
- Implement performance testing for critical paths
- Create visual regression tests for UI flows
- Add load testing for concurrent users
- Test data migration and backup/restore

---

**Integration testing ensures your application components work together seamlessly. Master these techniques to build robust, reliable systems that maintain quality across complex interactions.**🎭
