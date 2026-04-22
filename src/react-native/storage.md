# Storage & Persistence

Learn how to implement data storage and persistence in React Native applications using AsyncStorage, SQLite, Realm, and other storage solutions.

## **What is Data Persistence?**

Data persistence in React Native involves storing data locally on the device so it persists between app launches and can be accessed offline. This includes user preferences, cached data, and offline content.

### **Storage Types**
- **AsyncStorage**: Simple key-value storage for small amounts of data
- **SQLite**: Relational database for structured data
- **Realm**: Object-oriented database for complex data models
- **File System**: Direct file storage for documents and media
- **Secure Storage**: Encrypted storage for sensitive data

---

## **AsyncStorage**

### **Basic Usage**

#### **Installation**

```bash
# Install AsyncStorage
npm install @react-native-async-storage/async-storage

# For iOS
cd ios && pod install
```

#### **Basic Operations**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Retrieve data
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Remove data
const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log('Data removed successfully');
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

// Clear all data
const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
```

#### **User Preferences Example**

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState('medium');

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem('darkMode');
      const savedNotifications = await AsyncStorage.getItem('notifications');
      const savedFontSize = await AsyncStorage.getItem('fontSize');

      if (savedDarkMode !== null) {
        setDarkMode(JSON.parse(savedDarkMode));
      }
      if (savedNotifications !== null) {
        setNotifications(JSON.parse(savedNotifications));
      }
      if (savedFontSize !== null) {
        setFontSize(savedFontSize);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleDarkMode = (value) => {
    setDarkMode(value);
    saveSettings('darkMode', value);
  };

  const toggleNotifications = (value) => {
    setNotifications(value);
    saveSettings('notifications', value);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    saveSettings('fontSize', size);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={toggleNotifications}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text>Font Size</Text>
        <View style={styles.fontSizeButtons}>
          {['small', 'medium', 'large'].map(size => (
            <Button
              key={size}
              title={size}
              onPress={() => changeFontSize(size)}
              color={fontSize === size ? '#007AFF' : '#ccc'}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
```

---

## **SQLite Database**

### **Setup and Configuration**

#### **Installation**

```bash
# Install SQLite
npm install react-native-sqlite-storage

# For iOS
cd ios && pod install
```

#### **Database Setup**

```javascript
import SQLite from 'react-native-sqlite-storage';

// Enable debugging
SQLite.DEBUG(true);
SQLite.enablePromise(true);

// Database configuration
const database_name = 'AppDatabase.db';
const database_version = '1.0';
const database_displayname = 'App Database';
const database_size = 200000;

let db;

// Open database
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      (db) => {
        console.log('Database opened');
        resolve(db);
      },
      (error) => {
        console.error('Error opening database:', error);
        reject(error);
      }
    );
  });
};

// Initialize database
const initDatabase = async () => {
  try {
    db = await openDatabase();
    await createTables();
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Users table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
        [],
        () => {
          console.log('Users table created successfully');
        },
        (error) => {
          console.error('Error creating users table:', error);
        }
      );

      // Posts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT,
          user_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        );`,
        [],
        () => {
          console.log('Posts table created successfully');
          resolve();
        },
        (error) => {
          console.error('Error creating posts table:', error);
          reject(error);
        }
      );
    });
  });
};
```

#### **CRUD Operations**

```javascript
// Insert data
const insertUser = (name, email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [name, email],
        (tx, results) => {
          console.log('User inserted successfully');
          resolve(results.insertId);
        },
        (tx, error) => {
          console.error('Error inserting user:', error);
          reject(error);
        }
      );
    });
  });
};

// Query data
const getUsers = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users ORDER BY created_at DESC',
        [],
        (tx, results) => {
          const users = [];
          for (let i = 0; i < results.rows.length; i++) {
            users.push(results.rows.item(i));
          }
          console.log('Users retrieved successfully');
          resolve(users);
        },
        (tx, error) => {
          console.error('Error retrieving users:', error);
          reject(error);
        }
      );
    });
  });
};

