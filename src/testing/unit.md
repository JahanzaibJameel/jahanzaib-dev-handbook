# Unit Testing

Unit testing is the foundation of reliable software development. It involves testing individual components or functions in isolation to ensure they work correctly.

## 🎯 What is Unit Testing?

Unit testing focuses on the smallest testable parts of an application, called "units." A unit can be a function, method, module, or component that can be tested independently.

### Why Unit Testing Matters

- **Early Bug Detection**: Catch issues before they reach production
- **Documentation**: Tests serve as living documentation
- **Refactoring Safety**: Confidently modify code without breaking functionality
- **Design Improvement**: Writing tests forces better code structure
- **Development Speed**: Faster feedback loop than manual testing

## 🛠️ Testing Tools & Setup

### Jest - The Industry Standard

```bash
# Install Jest for different environments
# React Native
npm install --save-dev jest @testing-library/react-native react-test-renderer

# React/Next.js
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Node.js
npm install --save-dev jest supertest
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  // Test environment
  testEnvironment: 'jsdom', // for React apps
  // testEnvironment: 'node', // for Node.js apps
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ],
  
  // Mocks
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

## 🧪 React Native Unit Testing

### Testing Components

```javascript
// __tests__/components/Button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/Button';

describe('Button Component', () => {
  // Test basic rendering
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Click Me" />);
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  // Test interaction
  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // Test different states
  it('shows loading state correctly', () => {
    const { getByTestId } = render(
      <Button title="Loading" loading={true} />
    );
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Testing Custom Hooks

```javascript
// __tests__/hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from '../../src/hooks/useCounter';

describe('useCounter Hook', () => {
  it('returns initial count', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

## 🧪 Node.js Unit Testing

### Testing Controllers

```javascript
// __tests__/controllers/userController.test.js
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('returns all users', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com' }
      ];
      
      User.find.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual(mockUsers);
    });
  });
});
```

## 📊 Coverage & Quality

### Coverage Configuration

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## 🔧 Best Practices

### Test Structure (AAA Pattern)

```javascript
// Arrange, Act, Assert
it('increments counter when button is clicked', () => {
  // Arrange
  const mockOnPress = jest.fn();
  const { getByText } = render(<Button onPress={mockOnPress} />);
  
  // Act
  fireEvent.press(getByText('Increment'));
  
  // Assert
  expect(mockOnPress).toHaveBeenCalledTimes(1);
});
```

---

**Next Up**: Learn about Integration Testing! 🔄

---

## **Mocking & Test Doubles**

### **Mocking External Dependencies**

```javascript
// __tests__/services/apiService.test.js
import ApiService from '../../src/services/ApiService';

// Mock axios
jest.mock('axios');
import axios from 'axios';

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('returns users data on successful API call', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com' }
      ];
      
      axios.get.mockResolvedValue({ data: mockUsers });

      const result = await ApiService.fetchUsers();

      expect(axios.get).toHaveBeenCalledWith('/api/users');
      expect(result).toEqual(mockUsers);
    });

    it('handles API errors gracefully', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(ApiService.fetchUsers()).rejects.toThrow(errorMessage);
    });
  });
});
```

### **Mocking React Navigation**

```javascript
// __tests__/navigation/NavigationContainer.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

// Mock navigation container
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

describe('NavigationContainer', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <View testID="test-screen">
          <Text>Test Screen</Text>
        </View>
      </NavigationContainer>
    );

    expect(getByTestId('test-screen')).toBeTruthy();
  });
});
```

---

## **Advanced Testing Patterns**

### **Property-Based Testing**

```javascript
// __tests__/utils/stringUtils.test.js
import { capitalize, truncate } from '../../src/utils/stringUtils';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('capitalizes first letter of any string', () => {
      const testCases = [
        ['hello', 'Hello'],
        ['WORLD', 'World'],
        ['javascript', 'JavaScript'],
        ['', ''],
        ['a', 'A'],
      ];

      testCases.forEach(([input, expected]) => {
        expect(capitalize(input)).toBe(expected);
      });
    });
  });

  describe('truncate', () => {
    it('truncates strings to specified length', () => {
      const longString = 'This is a very long string that needs truncation';
      
      expect(truncate(longString, 10)).toBe('This is a...');
      expect(truncate(longString, 20)).toBe('This is a very lo...');
      expect(truncate('short', 10)).toBe('short');
    });
  });
});
```

### **Testing Async Operations**

```javascript
// __tests__/hooks/useAsyncData.test.js
import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import useAsyncData from '../../src/hooks/useAsyncData';

describe('useAsyncData', () => {
  it('loads data successfully', async () => {
    const mockData = { id: 1, name: 'Test Data' };
    const mockFetch = jest.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() => useAsyncData(mockFetch));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBe(null);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('handles errors correctly', async () => {
    const mockError = new Error('Fetch failed');
    const mockFetch = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useAsyncData(mockFetch));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe(null);
      expect(result.current.error).toEqual(mockError);
    });
  });
});
```

---

## **Testing Best Practices**

### **Test Naming Conventions**

```javascript
// Good test names - descriptive and clear
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data');
    it('should throw error when email is invalid');
    it('should hash password before saving');
    it('should return user object without password');
  });
});

