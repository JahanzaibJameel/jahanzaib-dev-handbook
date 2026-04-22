# Performance Optimization

Learn how to optimize React Native applications for better performance, including rendering optimization, memory management, and app startup improvements.

## **What is Performance Optimization?**

Performance optimization in React Native involves improving your app's speed, responsiveness, and resource usage to provide a better user experience and reduce battery consumption.

### **Key Performance Metrics**
- **App Startup Time**: Time from app launch to first meaningful paint
- **Frame Rate**: Smooth 60 FPS animations and interactions
- **Memory Usage**: Efficient memory allocation and garbage collection
- **Network Performance**: Optimized API calls and data loading
- **Battery Usage**: Minimal battery drain during app usage

---

## **Rendering Optimization**

### **Component Optimization**

#### **React.memo for Component Memoization**

```javascript
import React, { memo } from 'react';

// Without memo - re-renders on every parent render
const ExpensiveComponent = ({ data, onAction }) => {
  console.log('ExpensiveComponent rendered');
  
  return (
    <View>
      {data.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
};

// With memo - only re-renders when props change
const MemoizedComponent = memo(({ data, onAction }) => {
  console.log('MemoizedComponent rendered');
  
  return (
    <View>
      {data.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
});

// Custom comparison function
const CustomMemoComponent = memo(({ data, onAction }) => {
  return (
    <View>
      {data.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
}, (prevProps, nextProps) => {
  // Return true if props are equal (don't re-render)
  return prevProps.data.length === nextProps.data.length &&
         prevProps.data.every((item, index) => 
           item.id === nextProps.data[index].id
         );
});
```

#### **useMemo for Expensive Computations**

```javascript
import React, { useMemo, useState } from 'react';

const ProductList = ({ products, filter }) => {
  const expensiveFiltering = useMemo(() => {
    console.log('Expensive filtering executed');
    
    return products.filter(product => {
      // Complex filtering logic
      return product.name.toLowerCase().includes(filter.toLowerCase()) ||
             product.category.toLowerCase().includes(filter.toLowerCase()) ||
             product.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
    });
  }, [products, filter]);

  return (
    <FlatList
      data={expensiveFiltering}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.productItem}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </View>
      )}
    />
  );
};
```

#### **useCallback for Function References**

```javascript
import React, { useState, useCallback } from 'react';

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  
  // Without useCallback - new function on every render
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  // With useCallback - same function reference unless dependencies change
  const handleIncrementCallback = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // Empty dependency array means function never changes
  
  const handleIncrementWithValue = useCallback((value) => {
    setCount(prev => prev + value);
  }, []); // Dependencies array empty since we don't use external values

  return (
    <View>
      <Text>Count: {count}</Text>
      <ChildComponent onIncrement={handleIncrementCallback} />
    </View>
  );
};

const ChildComponent = React.memo(({ onIncrement }) => {
  console.log('ChildComponent rendered');
  
  return (
    <Button title="Increment" onPress={onIncrement} />
  );
});
```

### **FlatList Optimization**

#### **Basic FlatList Optimization**

```javascript
import React, { useMemo } from 'react';

const OptimizedFlatList = ({ data }) => {
  // Memoize key extractor
  const keyExtractor = useMemo(() => (item) => item.id, []);
  
  // Memoize render item
  const renderItem = useMemo(() => ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  ), []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const ITEM_HEIGHT = 80;
```

#### **Advanced FlatList with Virtualization**

```javascript
import React, { useState, useCallback, useMemo } from 'react';

const AdvancedFlatList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Optimized key extractor
  const keyExtractor = useCallback((item) => `item-${item.id}`, []);

  // Optimized render item with memoization
  const renderItem = useCallback(({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPress={handleItemPress}
      onLongPress={handleItemLongPress}
    />
  ), []);

  // Optimized item layout
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newData = await fetchMoreData();
      setData(prev => [...prev, ...newData]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Memoized list header
  const ListHeaderComponent = useMemo(() => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Product List</Text>
    </View>
  ), []);

  // Memoized list footer
  const ListFooterComponent = useMemo(() => (
    <View style={styles.footer}>
      {loading && <ActivityIndicator size="small" />}
    </View>
  ), [loading]);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onRefresh={handleRefresh}
      refreshing={refreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={100}
      windowSize={21}
      initialNumToRender={15}
    />
  );
};
```

---

## **Memory Management**

### **Memory Leak Prevention**

#### **Proper Cleanup in useEffect**

```javascript
import React, { useState, useEffect } from 'react';
import { Timer, EventEmitter } from 'react-native';

const TimerComponent = () => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    // Set up timer
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup function - crucial for preventing memory leaks
    return () => {
      clearInterval(timer);
    };
  }, []); // Empty dependency array means this runs once

  return <Text>Timer: {seconds}s</Text>;
};

// Event listener cleanup
const EventListenerComponent = () => {
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      console.log('App state changed to:', nextAppState);
    };

    // Add event listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);
};
```

#### **Animation Cleanup**

