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

```
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
```

---

**Next Up**: Learn about End-to-End Testing! 🎭
