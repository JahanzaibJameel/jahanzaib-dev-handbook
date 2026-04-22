# Testing

Learn how to test React Native applications using Jest, React Native Testing Library, and other testing tools to ensure code quality and reliability.

## **What is Testing?**

Testing in React Native involves verifying that your components, functions, and user interactions work as expected. Comprehensive testing helps catch bugs early, ensures code quality, and provides confidence when making changes.

### **Types of Testing**
- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test how multiple components work together
- **Component Tests**: Test React Native components with user interactions
- **E2E Tests**: Test complete user flows across the entire app
- **Snapshot Tests**: Capture component output and detect changes

---

## **Testing Setup**

### **Installation**

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native

# Install React Native preset for Jest
npm install --save-dev react-native-script

# For mocking
npm install --save-dev jest-expo @expo/spawn-async

# For E2E testing
npm install --save-dev detox
```

### **Jest Configuration**

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation))',
  ],
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## **Unit Testing**

### **Testing Pure Functions**

```javascript
// utils/helpers.js
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const calculateDiscount = (price, discountPercentage) => {
  if (discountPercentage < 0 || discountPercentage > 100) {
    throw new Error('Discount percentage must be between 0 and 100');
  }
  return price * (1 - discountPercentage / 100);
};
```

```javascript
// __tests__/utils/helpers.test.js
import { formatPrice, validateEmail, calculateDiscount } from '../../src/utils/helpers';

describe('formatPrice', () => {
  it('should format price with USD currency by default', () => {
    expect(formatPrice(1234.56)).toBe('$1,234.56');
  });

  it('should format price with specified currency', () => {
    expect(formatPrice(1234.56, 'EUR')).toBe('¥1,235');
  });

  it('should handle zero price', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle decimal prices', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });
});

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('should handle edge cases', () => {
    expect(validateEmail('a@b.c')).toBe(true);
    expect(validateEmail('user@domain')).toBe(false);
  });
});

describe('calculateDiscount', () => {
  it('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
    expect(calculateDiscount(50, 10)).toBe(45);
  });

  it('should return original price when discount is 0%', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should return 0 when discount is 100%', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('should throw error for negative discount', () => {
    expect(() => calculateDiscount(100, -10)).toThrow(
      'Discount percentage must be between 0 and 100'
    );
  });

  it('should throw error for discount over 100%', () => {
    expect(() => calculateDiscount(100, 110)).toThrow(
      'Discount percentage must be between 0 and 100'
    );
  });
});
```

---

## **Component Testing**

### **Testing Basic Components**

```javascript
// src/components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, disabled = false, style = {} }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      testID="custom-button"
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
});

export default CustomButton;
```

```javascript
// __tests__/components/Button.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../../src/components/Button';

describe('CustomButton', () => {
  it('should render correctly with title', () => {
    const { getByText } = render(
      <CustomButton title="Press Me" onPress={() => {}} />
    );
    
    expect(getByText('Press Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <CustomButton title="Press Me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByTestId('custom-button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <CustomButton title="Press Me" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByTestId('custom-button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <CustomButton title="Press Me" onPress={() => {}} style={customStyle} />
    );
    
    const button = getByTestId('custom-button');
    expect(button.props.style).toContainEqual(customStyle);
  });
});
```

### **Testing Complex Components**

```javascript
// src/components/Counter.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Counter = ({ initialValue = 0, onCountChange }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const decrement = () => {
    const newCount = count - 1;
    setCount(newCount);
    onCountChange?.(newCount);
  };

  const reset = () => {
    setCount(initialValue);
    onCountChange?.(initialValue);
  };

  return (
    <View style={styles.container} testID="counter">
      <Text style={styles.count} testID="count-text">
        Count: {count}
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.decrement]}
          onPress={decrement}
          testID="decrement-button"
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.reset]}
          onPress={reset}
          testID="reset-button"
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.increment]}
          onPress={increment}
          testID="increment-button"
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  increment: {
    backgroundColor: '#4CAF50',
  },
  decrement: {
    backgroundColor: '#f44336',
  },
  reset: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Counter;
```

```javascript
// __tests__/components/Counter.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Counter from '../../src/components/Counter';

