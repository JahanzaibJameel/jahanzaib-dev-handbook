# Styling in React Native

Learn how to style React Native applications using StyleSheet, Tailwind CSS, and modern styling approaches to create beautiful, responsive mobile interfaces.

## **What is React Native Styling?**

Styling in React Native involves creating visual designs for your mobile applications using JavaScript-based styling systems. Unlike web development with CSS, React Native uses a styling approach that's optimized for mobile performance and native rendering.

### **Key Concepts**
- **StyleSheet**: React Native's built-in styling system
- **Flexbox Layout**: The primary layout system in React Native
- **Responsive Design**: Adapting to different screen sizes
- **Theming**: Creating consistent design systems
- **Platform-Specific Styling**: iOS vs Android styling differences

---

## **StyleSheet Fundamentals**

### **Basic StyleSheet Usage**

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StyledComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, React Native!</Text>
      <Text style={styles.subtitle}>Welcome to styling</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default StyledComponent;
```

### **Dynamic Styling**

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DynamicStyling = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [theme, setTheme] = useState('light');

  const getButtonStyle = () => [
    styles.button,
    isPressed && styles.buttonPressed,
    theme === 'dark' && styles.buttonDark,
  ];

  const getTextStyle = () => [
    styles.buttonText,
    theme === 'dark' && styles.textDark,
  ];

  return (
    <View style={[styles.container, theme === 'dark' && styles.containerDark]}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <Text style={getTextStyle()}>
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: '#0056CC',
    transform: [{ scale: 0.98 }],
  },
  buttonDark: {
    backgroundColor: '#0A84FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textDark: {
    color: '#fff',
  },
});

export default DynamicStyling;
```

---

## **Flexbox Layout System**

### **Understanding Flexbox in React Native**

```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FlexboxExamples = () => {
  return (
    <View style={styles.container}>
      {/* Row Layout */}
      <View style={styles.row}>
        <View style={styles.box}><Text>1</Text></View>
        <View style={styles.box}><Text>2</Text></View>
        <View style={styles.box}><Text>3</Text></View>
      </View>

      {/* Column Layout */}
      <View style={styles.column}>
        <View style={styles.box}><Text>A</Text></View>
        <View style={styles.box}><Text>B</Text></View>
        <View style={styles.box}><Text>C</Text></View>
      </View>

      {/* Centered Content */}
      <View style={styles.centered}>
        <View style={styles.centeredBox}>
          <Text>Centered</Text>
        </View>
      </View>

      {/* Space Between */}
      <View style={styles.spaceBetween}>
        <View style={styles.box}><Text>Left</Text></View>
        <View style={styles.box}><Text>Right</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  box: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  centeredBox: {
    width: 120,
    height: 60,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default FlexboxExamples;
```

### **Advanced Flexbox Patterns**

```javascript
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CardGrid = () => {
  const cards = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    description: `Description for card ${i + 1}`,
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Card Grid Layout</Text>
      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: '48%', // Two columns with small gap
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default CardGrid;
```

---

## **Responsive Design**

### **Screen Dimensions and Adaptation**

```javascript
import React from 'react';
import { View, Text, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ResponsiveDesign = () => {
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isLandscape = width > height;

  const dynamicStyles = {
    container: {
      flex: 1,
      padding: isTablet ? 32 : 16,
      backgroundColor: isLandscape ? '#f0f0f0' : '#ffffff',
    },
    title: {
      fontSize: isTablet ? 32 : 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: isTablet ? 24 : 16,
    },
    grid: {
      flexDirection: isTablet ? 'row' : 'column',
      justifyContent: 'space-between',
    },
    card: {
      width: isTablet ? '48%' : '100%',
      padding: isTablet ? 24 : 16,
      marginBottom: isTablet ? 0 : 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Responsive Layout</Text>
      
      <View style={styles.info}>
        <Text>Screen Width: {width}px</Text>
        <Text>Screen Height: {height}px</Text>
        <Text>Device: {isTablet ? 'Tablet' : 'Phone'}</Text>
        <Text>Orientation: {isLandscape ? 'Landscape' : 'Portrait'}</Text>
      </View>

      <View style={dynamicStyles.grid}>
        <View style={dynamicStyles.card}>
          <Text style={styles.cardTitle}>Card 1</Text>
          <Text style={styles.cardText}>Adaptive content</Text>
        </View>
        <View style={dynamicStyles.card}>
          <Text style={styles.cardTitle}>Card 2</Text>
          <Text style={styles.cardText}>Responsive design</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ResponsiveDesign;
```

