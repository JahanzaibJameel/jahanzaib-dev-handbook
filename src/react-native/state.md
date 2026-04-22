# State Management

Learn how to manage state in React Native applications using React hooks, Context API, and popular state management libraries like Redux and MobX.

## **What is State Management?**

State management in React Native involves handling data that changes over time and affects how your app renders. Proper state management ensures your app is predictable, maintainable, and scalable.

### **Types of State**
- **Local State**: Component-specific data managed with useState
- **Global State**: Application-wide data shared across components
- **Server State**: Data from APIs and external sources
- **URL State**: Data stored in navigation and URLs
- **Form State**: Data from user input and forms

---

## **Local State Management**

### **useState Hook**

#### **Basic Usage**

```javascript
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {count}</Text>
      <Button
        title="Increment"
        onPress={() => setCount(count + 1)}
      />
      <Button
        title="Decrement"
        onPress={() => setCount(count - 1)}
      />
      <Button
        title="Reset"
        onPress={() => setCount(0)}
      />
    </View>
  );
};

// Form example
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={isLoading ? "Loading..." : "Login"}
        onPress={handleSubmit}
        disabled={isLoading}
      />
    </View>
  );
};
```

#### **Functional Updates**

```javascript
const Counter = () => {
  const [count, setCount] = useState(0);

  // Use functional update when new state depends on previous state
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Batch multiple state updates
  const complexUpdate = () => {
    setCount(prevCount => prevCount * 2);
    // React will batch these updates
    setCount(prevCount => prevCount + 10);
  };

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button title="Increment" onPress={increment} />
      <Button title="Complex Update" onPress={complexUpdate} />
    </View>
  );
};
```

### **useReducer Hook**

#### **Complex State Logic**

```javascript
import React, { useReducer } from 'react';

// Reducer function
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'SET_VALUE':
      return { ...state, count: action.payload };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  count: 0,
  history: [],
};

const Counter = () => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Count: {state.count}</Text>
      
      <Button
        title="Increment"
        onPress={() => dispatch({ type: 'INCREMENT' })}
      />
      
      <Button
        title="Decrement"
        onPress={() => dispatch({ type: 'DECREMENT' })}
      />
      
      <Button
        title="Set to 100"
        onPress={() => dispatch({ type: 'SET_VALUE', payload: 100 })}
      />
      
      <Button
        title="Reset"
        onPress={() => dispatch({ type: 'RESET' })}
      />
    </View>
  );
};
```

#### **Async Actions with useReducer**

```javascript
const asyncReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const DataFetcher = () => {
  const [state, dispatch] = useReducer(asyncReducer, {
    loading: false,
    data: null,
    error: null,
  });

  const fetchData = async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Fetch Data" onPress={fetchData} />
      
      {state.loading && <ActivityIndicator size="large" />}
      
      {state.error && (
        <Text style={styles.error}>Error: {state.error}</Text>
      )}
      
      {state.data && (
        <Text style={styles.success}>
          Data loaded: {JSON.stringify(state.data)}
        </Text>
      )}
    </View>
  );
};
```

---

## **Context API**

### **Basic Context Usage**

#### **Creating Context**

```javascript
import React, { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Theme provider component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const themeValues = {
    theme,
    toggleTheme,
    colors: {
      light: {
        background: '#ffffff',
        text: '#000000',
        primary: '#007AFF',
      },
      dark: {
        background: '#000000',
        text: '#ffffff',
        primary: '#0A84FF',
      },
    },
  };

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Usage in components
const ThemedButton = ({ title, onPress }) => {
  const { theme, colors } = useTheme();

  const buttonStyle = {
    backgroundColor: colors[theme].primary,
    padding: 12,
    borderRadius: 8,
  };

  const textStyle = {
    color: colors[theme].background,
    textAlign: 'center',
    fontWeight: 'bold',
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const ThemedScreen = () => {
  const { theme, colors, toggleTheme } = useTheme();

  const containerStyle = {
    flex: 1,
    backgroundColor: colors[theme].background,
    padding: 20,
  };

  const textStyle = {
    color: colors[theme].text,
    fontSize: 18,
    marginBottom: 20,
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>Current theme: {theme}</Text>
      <ThemedButton
        title="Toggle Theme"
        onPress={toggleTheme}
      />
    </View>
  );
};
```

#### **Multiple Contexts**

```javascript
// Auth context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    try {
      const userData = await api.login(credentials);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Usage with multiple providers
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
};

// Component using both contexts
const ProfileScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, colors } = useTheme();

  return (
    <View style={{ backgroundColor: colors[theme].background }}>
      <Text style={{ color: colors[theme].text }}>
        Welcome, {user?.name}
      </Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};
```

---

## **Redux**

### **Redux Setup**

#### **Installation and Configuration**

```bash
# Install Redux and React Redux
npm install @reduxjs/toolkit react-redux

# For React Native
npm install @react-native-async-storage/async-storage
```

#### **Store Configuration**

```javascript
// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'settings'], // Only persist these reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
```

#### **Slice with Redux Toolkit**