describe('Counter', () => {
  it('should render with initial value', () => {
    const { getByTestId } = render(<Counter initialValue={5} />);
    const countText = getByTestId('count-text');
    
    expect(countText.props.children).toBe('Count: 5');
  });

  it('should increment count when increment button is pressed', () => {
    const { getByTestId } = render(<Counter />);
    const countText = getByTestId('count-text');
    const incrementButton = getByTestId('increment-button');
    
    expect(countText.props.children).toBe('Count: 0');
    
    fireEvent.press(incrementButton);
    expect(countText.props.children).toBe('Count: 1');
    
    fireEvent.press(incrementButton);
    expect(countText.props.children).toBe('Count: 2');
  });

  it('should decrement count when decrement button is pressed', () => {
    const { getByTestId } = render(<Counter initialValue={10} />);
    const countText = getByTestId('count-text');
    const decrementButton = getByTestId('decrement-button');
    
    fireEvent.press(decrementButton);
    expect(countText.props.children).toBe('Count: 9');
  });

  it('should reset count when reset button is pressed', () => {
    const { getByTestId } = render(<Counter initialValue={5} />);
    const countText = getByTestId('count-text');
    const incrementButton = getByTestId('increment-button');
    const resetButton = getByTestId('reset-button');
    
    fireEvent.press(incrementButton);
    fireEvent.press(incrementButton);
    expect(countText.props.children).toBe('Count: 7');
    
    fireEvent.press(resetButton);
    expect(countText.props.children).toBe('Count: 5');
  });

  it('should call onCountChange when count changes', () => {
    const mockOnCountChange = jest.fn();
    const { getByTestId } = render(
      <Counter onCountChange={mockOnCountChange} />
    );
    
    const incrementButton = getByTestId('increment-button');
    
    fireEvent.press(incrementButton);
    expect(mockOnCountChange).toHaveBeenCalledWith(1);
    
    fireEvent.press(incrementButton);
    expect(mockOnCountChange).toHaveBeenCalledWith(2);
  });

  it('should handle multiple operations correctly', () => {
    const { getByTestId } = render(<Counter initialValue={0} />);
    const countText = getByTestId('count-text');
    const incrementButton = getByTestId('increment-button');
    const decrementButton = getByTestId('decrement-button');
    
    // Increment 3 times
    fireEvent.press(incrementButton);
    fireEvent.press(incrementButton);
    fireEvent.press(incrementButton);
    expect(countText.props.children).toBe('Count: 3');
    
    // Decrement 1 time
    fireEvent.press(decrementButton);
    expect(countText.props.children).toBe('Count: 2');
  });
});
```

---

## **Testing with Mocks**

### **Mocking API Calls**

```javascript
// src/services/api.js
import axios from 'axios';

export const fetchUsers = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post('https://jsonplaceholder.typicode.com/users', userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create user');
  }
};
```

```javascript
// __tests__/services/api.test.js
import axios from 'axios';
import { fetchUsers, createUser } from '../../src/services/api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUsers', () => {
    it('should return users data on successful response', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];

      axios.get.mockResolvedValue({
        data: mockUsers,
      });

      const result = await fetchUsers();

      expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      expect(result).toEqual(mockUsers);
    });

    it('should throw error on failed response', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { name: 'New User', email: 'newuser@example.com' };
      const createdUser = { id: 3, ...userData };

      axios.post.mockResolvedValue({
        data: createdUser,
      });

      const result = await createUser(userData);

      expect(axios.post).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users',
        userData
      );
      expect(result).toEqual(createdUser);
    });

    it('should throw error when user creation fails', async () => {
      const userData = { name: 'New User', email: 'newuser@example.com' };

      axios.post.mockRejectedValue(new Error('Validation error'));

      await expect(createUser(userData)).rejects.toThrow('Failed to create user');
    });
  });
});
```

### **Mocking AsyncStorage**

```javascript
// src/services/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving preferences:', error);
    return false;
  }
};