---

## **Theming System**

### **Creating a Theme Provider**

```javascript
import React, { createContext, useContext, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

// Theme context
const ThemeContext = createContext();

// Theme definitions
const themes = {
  light: {
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: '#000000',
      textSecondary: '#8E8E93',
      border: '#C6C6C8',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },
  dark: {
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      background: '#000000',
      surface: '#1C1C1E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      error: '#FF453A',
      success: '#32D74B',
      warning: '#FF9F0A',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16, fontWeight: 'normal' },
      caption: { fontSize: 12, fontWeight: 'normal' },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
    },
  },
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setTheme] = useState(deviceColorScheme || 'light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    colors: themes[theme].colors,
    spacing: themes[theme].spacing,
    typography: themes[theme].typography,
    borderRadius: themes[theme].borderRadius,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Themed components
export const ThemedText = ({ style, variant = 'body', ...props }) => {
  const { colors, typography } = useTheme();
  
  return (
    <Text
      style={[
        { color: colors.text },
        typography[variant],
        style,
      ]}
      {...props}
    />
  );
};

export const ThemedView = ({ style, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        { backgroundColor: colors.background },
        style,
      ]}
      {...props}
    />
  );
};

export const ThemedButton = ({ title, onPress, variant = 'primary', style, ...props }) => {
  const { colors, borderRadius } = useTheme();
  
  const buttonStyles = {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles[variant],
        { borderRadius: borderRadius.md },
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      <ThemedText
        style={[
          styles.buttonText,
          variant === 'outline' && { color: colors.primary },
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
```

### **Using the Theme System**

```javascript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme, ThemedText, ThemedView, ThemedButton } from './ThemeContext';

const ThemedScreen = () => {
  const { colors, spacing, toggleTheme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="h1" style={styles.title}>
        Themed Application
      </ThemedText>
      
      <ThemedText variant="body" style={styles.subtitle}>
        Experience the power of theming
      </ThemedText>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <ThemedText variant="h3" style={styles.cardTitle}>
          Feature Card
        </ThemedText>
        <ThemedText variant="body" style={styles.cardDescription}>
          This card adapts to the current theme automatically.
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          title="Primary Action"
          onPress={() => console.log('Primary pressed')}
          style={styles.button}
        />
        
        <ThemedButton
          title="Toggle Theme"
          variant="outline"
          onPress={toggleTheme}
          style={styles.button}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 8,
  },
  cardDescription: {
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

// Wrap with ThemeProvider in your app
const App = () => {
  return (
    <ThemeProvider>
      <ThemedScreen />
    </ThemeProvider>
  );
};

export default App;
```

---

## **Platform-Specific Styling**

### **iOS vs Android Styling**

```javascript
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const PlatformSpecificStyling = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platform-Specific Styling</Text>
      
      {/* Different styles for iOS and Android */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Adaptive Card</Text>
        <Text style={styles.cardText}>
          This card looks different on iOS and Android
        </Text>
      </View>

      {/* Platform-specific buttons */}
      {Platform.OS === 'ios' ? (
        <View style={styles.iosButton}>
          <Text style={styles.iosButtonText}>iOS Button</Text>
        </View>
      ) : (
        <View style={styles.androidButton}>
          <Text style={styles.androidButtonText}>Android Button</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Platform.select({
      ios: '#f2f2f7',
      android: '#f5f5f5',
    }),
  },
  title: {
    fontSize: Platform.select({
      ios: 24,
      android: 20,
    }),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: Platform.select({
      ios: 16,
      android: 12,
    }),
    backgroundColor: '#fff',
    borderRadius: Platform.select({
      ios: 12,
      android: 4,
    }),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: Platform.select({ ios: 2, android: 1 }) },
    shadowOpacity: Platform.select({ ios: 0.1, android: 0.2 }),
    shadowRadius: Platform.select({ ios: 4, android: 2 }),
    elevation: Platform.OS === 'android' ? 3 : 0,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: Platform.select({
      ios: 20,
      android: 18,
    }),
  },
  iosButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  iosButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  androidButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    elevation: 2,
  },
  androidButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

export default PlatformSpecificStyling;
```