```javascript
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const AnimationComponent = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    });

    animation.start();

    // Cleanup animation
    return () => {
      animation.stop();
    };
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text>Fading Content</Text>
    </Animated.View>
  );
};
```

### **Image Memory Management**

#### **Optimized Image Loading**

```javascript
import React, { useState, useCallback } from 'react';
import { Image, FlatList } from 'react-native';

const OptimizedImageList = ({ images }) => {
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = useCallback((imageId) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  }, []);

  const handleImageError = useCallback((error, imageId) => {
    console.error('Image load error:', error, imageId);
  }, []);

  const renderItem = useCallback(({ item }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
        onLoad={() => handleImageLoad(item.id)}
        onError={(error) => handleImageError(error, item.id)}
        // Performance optimizations
        defaultSource={require('./placeholder.png')}
        blurRadius={loadedImages.has(item.id) ? 0 : 5}
      />
      {!loadedImages.has(item.id) && (
        <ActivityIndicator style={styles.loader} />
      )}
    </View>
  ), [loadedImages, handleImageLoad, handleImageError]);

  return (
    <FlatList
      data={images}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
};
```

---

## **App Startup Optimization**

### **Bundle Size Reduction**

#### **Code Splitting**

```javascript
// Lazy loading heavy components
import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';

const LazyLoadedComponent = () => {
  const [HeavyComponent, setHeavyComponent] = useState(null);

  const loadHeavyComponent = async () => {
    try {
      // Dynamically import the component
      const { default: Component } = await import('./HeavyComponent');
      setHeavyComponent(() => Component);
    } catch (error) {
      console.error('Failed to load component:', error);
    }
  };

  return (
    <View>
      <Button
        title="Load Heavy Component"
        onPress={loadHeavyComponent}
      />
      {HeavyComponent && <HeavyComponent />}
    </View>
  );
};

// Conditional imports
const ConditionalComponent = ({ shouldLoadHeavy }) => {
  const [component, setComponent] = useState(null);

  React.useEffect(() => {
    if (shouldLoadHeavy) {
      import('./HeavyComponent').then(({ default: Component }) => {
        setComponent(() => Component);
      });
    }
  }, [shouldLoadHeavy]);

  return component ? component() : null;
};
```

#### **Asset Optimization**

```javascript
// Optimized image loading
const OptimizedImage = ({ source, style, ...props }) => {
  return (
    <Image
      source={source}
      style={style}
      // Performance optimizations
      resizeMode="cover"
      fadeDuration={0}
      // Use native driver when possible
      {...props}
    />
  );
};

// Preload critical images
const ImagePreloader = ({ images }) => {
  React.useEffect(() => {
    images.forEach(imageUri => {
      Image.prefetch(imageUri).catch(error => {
        console.warn('Failed to preload image:', error);
      });
    });
  }, [images]);

  return null;
};
```

### **Initial Render Optimization**

#### **Splash Screen Optimization**

```javascript
// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    // Initialize app asynchronously
    const initializeApp = async () => {
      try {
        // Load critical data
        await Promise.all([
          loadUserData(),
          preloadImages(),
          initializeAnalytics(),
        ]);
        
        setInitialRoute('Main');
      } catch (error) {
        console.error('App initialization failed:', error);
        setInitialRoute('Error');
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <AppNavigator initialRoute={initialRoute} />
    </NavigationContainer>
  );
};

const SplashScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>My App</Text>
    <ActivityIndicator size="large" />
  </View>
);
```

---

## **Network Performance**

### **API Optimization**

#### **Request Deduplication**

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
      setTimeout(() => this.cache.delete(key), 5000); // 5 second cache
    });

    return promise;
  }
}

const requestCache = new RequestCache();

const useApi = () => {
  const fetchData = useCallback(async (endpoint, params = {}) => {
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`;
    
    return requestCache.get(cacheKey, async () => {
      const response = await fetch(`https://api.example.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    });
  }, []);

  return { fetchData };
};
```

#### **Batch Requests**

```javascript
const BatchApiService = {
  requests: [],
  timeout: null,

  addRequest(request) {
    this.requests.push(request);
    
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    
    this.timeout = setTimeout(() => {
      this.executeBatch();
    }, 50); // 50ms batch window
  },

  async executeBatch() {
    if (this.requests.length === 0) return;

    const batch = this.requests.splice(0);
    
    try {
      const response = await fetch('https://api.example.com/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: batch.map(req => ({
            id: req.id,
            method: req.method,
            endpoint: req.endpoint,
            data: req.data,
          })),
        }),
      });

      const results = await response.json();
      
      // Resolve individual requests
      batch.forEach(req => {
        const result = results.find(r => r.id === req.id);
        if (result) {
          req.resolve(result.data);
        } else {
          req.reject(new Error('Request not found in batch response'));
        }
      });
    } catch (error) {
      // Reject all requests
      batch.forEach(req => req.reject(error));
    }
  },
};