export const getUserPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem('user_preferences');
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Error loading preferences:', error);
    return null;
  }
};
```

```javascript
// __tests__/services/storage.test.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserPreferences, getUserPreferences } from '../../src/services/storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Storage Service', () => {
  beforeEach(() => {
    AsyncStorage.clear();
  });

  describe('saveUserPreferences', () => {
    it('should save preferences successfully', async () => {
      const preferences = { theme: 'dark', fontSize: 'large' };

      const result = await saveUserPreferences(preferences);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user_preferences',
        JSON.stringify(preferences)
      );
    });

    it('should return false when saving fails', async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      const result = await saveUserPreferences({ theme: 'light' });

      expect(result).toBe(false);
    });
  });

  describe('getUserPreferences', () => {
    it('should return saved preferences', async () => {
      const preferences = { theme: 'dark', fontSize: 'large' };
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(preferences));

      const result = await getUserPreferences();

      expect(result).toEqual(preferences);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('user_preferences');
    });

    it('should return null when no preferences exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      const result = await getUserPreferences();

      expect(result).toBeNull();
    });

    it('should return null when loading fails', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const result = await getUserPreferences();

      expect(result).toBeNull();
    });
  });
});
```

---

## **Snapshot Testing**

### **Component Snapshots**

```javascript
// __tests__/components/Counter.snapshot.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import Counter from '../../src/components/Counter';