// Update data
const updateUser = (id, name, email) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (tx, results) => {
          console.log('User updated successfully');
          resolve(results.rowsAffected);
        },
        (tx, error) => {
          console.error('Error updating user:', error);
          reject(error);
        }
      );
    });
  });
};

// Delete data
const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?',
        [id],
        (tx, results) => {
          console.log('User deleted successfully');
          resolve(results.rowsAffected);
        },
        (tx, error) => {
          console.error('Error deleting user:', error);
          reject(error);
        }
      );
    });
  });
};
```

#### **React Component Integration**

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    initializeDatabase();
    loadUsers();
  }, []);

  const initializeDatabase = async () => {
    try {
      await initDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const userList = await getUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!name || !email) {
      alert('Please enter both name and email');
      return;
    }

    try {
      await insertUser(name, email);
      setName('');
      setEmail('');
      loadUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <Button
        title="Delete"
        onPress={() => deleteUser(item.id)}
        color="red"
      />
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Add User" onPress={addUser} />
      </View>
      
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text>No users found</Text>}
      />
    </View>
  );
};
```

---

## **Realm Database**

### **Setup and Configuration**

#### **Installation**

```bash
# Install Realm
npm install realm

# For iOS
cd ios && pod install
```

#### **Database Setup**

```javascript
import Realm from 'realm';

// Define schema
const UserSchema = {
  name: 'User',
  properties: {
    id: { type: 'int', default: Date.now() },
    name: 'string',
    email: 'string',
    posts: { type: 'list', objectType: 'Post' },
    createdAt: { type: 'date', default: new Date() },
  },
};

const PostSchema = {
  name: 'Post',
  properties: {
    id: { type: 'int', default: Date.now() },
    title: 'string',
    content: 'string',
    user: { type: 'linkingObjects', objectType: 'User', property: 'posts' },
    createdAt: { type: 'date', default: new Date() },
  },
};

// Initialize Realm
const realm = new Realm({
  schema: [UserSchema, PostSchema],
  schemaVersion: 1,
});

export default realm;
```

#### **CRUD Operations**

```javascript
// Create user
const createUser = (name, email) => {
  realm.write(() => {
    const user = realm.create('User', {
      name: name,
      email: email,
    });
    return user;
  });
};

// Read users
const getUsers = () => {
  return realm.objects('User');
};

// Update user
const updateUser = (id, name, email) => {
  realm.write(() => {
    const user = realm.objects('User').filtered(`id = ${id}`)[0];
    if (user) {
      user.name = name;
      user.email = email;
    }
  });
};

// Delete user
const deleteUser = (id) => {
  realm.write(() => {
    const user = realm.objects('User').filtered(`id = ${id}`)[0];
    if (user) {
      realm.delete(user);
    }
  });
};

// Query with filters
const searchUsers = (searchTerm) => {
  return realm.objects('User').filtered(
    `name CONTAINS[c] $0 OR email CONTAINS[c] $0`,
    searchTerm
  );
};
```

---

## **File System Storage**

### **Document Storage**