---

## **Tailwind CSS for React Native**

### **Setting Up NativeWind**

```bash
# Install NativeWind (Tailwind CSS for React Native)
npm install nativewind
npm install --save-dev tailwindcss

# Configure Tailwind
npx tailwindcss init
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require("nativewind/preset")],
}
```

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: ['nativewind/babel'],
};
```

### **Using Tailwind Classes**

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const TailwindExample = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 p-6 rounded-b-3xl shadow-lg">
        <Text className="text-white text-3xl font-bold text-center">
          Tailwind CSS
        </Text>
        <Text className="text-blue-100 text-center mt-2">
          Beautiful styling with utility classes
        </Text>
      </View>

      {/* Cards Grid */}
      <View className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {[
            { title: 'Primary', color: 'bg-blue-500' },
            { title: 'Success', color: 'bg-green-500' },
            { title: 'Warning', color: 'bg-yellow-500' },
            { title: 'Error', color: 'bg-red-500' },
          ].map((item, index) => (
            <View
              key={index}
              className={`${item.color} w-[48%] p-4 rounded-2xl mb-4 shadow-md`}
            >
              <Text className="text-white font-semibold text-lg mb-2">
                {item.title}
              </Text>
              <Text className="text-white/80 text-sm">
                Styled with Tailwind classes
              </Text>
            </View>
          ))}
        </View>

        {/* Form Elements */}
        <View className="bg-white p-6 rounded-2xl shadow-lg mb-4">
          <Text className="text-gray-800 text-xl font-bold mb-4">
            Form Example
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 text-sm mb-2">Email</Text>
            <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <Text className="text-gray-800">user@example.com</Text>
            </View>
          </View>

          <TouchableOpacity className="bg-blue-600 p-4 rounded-lg shadow-md">
            <Text className="text-white font-semibold text-center">
              Submit Button
            </Text>
          </TouchableOpacity>
        </View>

        {/* Responsive Layout */}
        <View className="bg-white p-4 rounded-2xl shadow-lg">
          <Text className="text-gray-800 text-lg font-bold mb-3">
            Responsive Layout
          </Text>
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-2">
              <View className="bg-purple-100 p-3 rounded-lg">
                <Text className="text-purple-800 text-center font-medium">
                  Left
                </Text>
              </View>
            </View>
            <View className="flex-1 ml-2">
              <View className="bg-purple-100 p-3 rounded-lg">
                <Text className="text-purple-800 text-center font-medium">
                  Right
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TailwindExample;
```

---

## **Advanced Styling Techniques**

### **Animated Styles**

```javascript
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const AnimatedStyling = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animated Styling</Text>

      <Animated.View
        style={[
          styles.box,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.boxText}>Animated Box</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={fadeIn}>
          <Text style={styles.buttonText}>Fade In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={slideIn}>
          <Text style={styles.buttonText}>Slide In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pulse}>
          <Text style={styles.buttonText}>Pulse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#34C759',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AnimatedStyling;
```

---

## **Real Use Case**

### **Complete Component Library**