```javascript
// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

#### **Connecting Components**

```javascript
// App.js
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

// LoginScreen.js
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <Button
        title={isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};
```

---

## **MobX**

### **MobX Setup**

#### **Installation and Store**

```bash
npm install mobx mobx-react-lite
```

```javascript
// store/AuthStore.js
import { makeAutoObservable } from 'mobx';

class AuthStore {
  user = null;
  token = null;
  isLoading = false;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  async login(credentials) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await api.login(credentials);
      this.user = response.user;
      this.token = response.token;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
  }

  clearError() {
    this.error = null;
  }

  get isAuthenticated() {
    return !!this.token;
  }
}

export default new AuthStore();
```

#### **MobX Components**

```javascript
// LoginScreen.js
import { observer } from 'mobx-react-lite';
import authStore from '../store/AuthStore';

const LoginScreen = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    authStore.login({ email, password });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      
      {authStore.error && (
        <Text style={styles.error}>{authStore.error}</Text>
      )}
      
      <Button
        title={authStore.isLoading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={authStore.isLoading}
      />
    </View>
  );
});

export default LoginScreen;
```

---

## **State Management Patterns**

### **Compound Components Pattern**

```javascript
// Form context
const FormContext = createContext();

const FormProvider = ({ children, initialValues, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const setError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const setTouched = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  const contextValue = {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    handleSubmit,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

// Form field component
const FormField = ({ name, label, ...props }) => {
  const { values, errors, touched, setValue, setError, setTouched } = useContext(FormContext);

  const handleChange = (value) => {
    setValue(name, value);
    if (touched[name]) {
      // Validate on change if field has been touched
      validateField(name, value);
    }
  };

  const handleBlur = () => {
    setTouched(name);
    validateField(name, values[name]);
  };

  const validateField = (fieldName, value) => {
    // Add validation logic here
    if (!value) {
      setError(fieldName, 'This field is required');
    } else {
      setError(fieldName, '');
    }
  };

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={values[name] || ''}
        onChangeText={handleChange}
        onBlur={handleBlur}
        style={[
          styles.input,
          errors[name] && styles.errorInput,
        ]}
        {...props}
      />
      {errors[name] && touched[name] && (
        <Text style={styles.errorText}>{errors[name]}</Text>
      )}
    </View>
  );
};

// Usage
const RegistrationForm = () => {
  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
  };

  return (
    <FormProvider
      initialValues={{ name: '', email: '', password: '' }}
      onSubmit={handleSubmit}
    >
      <View style={styles.container}>
        <FormField
          name="name"
          label="Name"
          placeholder="Enter your name"
        />
        <FormField
          name="email"
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
        />
        <FormField
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
        />
        <SubmitButton title="Register" />
      </View>
    </FormProvider>
  );
};

const SubmitButton = () => {
  const { handleSubmit } = useContext(FormContext);
  
  return (
    <Button title="Submit" onPress={handleSubmit} />
  );
};
```

---

## **Real Use Case**

### **E-commerce App State Management**

```javascript
// store/slices/cartSlice.js
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    itemCount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    calculateTotals: (state) => {
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Cart component
const CartScreen = () => {
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <View style={styles.quantityControls}>
        <Button
          title="-"
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        />
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Button
          title="+"
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        />
      </View>
      <Button
        title="Remove"
        onPress={() => handleRemoveItem(item.id)}
        color="red"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart ({itemCount} items)</Text>
      
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>Your cart is empty</Text>}
      />
      
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <Button
          title="Checkout"
          onPress={() => navigation.navigate('Checkout')}
          disabled={items.length === 0}
        />
      </View>
    </View>
  );
};
```

---

## **Pro Tip**

**Use the right tool for the job. For simple component state, use useState. For complex component logic, use useReducer. For global state that's shared across many components, use Context API. For complex global state with many actions and side effects, consider Redux or MobX. Don't over-engineer your state management.**

```javascript
// Good: Simple local state
const Counter = () => {
  const [count, setCount] = useState(0);
  return <Text>{count}</Text>;
};

// Good: Complex local state
const Form = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return <FormComponent state={state} dispatch={dispatch} />;
};

// Good: Global theme state
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Good: Complex global state
const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};
```

---

## **Exercise / Mini Task**

**Task**: Create a complete state management solution for a todo app with the following features:

1. **Local State**: Use useState for simple form inputs
2. **Context API**: Create a theme context for light/dark mode
3. **Redux**: Implement a todo slice with CRUD operations
4. **Persistence**: Save todos to AsyncStorage
5. **Filters**: Add filtering by completion status

**Requirements**:
- Add, edit, and delete todos
- Toggle todo completion status
- Filter todos (all, active, completed)
- Persist todos across app restarts
- Switch between light and dark themes
- Show loading states for async operations

**Bonus**:
- Add undo/redo functionality
- Implement optimistic updates
- Add search functionality
- Create todo categories
- Add due dates and reminders

---

*State management is a fundamental concept in React Native development. Choose the right approach based on your app's complexity and requirements to maintain clean, predictable, and scalable code.*