describe('Counter Snapshots', () => {
  it('should match snapshot with default props', () => {
    const { toJSON } = render(<Counter />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with custom initial value', () => {
    const { toJSON } = render(<Counter initialValue={10} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should match snapshot with callback', () => {
    const mockCallback = jest.fn();
    const { toJSON } = render(<Counter onCountChange={mockCallback} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

---

## **Integration Testing**

### **Testing Component Integration**

```javascript
// src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, ActivityIndicator, Button } from 'react-native';
import { fetchUsers } from '../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await fetchUsers();
      setUsers(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container} testID="user-list">
      <Text style={styles.title}>Users</Text>
      
      {loading && <ActivityIndicator testID="loading-indicator" />}
      
      {error && (
        <View>
          <Text style={styles.error}>{error}</Text>
          <Button title="Retry" onPress={loadUsers} testID="retry-button" />
        </View>
      )}
      
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
        testID="users-flatlist"
      />
    </View>
  );
};

const styles = {
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  userName: { fontSize: 16, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: '#666' },
  error: { color: 'red', marginBottom: 10 },
};

export default UserList;
```

```javascript
// __tests__/components/UserList.integration.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserList from '../../src/components/UserList';
import { fetchUsers } from '../../src/services/api';

// Mock the API service
jest.mock('../../src/services/api');

describe('UserList Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load and display users on mount', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ];

    fetchUsers.mockResolvedValue(mockUsers);

    const { getByTestId, getByText } = render(<UserList />);

    // Initially should show loading
    expect(getByTestId('loading-indicator')).toBeTruthy();

    // Wait for users to load
    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
      expect(getByText('jane@example.com')).toBeTruthy();
    });

    expect(fetchUsers).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors and show retry button', async () => {
    const errorMessage = 'Failed to fetch users';
    fetchUsers.mockRejectedValue(new Error(errorMessage));

    const { getByTestId, getByText } = render(<UserList />);

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
      expect(getByTestId('retry-button')).toBeTruthy();
    });

    // Test retry functionality
    fetchUsers.mockResolvedValue([
      { id: 1, name: 'John Doe', email: 'john@example.com' }
    ]);

    fireEvent.press(getByTestId('retry-button'));

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
    });

    expect(fetchUsers).toHaveBeenCalledTimes(2);
  });

  it('should show empty state when no users', async () => {
    fetchUsers.mockResolvedValue([]);

    const { getByTestId } = render(<UserList />);

    await waitFor(() => {
      const flatList = getByTestId('users-flatlist');
      expect(flatList.props.data).toEqual([]);
    });
  });
});
```

---

## **E2E Testing with Detox**

### **Detox Setup**

```javascript
// .detoxrc.js
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/config.json',
  configurations: {
    'ios.sim.debug': {
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/MyApp.app',
      build: 'xcodebuild -workspace ios/MyApp.xcworkspace -scheme MyApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    'android.emu.debug': {
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30',
      },
    },
  },
};
```

### **E2E Test Example**

```javascript
// e2e/LoginScreen.e2e.js
describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show login screen', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.id('email-input'))).toBeVisible();
    await expect(element(by.id('password-input'))).toBeVisible();
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('should show error for invalid credentials', async () => {
    await element(by.id('email-input')).typeText('invalid@example.com');
    await element(by.id('password-input')).typeText('wrongpassword');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.text('Invalid credentials')))
      .toBeVisible()
      .withTimeout(2000);
  });

  it('should login successfully with valid credentials', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('correctpassword');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
```

---

## **Testing Best Practices**

### **Test Structure**

```javascript
// Good test structure
describe('ComponentName', () => {
  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path tests
  describe('when rendered with default props', () => {
    it('should render correctly', () => {
      // Test implementation
    });
  });

  // Edge cases
  describe('when rendered with edge cases', () => {
    it('should handle empty data', () => {
      // Test implementation
    });

    it('should handle error states', () => {
      // Test implementation
    });
  });

  // User interactions
  describe('when user interacts', () => {
    it('should handle button press', () => {
      // Test implementation
    });
  });
});
```

### **Test Naming Conventions**

```javascript
// Good test names
it('should render with default props');
it('should call onPress when button is pressed');
it('should show error message when API call fails');
it('should update state when user types in input');

// Avoid vague test names
it('works correctly'); // Too vague
it('test button'); // Incomplete
it('should do something'); // Not specific
```

---

## **Real Use Case**

### **Testing a Todo App Component**

```javascript
// src/components/TodoList.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { saveTodos, loadTodos } from '../services/storage';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedTodos();
  }, []);

  const loadSavedTodos = async () => {
    try {
      const savedTodos = await loadTodos();
      setTodos(savedTodos || []);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;

    const newTodoItem = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    setNewTodo('');
    await saveTodos(updatedTodos);
  };

  const toggleTodo = async (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const deleteTodo = async (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.completedCheckbox]}
        onPress={() => toggleTodo(item.id)}
        testID={`todo-checkbox-${item.id}`}
      />
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        testID={`todo-text-${item.id}`}
      >
        {item.text}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTodo(item.id)}
        testID={`todo-delete-${item.id}`}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text testID="loading-text">Loading...</Text>;
  }

  return (
    <View style={styles.container} testID="todo-list">
      <Text style={styles.title}>Todo List</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add a new todo..."
          testID="todo-input"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTodo}
          testID="add-button"
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        testID="todos-flatlist"
        ListEmptyComponent={<Text testID="empty-text">No todos yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 10, marginRight: 10 },
  addButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  todoItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1 },
  checkbox: { width: 20, height: 20, borderWidth: 1, marginRight: 10 },
  completedCheckbox: { backgroundColor: '#007AFF' },
  todoText: { flex: 1, fontSize: 16 },
  completedText: { textDecorationLine: 'line-through', color: '#999' },
  deleteButton: { padding: 5 },
  deleteButtonText: { color: 'red', fontSize: 20 },
});

export default TodoList;
```

```javascript
// __tests__/components/TodoList.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodoList from '../../src/components/TodoList';
import { saveTodos, loadTodos } from '../../src/services/storage';

jest.mock('../../src/services/storage');

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Load', () => {
    it('should show loading state initially', () => {
      loadTodos.mockImplementation(() => new Promise(() => {}));

      const { getByTestId } = render(<TodoList />);
      expect(getByTestId('loading-text')).toBeTruthy();
    });

    it('should load saved todos on mount', async () => {
      const savedTodos = [
        { id: '1', text: 'First todo', completed: false },
        { id: '2', text: 'Second todo', completed: true },
      ];
      loadTodos.mockResolvedValue(savedTodos);

      const { getByTestId, getByText } = render(<TodoList />);

      await waitFor(() => {
        expect(getByText('First todo')).toBeTruthy();
        expect(getByText('Second todo')).toBeTruthy();
      });

      expect(loadTodos).toHaveBeenCalledTimes(1);
    });

    it('should show empty state when no todos', async () => {
      loadTodos.mockResolvedValue([]);

      const { getByTestId } = render(<TodoList />);

      await waitFor(() => {
        expect(getByTestId('empty-text')).toBeTruthy();
      });
    });
  });

  describe('Adding Todos', () => {
    it('should add new todo when valid text is entered', async () => {
      loadTodos.mockResolvedValue([]);
      saveTodos.mockResolvedValue();

      const { getByTestId, getByText } = render(<TodoList />);
      
      await waitFor(() => {
        expect(getByTestId('todo-input')).toBeTruthy();
      });

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-button');

      fireEvent.changeText(input, 'New todo item');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(getByText('New todo item')).toBeTruthy();
      });

      expect(saveTodos).toHaveBeenCalledWith([
        expect.objectContaining({
          text: 'New todo item',
          completed: false,
        })
      ]);
    });

    it('should not add todo when text is empty', async () => {
      loadTodos.mockResolvedValue([]);
      saveTodos.mockResolvedValue();

      const { getByTestId } = render(<TodoList />);
      
      await waitFor(() => {
        expect(getByTestId('todo-input')).toBeTruthy();
      });

      const input = getByTestId('todo-input');
      const addButton = getByTestId('add-button');

      fireEvent.changeText(input, '');
      fireEvent.press(addButton);

      expect(saveTodos).not.toHaveBeenCalled();
    });
  });

  describe('Toggling Todos', () => {
    it('should toggle todo completion status', async () => {
      const todos = [
        { id: '1', text: 'Test todo', completed: false },
      ];
      loadTodos.mockResolvedValue(todos);
      saveTodos.mockResolvedValue();

      const { getByTestId } = render(<TodoList />);
      
      await waitFor(() => {
        expect(getByTestId('todo-checkbox-1')).toBeTruthy();
      });

      const checkbox = getByTestId('todo-checkbox-1');
      fireEvent.press(checkbox);

      await waitFor(() => {
        expect(saveTodos).toHaveBeenCalledWith([
          expect.objectContaining({
            id: '1',
            completed: true,
          })
        ]);
      });
    });
  });

  describe('Deleting Todos', () => {
    it('should delete todo when delete button is pressed', async () => {
      const todos = [
        { id: '1', text: 'Test todo', completed: false },
        { id: '2', text: 'Another todo', completed: false },
      ];
      loadTodos.mockResolvedValue(todos);
      saveTodos.mockResolvedValue();

      const { getByTestId, queryByText } = render(<TodoList />);
      
      await waitFor(() => {
        expect(getByTestId('todo-delete-1')).toBeTruthy();
      });

      const deleteButton = getByTestId('todo-delete-1');
      fireEvent.press(deleteButton);

      await waitFor(() => {
        expect(saveTodos).toHaveBeenCalledWith([
          expect.objectContaining({ id: '2' })
        ]);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle load errors gracefully', async () => {
      loadTodos.mockRejectedValue(new Error('Storage error'));

      const { getByTestId } = render(<TodoList />);

      await waitFor(() => {
        expect(getByTestId('todo-input')).toBeTruthy();
      }, { timeout: 2000 });
    });
  });
});
```

---

## **Pro Tip**

**Use test-driven development (TDD) to write tests before implementing features. This helps you think through requirements and edge cases before writing code, leading to better design and fewer bugs.**

```javascript
// TDD Example: Write test first, then implementation
// 1. Write failing test
it('should validate email format', () => {
  expect(validateEmail('valid@example.com')).toBe(true);
  expect(validateEmail('invalid-email')).toBe(false);
});

// 2. Write minimal implementation to pass test
export const validateEmail = (email) => {
  return email.includes('@');
};

// 3. Refactor and improve implementation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

---

## **Exercise / Mini Task**

**Task**: Create a comprehensive test suite for a weather app component with the following features:

1. **Unit Tests**: Test utility functions for temperature conversion and weather formatting
2. **Component Tests**: Test weather display component with different weather conditions
3. **Integration Tests**: Test weather data fetching and display
4. **Mock Tests**: Mock weather API responses
5. **Snapshot Tests**: Create snapshots for different weather states

**Requirements**:
- Test loading states
- Test error states
- Test data formatting
- Test user interactions (refresh, location change)
- Test edge cases (no data, invalid data)
- Achieve at least 80% code coverage

**Bonus**:
- Add E2E tests with Detox
- Create custom matchers for testing
- Implement performance testing
- Add accessibility testing
- Create visual regression tests

---

*Testing is a crucial part of React Native development. A comprehensive testing strategy ensures your app is reliable, maintainable, and provides a great user experience across different devices and scenarios.*