```javascript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

// Button component with variants
const Button = ({ title, variant = 'primary', size = 'medium', loading, disabled, onPress, style }) => {
  const buttonStyles = StyleSheet.create({
    container: {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    primary: {
      backgroundColor: '#007AFF',
    },
    secondary: {
      backgroundColor: '#5856D6',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#007AFF',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    small: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 36,
    },
    medium: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      minHeight: 44,
    },
    large: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      minHeight: 52,
    },
    disabled: {
      opacity: 0.5,
    },
  });

  const textStyles = StyleSheet.create({
    text: {
      fontWeight: '600',
    },
    primary: {
      color: '#FFFFFF',
    },
    secondary: {
      color: '#FFFFFF',
    },
    outline: {
      color: '#007AFF',
    },
    ghost: {
      color: '#007AFF',
    },
    small: {
      fontSize: 14,
    },
    medium: {
      fontSize: 16,
    },
    large: {
      fontSize: 18,
    },
  });

  return (
    <TouchableOpacity
      style={[
        buttonStyles.container,
        buttonStyles[variant],
        buttonStyles[size],
        disabled && buttonStyles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />}
      <Text style={[textStyles.text, textStyles[variant], textStyles[size]]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Card component
const Card = ({ children, title, subtitle, style }) => {
  return (
    <View style={[styles.card, style]}>
      {(title || subtitle) && (
        <View style={styles.cardHeader}>
          {title && <Text style={styles.cardTitle}>{title}</Text>}
          {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
        </View>
      )}
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );
};

// Badge component
const Badge = ({ text, variant = 'primary', size = 'medium' }) => {
  const badgeStyles = StyleSheet.create({
    container: {
      alignSelf: 'flex-start',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    primary: {
      backgroundColor: '#007AFF',
    },
    success: {
      backgroundColor: '#34C759',
    },
    warning: {
      backgroundColor: '#FF9500',
    },
    error: {
      backgroundColor: '#FF3B30',
    },
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    large: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
  });

  const textStyles = StyleSheet.create({
    text: {
      fontWeight: '600',
    },
    small: {
      fontSize: 10,
    },
    medium: {
      fontSize: 12,
    },
    large: {
      fontSize: 14,
    },
  });

  return (
    <View style={[badgeStyles.container, badgeStyles[variant], badgeStyles[size]]}>
      <Text style={[textStyles.text, textStyles[size], { color: '#FFFFFF' }]}>
        {text}
      </Text>
    </View>
  );
};

// Usage example
const ComponentLibrary = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Component Library</Text>

      {/* Buttons */}
      <Card title="Buttons" subtitle="Various button styles">
        <View style={styles.row}>
          <Button title="Primary" variant="primary" size="small" />
          <Button title="Secondary" variant="secondary" size="medium" />
          <Button title="Outline" variant="outline" size="large" />
        </View>
        <View style={styles.row}>
          <Button title="Loading" loading={true} />
          <Button title="Disabled" disabled={true} />
        </View>
      </Card>

      {/* Badges */}
      <Card title="Badges" subtitle="Status indicators">
        <View style={styles.row}>
          <Badge text="New" variant="primary" />
          <Badge text="Success" variant="success" />
          <Badge text="Warning" variant="warning" />
          <Badge text="Error" variant="error" />
        </View>
        <View style={styles.row}>
          <Badge text="Small" size="small" variant="primary" />
          <Badge text="Medium" size="medium" variant="primary" />
          <Badge text="Large" size="large" variant="primary" />
        </View>
      </Card>

      {/* Cards */}
      <Card title="Cards" subtitle="Content containers">
        <Card title="Nested Card" subtitle="This is a nested card">
          <Text style={styles.bodyText}>Cards can contain any content</Text>
        </Card>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardContent: {
    // Content styles handled by children
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default ComponentLibrary;
```

---

## **Pro Tip**

**Create a design system with reusable components and consistent spacing/typography scales. This ensures visual consistency across your app and makes it easier to maintain and update. Use a theme provider to manage colors, fonts, and spacing values centrally.**

```javascript
// Design system constants
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#8E8E93',
};
```

---

## **Exercise / Mini Task**

**Task**: Create a complete design system for a mobile app with the following requirements:

1. **Theme System**: Create light and dark themes with color palettes
2. **Component Library**: Build reusable Button, Card, Input, and Badge components
3. **Responsive Layout**: Create layouts that adapt to different screen sizes
4. **Typography Scale**: Implement consistent typography across the app
5. **Animation System**: Add subtle animations to interactions

**Requirements**:
- Use StyleSheet.create for performance
- Implement platform-specific styling for iOS and Android
- Create a theme provider with context
- Add proper TypeScript types (if using TypeScript)
- Include hover, press, and disabled states
- Test on different screen sizes

**Bonus**:
- Add Tailwind CSS integration
- Create custom hooks for styling
- Implement a design token system
- Add storybook-style documentation
- Create accessibility-focused styling

---

*Styling is a crucial aspect of React Native development that directly impacts user experience. Master these techniques to create beautiful, responsive, and maintainable mobile applications that delight users across all platforms.*
