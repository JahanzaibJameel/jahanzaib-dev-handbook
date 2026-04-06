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