// Bad test names - vague and unclear
describe('UserService', () => {
  it('works correctly');
  it('handles errors');
  it('returns data');
});
```

### **Test Organization**

```javascript
// Organize tests by feature, then by method, then by scenario
describe('PaymentService', () => {
  describe('processPayment', () => {
    describe('when payment is successful', () => {
      it('should charge the customer');
      it('should update order status');
      it('should send confirmation email');
    });

    describe('when payment fails', () => {
      it('should not charge the customer');
      it('should log the error');
      it('should notify admin');
    });
  });
});
```

### **Test Data Management**

```javascript
// __tests__/fixtures/userFixtures.js
export const validUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

export const invalidUser = {
  id: 1,
  name: '',
  email: 'invalid-email',
  password: '123',
};

export const multipleUsers = [
  validUser,
  { ...validUser, id: 2, email: 'jane@example.com' },
];

// Using fixtures in tests
import { validUser, invalidUser } from '../fixtures/userFixtures';

describe('UserValidator', () => {
  it('should validate correct user data', () => {
    expect(UserValidator.isValid(validUser)).toBe(true);
  });

  it('should reject invalid user data', () => {
    expect(UserValidator.isValid(invalidUser)).toBe(false);
  });
});
```

---

## **Real Use Case**

### **Testing a Complete React Native Component**

```javascript
// src/components/ProfileCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileCard = ({ user, onPress, showEmail = true }) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(user)}
      testID="profile-card"
    >
      <Image 
        source={{ uri: user.avatar }} 
        style={styles.avatar}
        testID="user-avatar"
      />
      <View style={styles.info}>
        <Text style={styles.name} testID="user-name">
          {user.name}
        </Text>
        {showEmail && (
          <Text style={styles.email} testID="user-email">
            {user.email}
          </Text>
        )}
        <Text style={styles.bio} testID="user-bio">
          {user.bio}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#333',
  },
});

export default ProfileCard;
```

```javascript
// __tests__/components/ProfileCard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileCard from '../../src/components/ProfileCard';

describe('ProfileCard Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Software developer passionate about React Native',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information correctly', () => {
    const { getByTestId, getByText } = render(
      <ProfileCard user={mockUser} onPress={mockOnPress} />
    );

    expect(getByTestId('user-avatar')).toBeTruthy();
    expect(getByTestId('user-name')).toBeTruthy();
    expect(getByTestId('user-email')).toBeTruthy();
    expect(getByTestId('user-bio')).toBeTruthy();

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByText('Software developer passionate about React Native')).toBeTruthy();
  });

  it('hides email when showEmail is false', () => {
    const { getByTestId, queryByTestId } = render(
      <ProfileCard user={mockUser} onPress={mockOnPress} showEmail={false} />
    );

    expect(getByTestId('user-name')).toBeTruthy();
    expect(queryByTestId('user-email')).toBeFalsy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByTestId } = render(
      <ProfileCard user={mockUser} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('profile-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockUser);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles', () => {
    const { getByTestId } = render(
      <ProfileCard user={mockUser} onPress={mockOnPress} />
    );

    const card = getByTestId('profile-card');
    expect(card.props.style).toContainEqual(
      expect.objectContaining({
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
      })
    );
  });
});
```

---

## **Pro Tip**

**Write tests before you write the code (Test-Driven Development). This forces you to think about the requirements and edge cases before implementation, leading to better design and fewer bugs.**

```javascript
// TDD Example: Write test first
describe('Calculator', () => {
  it('should add two numbers correctly', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(calculator.add(-2, 3)).toBe(1);
  });

  it('should throw error for non-numeric inputs', () => {
    expect(() => calculator.add('a', 3)).toThrow('Invalid input');
  });
});

// Then implement the code to make tests pass
class Calculator {
  add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('Invalid input');
    }
    return a + b;
  }
}
```

---

## **Exercise / Mini Task**

**Task**: Create comprehensive unit tests for a todo application with the following features:

1. **Todo Model**: Create, read, update, delete operations
2. **Todo Service**: Business logic for todo management
3. **Todo Component**: React Native component for displaying todos
4. **Todo Hook**: Custom hook for todo state management

**Requirements**:
- Test all CRUD operations
- Test error handling
- Test component rendering and interactions
- Test custom hook behavior
- Achieve 90% code coverage
- Use proper mocking for external dependencies

**Bonus**:
- Add property-based testing
- Create test fixtures and factories
- Implement test utilities for common operations
- Add performance tests
- Create visual regression tests

---

**Unit testing is the foundation of reliable software development. Master these techniques to build robust, maintainable applications with confidence and speed.**🔄