const useBatchedApi = () => {
  const fetchData = useCallback((endpoint, data) => {
    return new Promise((resolve, reject) => {
      BatchApiService.addRequest({
        id: Date.now() + Math.random(),
        method: 'GET',
        endpoint,
        data,
        resolve,
        reject,
      });
    });
  }, []);

  return { fetchData };
};
```

---

## **Animation Performance**

### **Native Driver Animations**

```javascript
import React, { useRef, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';

const NativeDriverAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Use native driver for better performance
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // Enable native driver
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true, // Enable native driver
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Text>Animated Content</Text>
    </Animated.View>
  );
};
```

### **Layout Animation**

```javascript
import React, { useState } from 'react';
import { LayoutAnimation, UIManager, View, Text, Button } from 'react-native';

// Enable layout animations
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LayoutAnimationExample = () => {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'spring', property: 'scale' },
      update: { type: 'spring', property: 'scale' },
    });

    setItems(prev => [...prev, Date.now()]);
  };

  const removeItem = (index) => {
    LayoutAnimation.configureNext({
      duration: 300,
      delete: { type: 'spring', property: 'scale' },
    });

    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View>
      <Button title="Add Item" onPress={addItem} />
      {items.map((item, index) => (
        <View key={item} style={styles.item}>
          <Text>Item {index + 1}</Text>
          <Button title="Remove" onPress={() => removeItem(index)} />
        </View>
      ))}
    </View>
  );
};
```

---

## **Performance Monitoring**

### **Performance Profiling**

```javascript
import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';

const PerformanceProfiler = ({ children, name }) => {
  const startTime = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    console.log(`${name} render #${renderCount.current}: ${renderTime}ms`);
    
    startTime.current = Date.now();
  });

  return children;
};

// Usage
const MyComponent = () => {
  return (
    <PerformanceProfiler name="MyComponent">
      <View>
        <Text>Component Content</Text>
      </View>
    </PerformanceProfiler>
  );
};
```

### **FPS Monitoring**

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const FPSMonitor = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    let animationFrameId;

    const calculateFPS = () => {
      frameCount.current += 1;
      const currentTime = Date.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCount.current * 1000) / elapsed);
        setFps(currentFPS);
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(calculateFPS);
    };

    animationFrameId = requestAnimationFrame(calculateFPS);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <View style={styles.fpsContainer}>
      <Text style={styles.fpsText}>FPS: {fps}</Text>
    </View>
  );
};
```

---

## **Real Use Case**

### **E-commerce Product List Optimization**

```javascript
import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, View, Text, Image, ActivityIndicator } from 'react-native';

const OptimizedProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Memoized key extractor
  const keyExtractor = useCallback((item) => `product-${item.id}`, []);

  // Memoized render item with optimizations
  const renderItem = useCallback(({ item, index }) => (
    <ProductItem
      product={item}
      index={index}
      isFavorite={favorites.has(item.id)}
      onToggleFavorite={handleToggleFavorite}
      onPress={handleProductPress}
    />
  ), [favorites, handleToggleFavorite, handleProductPress]);

  // Optimized item layout
  const getItemLayout = useCallback((data, index) => ({
    length: PRODUCT_ITEM_HEIGHT,
    offset: PRODUCT_ITEM_HEIGHT * index,
    index,
  }), []);

  // Memoized product filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.price <= maxPrice && 
      product.category === selectedCategory
    );
  }, [products, maxPrice, selectedCategory]);

  // Handle favorite toggle
  const handleToggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  }, []);

  // Handle product press
  const handleProductPress = useCallback((product) => {
    navigation.navigate('ProductDetails', { productId: product.id });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={15}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={100}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
};

const ProductItem = React.memo(({ product, isFavorite, onToggleFavorite, onPress }) => {
  return (
    <View style={styles.productItem}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.productImage}
        defaultSource={require('./placeholder.png')}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
      <Button
        title={isFavorite ? 'Unfavorite' : 'Favorite'}
        onPress={() => onToggleFavorite(product.id)}
      />
    </View>
  );
});
```

---

## **Pro Tip**

**Use the React DevTools Profiler to identify performance bottlenecks in your React Native app. Focus on optimizing components that render frequently or have expensive render operations. Look for unnecessary re-renders and component trees that could be memoized.**

```javascript
// Install React DevTools
npm install react-devtools-core

// In your app entry point
import { DevSettings } from 'react-native';

if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
  DevSettings.reload();
}
```

---

## **Exercise / Mini Task**

**Task**: Optimize a React Native app with the following performance issues:

1. **Slow FlatList**: A list with 1000+ items that lags when scrolling
2. **Memory Leaks**: Components that don't clean up properly
3. **Excessive Re-renders**: Components re-rendering unnecessarily
4. **Large Bundle Size**: App takes too long to start up
5. **Poor Image Loading**: Images load slowly and consume too much memory

**Requirements**:
- Implement memoization for expensive components
- Optimize FlatList performance
- Fix memory leaks in useEffect hooks
- Implement lazy loading for heavy components
- Optimize image loading and caching

**Bonus**:
- Add performance monitoring
- Implement request deduplication
- Create a performance profiler
- Optimize animations with native driver
- Implement bundle splitting

---

*Performance optimization is crucial for creating smooth, responsive React Native applications. Master these techniques to ensure your apps provide excellent user experiences while maintaining efficient resource usage.*
