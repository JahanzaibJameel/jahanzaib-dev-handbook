# E-Commerce Mobile App

A complete e-commerce mobile application built with React Native, featuring product catalog, shopping cart, user authentication, and payment integration.

## 🎯 Project Overview

This is a production-ready e-commerce mobile application that demonstrates real-world development skills including API integration, state management, authentication, and payment processing.

### Key Features
- Product browsing and search
- Shopping cart management
- User authentication and profiles
- Payment integration (Stripe)
- Order tracking
- Push notifications
- Offline mode support

## 🛠️ Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **React Navigation**: App navigation
- **Redux Toolkit**: State management
- **React Native Elements**: UI components
- **React Native Vector Icons**: Icon library

### Backend & Services
- **Node.js/Express**: Backend API
- **MongoDB**: Database
- **JWT**: Authentication
- **Stripe**: Payment processing
- **Firebase**: Push notifications
- **Cloudinary**: Image storage

### Development Tools
- **TypeScript**: Type safety
- **ESLint/Prettier**: Code quality
- **Jest**: Testing
- **Flipper**: Debugging

## 📁 Project Structure

```
ecommerce-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProductCard/
│   │   ├── CartItem/
│   │   ├── SearchBar/
│   │   └── Button/
│   ├── screens/            # App screens
│   │   ├── HomeScreen/
│   │   ├── ProductScreen/
│   │   ├── CartScreen/
│   │   ├── ProfileScreen/
│   │   └── CheckoutScreen/
│   ├── navigation/         # Navigation setup
│   ├── store/             # Redux store
│   │   ├── slices/
│   │   └── middleware/
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── payments.js
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom hooks
│   └── constants/         # App constants
├── assets/                # Images, fonts
├── __tests__/             # Test files
└── docs/                  # Documentation
```

## 🏗️ Core Components

### ProductCard Component

```javascript
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../store/slices/cartSlice';

const ProductCard = ({ product, onPress }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart(product));
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProductCard;
```

### Shopping Cart Service

```javascript
// services/cart.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class CartService {
  constructor() {
    this.CART_KEY = '@cart_items';
  }

  // Get cart from local storage
  async getCart() {
    try {
      const cartData = await AsyncStorage.getItem(this.CART_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  // Save cart to local storage
  async saveCart(cartItems) {
    try {
      await AsyncStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Add item to cart
  async addItem(product, quantity = 1) {
    const cart = await this.getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    await this.saveCart(cart);
    return cart;
  }

  // Remove item from cart
  async removeItem(productId) {
    const cart = await this.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    await this.saveCart(updatedCart);
    return updatedCart;
  }

  // Update item quantity
  async updateQuantity(productId, quantity) {
    const cart = await this.getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return this.removeItem(productId);
      }
    }

    await this.saveCart(cart);
    return cart;
  }

  // Calculate total
  calculateTotal(cartItems) {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Sync with server
  async syncWithServer(userId) {
    try {
      const localCart = await this.getCart();
      const response = await api.post('/cart/sync', {
        userId,
        items: localCart,
      });
      
      await this.saveCart(response.data.cart);
      return response.data.cart;
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw error;
    }
  }
}

export default new CartService();
```

## 🔐 Authentication System

### JWT Authentication Service

```javascript
// services/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class AuthService {
  constructor() {
    this.TOKEN_KEY = '@auth_token';
    this.USER_KEY = '@user_data';
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Save token and user data
      await AsyncStorage.setItem(this.TOKEN_KEY, token);
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      // Set default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { token, user };
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  }

  // Logout user
  async logout() {
    try {
      // Remove from storage
      await AsyncStorage.removeItem(this.TOKEN_KEY);
      await AsyncStorage.removeItem(this.USER_KEY);
      
      // Remove auth header
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Get auth token
  async getToken() {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }

  // Initialize auth state
  async initializeAuth() {
    const token = await this.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return token;
  }
}

export default new AuthService();
```

## 💳 Payment Integration

### Stripe Payment Service

