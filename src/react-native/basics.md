# React Native Basics

## What is React Native?

React Native is a framework developed by Facebook that allows you to build native mobile applications using JavaScript and React. It bridges JavaScript code to native UI components, giving you the performance and feel of a true native app while using the familiar React development paradigm.

## Example

### Basic Component Structure

```javascript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';

const CounterApp = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const showAlert = () => {
    Alert.alert(
      'Counter Info',
      `Current count: ${count}\nName: ${name || 'Not set'}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', onPress: () => setCount(0) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Counter</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      
      <View style={styles.counterContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.decrementButton]} 
          onPress={decrementCount}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.countText}>{count}</Text>
        
        <TouchableOpacity 
          style={[styles.button, styles.incrementButton]} 
          onPress={incrementCount}
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.alertButton} onPress={showAlert}>
        <Text style={styles.alertButtonText}>Show Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  decrementButton: {
    backgroundColor: '#ff6b6b',
  },
  incrementButton: {
    backgroundColor: '#51cf66',
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 60,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#339af0',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CounterApp;
```

### Essential Core Components

```javascript
import React from 'react';
import { 
  View,           // Container similar to div
  Text,           // Text display
  Image,          // Image display
  ScrollView,     // Scrollable container
  FlatList,       // Efficient list rendering
  TextInput,      // Text input
  TouchableOpacity, // Touchable button
  Modal,          // Modal overlay
  ActivityIndicator, // Loading spinner
  StyleSheet      // Styling
} from 'react-native';

const CoreComponentsDemo = () => {
  const data = [
    { id: '1', title: 'Item 1', description: 'First item description' },
    { id: '2', title: 'Item 2', description: 'Second item description' },
    { id: '3', title: 'Item 3', description: 'Third item description' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Components</Text>
        <Text style={styles.heading}>Heading Text</Text>
        <Text style={styles.bodyText}>This is body text with normal styling.</Text>
        <Text style={styles.highlightedText}>This text is highlighted!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image Component</Text>
        <Image 
          source={{ uri: 'https://via.placeholder.com/300x200' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>List Component</Text>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input Component</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type something here..."
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loading Indicator</Text>
        <ActivityIndicator size="large" color="#339af0" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d3436',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#636e72',
    marginBottom: 10,
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0984e3',
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  list: {
    maxHeight: 200,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default CoreComponentsDemo;
```

## Real Use Case

### Social Media Post Component

**Instagram** and **Twitter** use similar component patterns for their posts:

```javascript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Share,
  Alert
} from 'react-native';

const SocialMediaPost = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post: ${post.caption}`,
        url: post.image,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share this post');
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>...</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      
      {post.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={[styles.actionIcon, liked && styles.liked]}>
            {liked ? 'heart' : 'hearto'}
          </Text>
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>message</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionIcon}>send</Text>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 5,
  },
  moreText: {
    fontSize: 20,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  captionContainer: {
    padding: 15,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#666',
  },
  liked: {
    color: '#e74c3c',
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});

// Usage example
const samplePost = {
  id: '1',
  username: 'react_native_dev',
  userAvatar: 'https://via.placeholder.com/40',
  image: 'https://via.placeholder.com/400x300',
  caption: 'Just built an amazing React Native app! The performance is incredible. #ReactNative #MobileDev',
  likes: 42,
  comments: 8,
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
};

const SocialFeed = () => {
  const posts = [samplePost, samplePost, samplePost]; // Multiple posts

  return (
    <ScrollView style={styles.feedContainer}>
      {posts.map(post => (
        <SocialMediaPost key={post.id} post={post} />
      ))}
    </ScrollView>
  );
};

const feedStyles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export { SocialMediaPost, SocialFeed };
```

## Pro Tip

**Use Platform-Specific Code for Better User Experience**

```javascript
import { Platform, StyleSheet } from 'react-native';

// Platform-specific styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Platform-specific padding
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // iOS status bar
    backgroundColor: Platform.select({
      ios: '#f8f9fa',
      android: '#ffffff',
      default: '#f8f9fa',
    }),
  },
  button: {
    // Platform-specific shadows
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    // Platform-specific font families
    fontFamily: Platform.select({
      ios: 'San Francisco',
      android: 'Roboto',
      default: 'System',
    }),
    fontSize: Platform.select({
      ios: 16,
      android: 14,
      default: 16,
    }),
  },
});

// Platform-specific components
const PlatformAwareComponent = () => {
  const getPlatformSpecificProps = () => {
    if (Platform.OS === 'ios') {
      return {
        color: '#007AFF', // iOS blue
        underlayColor: '#0056CC',
      };
    } else {
      return {
        color: '#2196F3', // Material blue
        rippleColor: '#1976D2',
      };
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getPlatformSpecificProps()]}
      onPress={() => console.log('Button pressed')}
    >
      <Text style={styles.text}>Platform-Aware Button</Text>
    </TouchableOpacity>
  );
};

// Platform-specific file imports
const getPlatformComponent = () => {
  if (Platform.OS === 'ios') {
    return require('./components/IOSComponent').default;
  } else {
    return require('./components/AndroidComponent').default;
  }
};

// Performance optimization tips
const PerformanceOptimizedComponent = ({ data }) => {
  // Use React.memo for component memoization
  const renderItem = React.memo(({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  ));

  // Use FlatList for large datasets
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      removeClippedSubviews={true} // Performance optimization
      maxToRenderPerBatch={10} // Batch rendering
      windowSize={10} // Render window size
      initialNumToRender={5} // Initial render count
      getItemLayout={(data, index) => ({
        length: 50, // Item height
        offset: 50 * index,
        index,
      })}
    />
  );
};

// Custom hooks for platform-specific logic
const usePlatformSpecificLogic = () => {
  const [platformInfo, setPlatformInfo] = useState({});

  useEffect(() => {
    setPlatformInfo({
      os: Platform.OS,
      version: Platform.Version,
      isPad: Platform.isPad,
      isTVOS: Platform.isTVOS,
      constants: Platform.constants,
    });
  }, []);

  return platformInfo;
};
```

## Exercise

**Build a Complete To-Do List Application**

Create a fully functional to-do list app with all the core React Native concepts:

```javascript
// TodoListApp.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';

const TodoListApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Load todos from storage (simulated)
  useEffect(() => {
    // In a real app, you'd use AsyncStorage here
    const savedTodos = [
      { id: '1', text: 'Learn React Native basics', completed: true },
      { id: '2', text: 'Build a to-do app', completed: false },
      { id: '3', text: 'Master React Native navigation', completed: false },
    ];
    setTodos(savedTodos);
  }, []);

  // Add new todo
  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo = {
        id: Date.now().toString(),
        text: inputText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([newTodo, ...todos]);
      setInputText('');
    }
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete todo
  const deleteTodo = (id) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => todo.id !== id)),
        },
      ]
    );
  };

  // Start editing todo
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setInputText(todo.text);
    setModalVisible(true);
  };

  // Update todo
  const updateTodo = () => {
    if (inputText.trim() && editingTodo) {
      setTodos(todos.map(todo =>
        todo.id === editingTodo.id
          ? { ...todo, text: inputText.trim(), updatedAt: new Date().toISOString() }
          : todo
      ));
      setModalVisible(false);
      setEditingTodo(null);
      setInputText('');
    }
  };

  // Clear completed todos
  const clearCompleted = () => {
    Alert.alert(
      'Clear Completed',
      'Delete all completed todos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => !todo.completed)),
        },
      ]
    );
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Get statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length,
  };

  // Render todo item
  const renderTodo = ({ item }) => (
    <View style={styles.todoItem}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        onPress={() => toggleTodo(item.id)}
      >
        <Text style={[styles.checkboxText, item.completed && styles.checkboxTextChecked]}>
          {item.completed ? 'check' : ''}
        </Text>
      </TouchableOpacity>

      <View style={styles.todoContent}>
        <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
          {item.text}
        </Text>
        <Text style={styles.todoDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.todoActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => startEditing(item)}
        >
          <Text style={styles.editButtonText}>edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTodo(item.id)}
        >
          <Text style={styles.deleteButtonText}>delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Todos</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {stats.active} active, {stats.completed} completed
          </Text>
        </View>
      </View>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Add a new todo..."
          placeholderTextColor="#999"
          onSubmitEditing={addTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        {['all', 'active', 'completed'].map(filterType => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todo list */}
      <FlatList
        data={filteredTodos}
        renderItem={renderTodo}
        keyExtractor={item => item.id}
        style={styles.todoList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No todos yet!</Text>
            <Text style={styles.emptySubtext}>Add one above to get started</Text>
          </View>
        }
      />

      {/* Clear completed button */}
      {stats.completed > 0 && (
        <View style={styles.clearContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearCompleted}>
            <Text style={styles.clearButtonText}>
              Clear Completed ({stats.completed})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Edit modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            <TextInput
              style={styles.modalInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Update todo..."
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingTodo(null);
                  setInputText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton]}
                onPress={updateTodo}
              >
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  stats: {
    marginTop: 5,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    width: 60,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoList: {
    flex: 1,
    padding: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkboxText: {
    fontSize: 12,
    color: '#fff',
  },
  checkboxTextChecked: {
    color: '#fff',
  },
  todoContent: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  todoDate: {
    fontSize: 12,
    color: '#999',
  },
  todoActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 5,
  },
  editButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  clearContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TodoListApp;
```

**Your Tasks:**
1. Build the complete to-do list application
2. Add persistent storage using AsyncStorage
3. Implement drag-and-drop reordering
4. Add categories and priorities
5. Create a statistics dashboard
6. Add search functionality
7. Implement undo/redo functionality

This exercise teaches you all the fundamental React Native concepts: components, state management, lists, modals, user input, styling, and platform-specific considerations.

---

**Next Up**: Learn about React Native Styling! Styling (Tailwind / StyleSheet)
