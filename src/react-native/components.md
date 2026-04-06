# Components & Props in React Native

Components are the building blocks of React Native applications. They encapsulate reusable pieces of UI and logic.

## 🧩 Understanding Components

### What is a Component?
A component is a self-contained, reusable piece of UI that can accept input (props) and manage its own state.

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Functional Component
const WelcomeCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeCard;
```

## 📦 Props (Properties)

Props are read-only attributes that pass data from parent to child components.

### Basic Props Usage

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserCard = ({ name, email, avatar }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

// Parent Component
const UserList = () => {
  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <View>
      {users.map((user, index) => (
        <UserCard 
          key={index}
          name={user.name}
          email={user.email}
        />
      ))}
    </View>
  );
};
```

### Prop Types and Validation

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Button = ({ title, onPress, disabled, color }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  color: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
  color: '#007AFF',
};
```

## 🎨 Core Components

### View
The most fundamental component for building UI:

```javascript
import { View, StyleSheet } from 'react-native';

const Container = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.content} />
      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  footer: {
    height: 50,
    backgroundColor: '#fff',
  },
});
```

### Text
For displaying text content:

```javascript
import { Text, StyleSheet } from 'react-native';

const TextExamples = () => {
  return (
    <View>
      <Text style={styles.title}>Main Title</Text>
      <Text style={styles.subtitle}>Subtitle Text</Text>
      <Text style={styles.body}>Regular body text content</Text>
      <Text style={styles.caption}>Small caption text</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  body: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    color: '#999',
  },
});
```

### Image
For displaying images:

```javascript
import { Image, StyleSheet, View } from 'react-native';

const ImageExamples = () => {
  return (
    <View>
      {/* Local Image */}
      <Image 
        source={require('./assets/logo.png')}
        style={styles.localImage}
      />
      
      {/* Network Image */}
      <Image 
        source={{ uri: 'https://example.com/image.jpg' }}
        style={styles.networkImage}
      />
      
      {/* Image with Placeholder */}
      <Image
        source={require('./assets/profile.jpg')}
        style={styles.avatar}
        defaultSource={require('./assets/placeholder.png')}
      />
    </View>
  );
};
```

### TouchableOpacity
For creating pressable elements:

```javascript
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, variant }) => {
  const buttonStyle = variant === 'primary' 
    ? styles.primaryButton 
    : styles.secondaryButton;

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};
```

## 🏗️ Custom Components

### Creating Reusable Components

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Card = ({ children, title, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.content}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const InputField = ({ label, value, onChangeText, placeholder, secure }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
      />
    </View>
  );
};

const LoadingSpinner = ({ size, color }) => {
  return (
    <ActivityIndicator 
      size={size || 'large'} 
      color={color || '#007AFF'} 
    />
  );
};
```

## 🔄 Component Composition

### Building Complex UIs

```javascript
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Card from './Card';
import UserCard from './UserCard';
import LoadingSpinner from './LoadingSpinner';

const UserFeed = ({ users, loading, onUserPress }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      {users.map(user => (
        <Card key={user.id} onPress={() => onUserPress(user)}>
          <UserCard 
            name={user.name}
            email={user.email}
            avatar={user.avatar}
          />
        </Card>
      ))}
    </ScrollView>
  );
};
```

## 🎯 Best Practices

### 1. Single Responsibility
Each component should have one clear purpose:

```javascript
// Good: Single responsibility
const Avatar = ({ source, size }) => (
  <Image source={source} style={[styles.avatar, { width: size, height: size }]} />
);

// Bad: Multiple responsibilities
const UserSection = ({ user, onEdit, onDelete, onMessage }) => {
  // Too many responsibilities in one component
};
```

### 2. Props Destructuring
Always destructure props for cleaner code:

```javascript
// Good
const UserCard = ({ name, email, avatar }) => {
  return (
    <View>
      <Text>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
};

// Avoid
const UserCard = (props) => {
  return (
    <View>
      <Text>{props.name}</Text>
      <Text>{props.email}</Text>
    </View>
  );
};
```

### 3. Default Props
Always provide sensible defaults:

```javascript
const Button = ({ 
  title, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  size = 'medium'
}) => {
  // Component implementation
};
```

### 4. Component Naming
Use descriptive, PascalCase names:

```javascript
// Good
const UserProfileCard = () => {};
const NavigationHeader = () => {};
const SearchInputField = () => {};

// Avoid
const Card = () => {}; // Too generic
const Header = () => {}; // Too generic
const Input = () => {}; // Too generic
```

## 🧪 Testing Components

### Basic Component Testing

```javascript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <Button title="Press me" onPress={() => {}} />
    );
    
    expect(getByText('Press me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Press me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Press me'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

## 📚 Component Library

### Building a Component Library

```javascript
// components/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Input } from './Input';
export { default as Avatar } from './Avatar';

// Usage in other files
import { Button, Card, Input } from '../components';
```

### Theme Integration

```javascript
// theme.js
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
};

// Themed Component
const ThemedButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.primary }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: colors.surface }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

---

**Next Up**: Learn about navigation to connect your components into a complete app! 🚀