```javascript
import { DocumentDirectoryPath, writeFile, readFile, exists } from 'react-native-fs';

const saveDocument = async (filename, content) => {
  try {
    const path = `${DocumentDirectoryPath}/${filename}`;
    await writeFile(path, content, 'utf8');
    console.log('Document saved successfully');
    return path;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};

const loadDocument = async (filename) => {
  try {
    const path = `${DocumentDirectoryPath}/${filename}`;
    const exists = await exists(path);
    
    if (!exists) {
      return null;
    }
    
    const content = await readFile(path, 'utf8');
    return content;
  } catch (error) {
    console.error('Error loading document:', error);
    throw error;
  }
};

// Usage example
const DocumentManager = () => {
  const [document, setDocument] = useState('');
  const [filename, setFilename] = useState('notes.txt');

  const saveDocument = async () => {
    try {
      await saveDocument(filename, document);
      alert('Document saved successfully');
    } catch (error) {
      alert('Failed to save document');
    }
  };

  const loadDocument = async () => {
    try {
      const content = await loadDocument(filename);
      if (content) {
        setDocument(content);
      }
    } catch (error) {
      alert('Failed to load document');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Filename"
        value={filename}
        onChangeText={setFilename}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Document content"
        value={document}
        onChangeText={setDocument}
        multiline
        numberOfLines={10}
      />
      <View style={styles.buttonContainer}>
        <Button title="Load" onPress={loadDocument} />
        <Button title="Save" onPress={saveDocument} />
      </View>
    </View>
  );
};
```

---

## **Secure Storage**

### **Encrypted Storage**

```javascript
import EncryptedStorage from 'react-native-encrypted-storage';

// Store sensitive data
const storeSecureData = async (key, value) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
    console.log('Secure data stored successfully');
  } catch (error) {
    console.error('Error storing secure data:', error);
  }
};

// Retrieve sensitive data
const getSecureData = async (key) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

// Authentication token storage
const TokenManager = {
  storeToken: async (token) => {
    await storeSecureData('auth_token', {
      token: token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    });
  },

  getToken: async () => {
    const tokenData = await getSecureData('auth_token');
    if (!tokenData) {
      return null;
    }

    if (Date.now() > tokenData.expiresAt) {
      await EncryptedStorage.removeItem('auth_token');
      return null;
    }

    return tokenData.token;
  },

  removeToken: async () => {
    try {
      await EncryptedStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },
};
```

---

## **Data Synchronization**

### **Offline-First Architecture**

```javascript
import NetInfo from '@react-native-community/netinfo';

class DataManager {
  constructor() {
    this.isOnline = true;
    this.pendingOperations = [];
    this.setupNetworkListener();
  }

  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected;
      if (this.isOnline) {
        this.syncPendingOperations();
      }
    });
  }

  async saveData(data, isCritical = false) {
    // Save to local storage immediately
    await this.saveToLocalStorage(data);

    if (this.isOnline || isCritical) {
      try {
        // Sync with server
        await this.syncWithServer(data);
      } catch (error) {
        // Add to pending operations if sync fails
        this.pendingOperations.push({ type: 'save', data });
      }
    } else {
      // Add to pending operations for later sync
      this.pendingOperations.push({ type: 'save', data });
    }
  }

  async syncPendingOperations() {
    const operations = [...this.pendingOperations];
    this.pendingOperations = [];

    for (const operation of operations) {
      try {
        if (operation.type === 'save') {
          await this.syncWithServer(operation.data);
        }
      } catch (error) {
        // Re-add to pending operations if sync fails
        this.pendingOperations.push(operation);
      }
    }
  }

  async saveToLocalStorage(data) {
    // Implement local storage logic
    await AsyncStorage.setItem(`data_${data.id}`, JSON.stringify(data));
  }

  async syncWithServer(data) {
    // Implement server sync logic
    const response = await fetch('https://api.example.com/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    return response.json();
  }
}

const dataManager = new DataManager();
```

---

## **Real Use Case**

### **E-commerce App Storage**