```javascript
// services/payments.js
import { Platform } from 'react-native';
import api from './api';

class PaymentService {
  // Create payment intent
  async createPaymentIntent(amount, currency = 'USD') {
    try {
      const response = await api.post('/payments/create-intent', {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Payment failed';
    }
  }

  // Process payment
  async processPayment(paymentMethodId, amount) {
    try {
      const response = await api.post('/payments/process', {
        paymentMethodId,
        amount: Math.round(amount * 100),
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Payment processing failed';
    }
  }

  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to get payment methods';
    }
  }

  // Add payment method
  async addPaymentMethod(cardDetails) {
    try {
      const response = await api.post('/payments/methods', cardDetails);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add payment method';
    }
  }

  // Format price for display
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  // Validate card number
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const regex = /^[0-9]{13,19}$/;
    return regex.test(cleaned);
  }

  // Validate expiry date
  validateExpiryDate(expiry) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    
    return true;
  }

  // Validate CVV
  validateCVV(cvv) {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
  }
}

export default new PaymentService();
```

## 🧪 Testing Strategy

### Component Testing

```javascript
// __tests__/components/ProductCard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../../src/components/ProductCard';
import cartSlice from '../../src/store/slices/cartSlice';

// Test store setup
const createTestStore = () => {
  return configureStore({
    reducer: {
      cart: cartSlice,
    },
  });
};

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const store = createTestStore();
    
    const { getByText } = render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onPress={() => {}} />
      </Provider>
    );
    
    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$29.99')).toBeTruthy();
  });

  it('adds item to cart when button is pressed', () => {
    const store = createTestStore();
    const mockOnPress = jest.fn();
    
    const { getByText } = render(
      <Provider store={store}>
        <ProductCard product={mockProduct} onPress={mockOnPress} />
      </Provider>
    );
    
    fireEvent.press(getByText('Add to Cart'));
    
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].id).toBe('1');
  });

  it('calls onPress when card is pressed', () => {
    const store = createTestStore();
    const mockOnPress = jest.fn();
    
    const { getByTestId } = render(
      <Provider store={store}>
        <ProductCard 
          product={mockProduct} 
          onPress={mockOnPress}
          testID="product-card"
        />
      </Provider>
    );
    
    fireEvent.press(getByTestId('product-card'));
    expect(mockOnPress).toHaveBeenCalledWith(mockProduct);
  });
});
```

## 📱 Screens Overview

### Home Screen
- Featured products carousel
- Category navigation
- Search functionality
- Recent products

### Product Screen
- Product details
- Image gallery
- Reviews and ratings
- Related products

### Cart Screen
- Cart items list
- Quantity controls
- Price calculation
- Checkout button

### Checkout Screen
- Shipping information
- Payment method selection
- Order summary
- Place order

### Profile Screen
- User information
- Order history
- Settings
- Logout

## 🚀 Deployment

### Build Configuration

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional configuration
config.resolver.assetExts.push(...['bin', 'jpg', 'png', 'svg']);

module.exports = config;
```

### Environment Setup

```javascript
// config/environment.js
const environments = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    stripeKey: 'pk_test_...',
    enableLogging: true,
  },
  staging: {
    apiUrl: 'https://staging-api.ecommerce.com/api',
    stripeKey: 'pk_test_...',
    enableLogging: true,
  },
  production: {
    apiUrl: 'https://api.ecommerce.com/api',
    stripeKey: 'pk_live_...',
    enableLogging: false,
  },
};

const currentEnv = environments[process.env.NODE_ENV || 'development'];

export default currentEnv;
```

## 📊 Performance Optimization

### Image Optimization
- WebP format for product images
- Lazy loading for product lists
- Image caching strategies
- Progressive loading

### State Management
- Redux Toolkit for efficient updates
- Memoization for expensive calculations
- Selective re-renders with React.memo
- Optimized selectors

### Network Optimization
- API response caching
- Request batching
- Offline support
- Background sync

## 🔗 Live Demo & Repository

### GitHub Repository
```
https://github.com/yourusername/ecommerce-mobile-app
```

### Live App Stores
- **Google Play Store**: [Link to Play Store]
- **Apple App Store**: [Link to App Store]

### Demo Credentials
- **Email**: demo@ecommerce.com
- **Password**: demo123

## 🎯 Key Learning Outcomes

After building this project, you'll have mastered:

1. **React Native Development**
   - Component architecture
   - Navigation patterns
   - State management
   - Performance optimization

2. **API Integration**
   - REST API consumption
   - Error handling
   - Authentication
   - Data synchronization

3. **E-commerce Features**
   - Shopping cart logic
   - Payment processing
   - Order management
   - User authentication

4. **Production Practices**
   - Testing strategies
   - Code organization
   - Error handling
   - Performance optimization

5. **Mobile UX/UI**
   - Responsive design
   - Touch interactions
   - Platform-specific features
   - Accessibility

---

**Next Project**: AI Chat Application - Learn to integrate AI into mobile apps! 🤖