```javascript
// Storage service for e-commerce app
class EcommerceStorage {
  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    try {
      this.db = await initDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  // User preferences
  async saveUserPreferences(preferences) {
    await AsyncStorage.setItem('user_preferences', JSON.stringify(preferences));
  }

  async getUserPreferences() {
    const preferences = await AsyncStorage.getItem('user_preferences');
    return preferences ? JSON.parse(preferences) : {};
  }

  // Shopping cart
  async saveCart(cart) {
    await AsyncStorage.setItem('shopping_cart', JSON.stringify(cart));
  }

  async getCart() {
    const cart = await AsyncStorage.getItem('shopping_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
  }

  // Order history
  async saveOrder(order) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO orders (user_id, total, status, items, created_at) 
           VALUES (?, ?, ?, ?, ?)`,
          [order.userId, order.total, order.status, JSON.stringify(order.items), new Date()],
          (tx, results) => {
            resolve(results.insertId);
          },
          (tx, error) => {
            reject(error);
          }
        );
      });
    });
  }

  async getOrders(userId) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
          [userId],
          (tx, results) => {
            const orders = [];
            for (let i = 0; i < results.rows.length; i++) {
              const order = results.rows.item(i);
              order.items = JSON.parse(order.items);
              orders.push(order);
            }
            resolve(orders);
          },
          (tx, error) => {
            reject(error);
          }
        );
      });
    });
  }

  // Product cache
  async cacheProducts(products) {
    await AsyncStorage.setItem('cached_products', JSON.stringify(products));
  }

  async getCachedProducts() {
    const cached = await AsyncStorage.getItem('cached_products');
    return cached ? JSON.parse(cached) : [];
  }

  // Wishlist
  async addToWishlist(productId) {
    const wishlist = await this.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }

  async removeFromWishlist(productId) {
    const wishlist = await this.getWishlist();
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      wishlist.splice(index, 1);
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }

  async getWishlist() {
    const wishlist = await AsyncStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  }
}

const storage = new EcommerceStorage();

// Usage in component
const ShoppingCartScreen = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await storage.getCart();
      setCart(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const updateCart = async (newCart) => {
    try {
      setCart(newCart);
      await storage.saveCart(newCart);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.items.find(item => item.id === product.id);
    let newItems;

    if (existingItem) {
      newItems = cart.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...cart.items, { ...product, quantity: 1 }];
    }

    const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateCart({ items: newItems, total: newTotal });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      <Text style={styles.total}>Total: ${cart.total.toFixed(2)}</Text>
      {/* Cart items rendering */}
    </View>
  );
};
```

---

## **Pro Tip**

**Implement a storage abstraction layer to make it easy to switch between different storage solutions. This allows you to start with AsyncStorage for simple use cases and migrate to SQLite or Realm as your needs grow, without changing your application code.**

```javascript
// Storage abstraction
class StorageService {
  constructor(storageType = 'async') {
    this.storageType = storageType;
    this.initStorage();
  }

  initStorage() {
    switch (this.storageType) {
      case 'async':
        this.storage = AsyncStorage;
        break;
      case 'sqlite':
        this.storage = new SQLiteService();
        break;
      case 'realm':
        this.storage = new RealmService();
        break;
      default:
        this.storage = AsyncStorage;
    }
  }

  async set(key, value) {
    return this.storage.set(key, value);
  }

  async get(key) {
    return this.storage.get(key);
  }

  async remove(key) {
    return this.storage.remove(key);
  }
}

// Usage
const storage = new StorageService('sqlite'); // Easy to switch storage type
```

---

## **Exercise / Mini Task**

**Task**: Create a comprehensive storage solution for a note-taking app with the following features:

1. **AsyncStorage**: Store user preferences and settings
2. **SQLite**: Store notes with categories and tags
3. **File System**: Store attachments and images
4. **Secure Storage**: Store sensitive information like passwords
5. **Offline Sync**: Implement offline-first architecture

**Requirements**:
- Create, read, update, and delete notes
- Add categories and tags to notes
- Store attachments with notes
- Sync data when online
- Cache recent notes for offline access
- Implement search functionality
- Add user preferences (theme, font size, etc.)

**Bonus**:
- Implement data encryption
- Add backup and restore functionality
- Create data migration system
- Implement conflict resolution
- Add data analytics and usage tracking

---

*Data persistence is essential for creating robust React Native applications. Choose the right storage solution based on your data structure, size, and security requirements to ensure optimal performance and user experience.*
