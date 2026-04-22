# Navigation

Learn how to implement navigation in React Native applications using React Navigation, including stack navigation, tab navigation, drawer navigation, and advanced navigation patterns.

## **What is Navigation?**

Navigation in React Native allows users to move between different screens and sections of your app, creating a seamless user experience with proper transitions and state management.

### **Key Concepts**
- **Screens**: Individual pages or views in your app
- **Navigators**: Containers that manage screen transitions
- **Routes**: Definitions of available screens
- **Navigation State**: Current navigation history and stack
- **Deep Linking**: Direct navigation to specific screens

---

## **React Navigation Setup**

### **Installation**

```bash
# Install React Navigation packages
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer

# Install dependencies
npm install react-native-screens react-native-safe-area-context

# For gesture handling (optional)
npm install react-native-gesture-handler react-native-reanimated
```

### **Basic Setup**

```javascript
// App.js
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

---

## **Stack Navigation**

### **Basic Stack Navigator**

```javascript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerRight: () => (
            <Button
              onPress={() => alert('Settings')}
              title="Settings"
              color="#fff"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};
```

### **Navigation Between Screens**

```javascript
// HomeScreen.js
import { View, Button, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      
      <Button
        title="Go to Profile"
        onPress={() => navigation.push('Profile')}
      />
      
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      
      <Button
        title="Go to Details with Params"
        onPress={() => navigation.navigate('Details', { 
          itemId: 42,
          itemName: 'Sample Item'
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
```

### **Passing and Receiving Parameters**

```javascript
// DetailsScreen.js
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route, navigation }) => {
  const { itemId, itemName } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text style={styles.text}>Item ID: {itemId}</Text>
      <Text style={styles.text}>Item Name: {itemName}</Text>
      
      <Button
        title="Update Header Title"
        onPress={() => navigation.setOptions({ title: itemName })}
      />
    </View>
  );
};

// Using the screen
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate('Details', {
            itemId: 42,
            itemName: 'Sample Item',
          });
        }}
      />
    </View>
  );
};
```

---

## **Tab Navigation**

### **Bottom Tab Navigator**

```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};
```

### **Custom Tab Bar**

```javascript
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabButton,
              { backgroundColor: isFocused ? '#f4511e' : '#fff' },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isFocused ? '#fff' : '#666' },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Usage in navigator
<Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
  {/* Your screens */}
</Tab.Navigator>
```

---

## **Drawer Navigation**

### **Basic Drawer Navigator**

```javascript
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
        drawerPosition: 'left',
        drawerType: 'front',
        drawerActiveTintColor: '#f4511e',
        drawerInactiveTintColor: '#666',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size, color }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          drawerIcon: ({ focused, size, color }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          drawerIcon: ({ focused, size, color }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
```

### **Custom Drawer Content**

```javascript
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Home')}
        >
          <Icon name="home" size={24} color="#666" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Profile')}
        >
          <Icon name="person" size={24} color="#666" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Settings')}
        >
          <Icon name="settings" size={24} color="#666" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('About')}
        >
          <Icon name="info" size={24} color="#666" />
          <Text style={styles.menuText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => props.navigation.navigate('Help')}
        >
          <Icon name="help" size={24} color="#666" />
          <Text style={styles.menuText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Icon name="logout" size={24} color="#f4511e" />
          <Text style={[styles.menuText, { color: '#f4511e' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f4511e',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
  },
  menuText: {
    marginLeft: 20,
    fontSize: 16,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// Usage in navigator
<Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
  {/* Your screens */}
</Drawer.Navigator>
```

---

## **Nested Navigation**

### **Combining Navigators**

```javascript
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={HomeTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Post" component={PostScreen} />
    </Stack.Navigator>
  );
};
```

### **Navigation Between Nested Screens**

```javascript
// In a tab screen
const FeedScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="Go to Post"
        onPress={() => navigation.navigate('Post', { postId: 123 })}
      />
    </View>
  );
};

// Navigate from parent navigator
const App = () => {
  const navigation = useNavigation();
  
  return (
    <View>
      <Button
        title="Navigate to nested screen"
        onPress={() => navigation.navigate('Main', { screen: 'Search' })}
      />
    </View>
  );
};
```

---

## **Advanced Navigation Patterns**

### **Modal Navigation**

```javascript
const MainStackNavigator = () => {
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Modal" 
        component={ModalScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          cardStyle: { backgroundColor: 'rgba(0,0,0,0.5)' },
        }}
      />
    </Stack.Navigator>
  );
};
```

### **Authentication Flow**

```javascript
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

// Authentication screens
const LoginScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Login Screen</Text>
      <Button
        title="Login"
        onPress={() => navigation.replace('MainApp')}
      />
    </View>
  );
};

const RegisterScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Register Screen</Text>
      <Button
        title="Register"
        onPress={() => navigation.replace('MainApp')}
      />
    </View>
  );
};

// Main app screens
const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Logout"
        onPress={() => navigation.replace('Auth')}
      />
    </View>
  );
};

// Auth navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Main app navigator
const MainNavigator = () => {
  return (
    <MainTab.Navigator>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
};

// Root navigator
const RootNavigator = () => {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
```

---

## **Deep Linking**

### **Basic Deep Linking**

```javascript
import { NavigationContainer, Linking } from '@react-navigation/native';

const linking = {
  prefixes: ['myapp://', 'https://myapp.com'],
  config: {
    screens: {
      Home: 'home',
      Profile: 'profile/:userId',
      Post: 'post/:postId',
      Settings: 'settings',
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
};
```

### **Handling Deep Links**

```javascript
const PostScreen = ({ route }) => {
  const { postId } = route.params;
  
  useEffect(() => {
    // Fetch post data based on postId
    fetchPost(postId);
  }, [postId]);

  return (
    <View>
      <Text>Post ID: {postId}</Text>
      {/* Post content */}
    </View>
  );
};

// Test deep links
const testDeepLink = () => {
  Linking.openURL('myapp://post/123');
};
```

---

## **Navigation Hooks and Utilities**

### **Common Navigation Hooks**

```javascript
import { 
  useNavigation, 
  useRoute, 
  useFocusEffect,
  useIsFocused 
} from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  // Run code when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Refresh data when screen is focused
      refreshData();
      
      return () => {
        // Cleanup when screen loses focus
        cleanup();
      };
    }, [])
  );

  // Check if screen is focused
  useEffect(() => {
    if (isFocused) {
      // Do something when screen is focused
    }
  }, [isFocused]);

  return (
    <View>
      <Button
        title="Navigate"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};
```

### **Custom Navigation Hook**

```javascript
import { useNavigation } from '@react-navigation/native';

const useNavigationWithParams = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return {
    ...navigation,
    params: route.params,
    navigateWithParams: (screen, params) => {
      navigation.navigate(screen, params);
    },
    replaceWithParams: (screen, params) => {
      navigation.replace(screen, params);
    },
    goBackWithData: (data) => {
      navigation.goBack();
      // Handle passing data back
      route.params?.onGoBack?.(data);
    },
  };
};

// Usage
const DetailsScreen = () => {
  const { params, navigateWithParams, goBackWithData } = useNavigationWithParams();
  
  const handleSave = (data) => {
    goBackWithData(data);
  };
  
  return (
    <View>
      <Text>Details: {params.itemId}</Text>
      <Button title="Save" onPress={() => handleSave({ saved: true })} />
    </View>
  );
};
```

---

## **Performance Optimization**

### **Lazy Loading Screens**

```javascript
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        lazy={true}
        options={{ title: 'Details' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        lazy={true}
        options={{ title: 'Profile' }}
      />
    </Stack.Navigator>
  );
};
```

### **Optimizing Tab Navigation**

```javascript
<Tab.Navigator
  screenOptions={{
    lazy: true, // Lazy load tab screens
    unmountOnBlur: false, // Keep screens in memory
  }}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Profile" component={ProfileScreen} />
</Tab.Navigator>
```

---

## **Real Use Case**

### **E-commerce App Navigation**

```javascript
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Product stack
const ProductStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={{ title: 'Product Details' }}
      />
      <Stack.Screen 
        name="Reviews" 
        component={ReviewsScreen}
        options={{ title: 'Reviews' }}
      />
    </Stack.Navigator>
  );
};

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Products" 
        component={ProductStack}
        options={{ 
          title: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <Icon name="shopping-bag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ 
          title: 'Cart',
          tabBarBadge: cartItems.length > 0 ? cartItems.length : null,
        }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{ title: 'Account' }}
      />
    </Tab.Navigator>
  );
};

// Main drawer navigator
const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Drawer.Screen 
        name="Wishlist" 
        component={WishlistScreen}
        options={{ title: 'Wishlist' }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ title: 'Help & Support' }}
      />
    </Drawer.Navigator>
  );
};

// Root navigator with authentication
const AppNavigator = () => {
  const [user, setUser] = useState(null);

  return (
    <NavigationContainer>
      {user ? (
        <MainDrawerNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};
```

---

## **Pro Tip**

**Use navigation params sparingly and consider using a state management solution for complex data sharing between screens. For large datasets, pass IDs instead of full objects and fetch the data in the target screen. This improves performance and reduces memory usage.**

```javascript
// Bad: Passing large objects
navigation.navigate('Details', { 
  user: largeUserObject, // This can cause performance issues
});

// Good: Passing IDs and fetching data
navigation.navigate('Details', { 
  userId: user.id, // Much more efficient
});

// In DetailsScreen
const DetailsScreen = ({ route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  
  // Render user data
};
```

---

## **Exercise / Mini Task**

**Task**: Create a complete navigation structure for a social media app with the following requirements:

1. **Authentication Flow**: Login and Register screens
2. **Main App**: Bottom tab navigation with Home, Search, Notifications, and Profile tabs
3. **Nested Navigation**: Each tab should have its own stack navigator
4. **Drawer Navigation**: Include additional screens like Settings, About, and Help
5. **Deep Linking**: Support deep links to user profiles and posts
6. **Custom Components**: Create custom tab bar and drawer content

**Bonus**:
- Implement lazy loading for all screens
- Add navigation animations
- Create a custom navigation hook
- Handle back button properly on Android
- Add navigation guards for protected routes

---

*Navigation is a crucial aspect of mobile app development. Master these concepts to create intuitive, performant, and user-friendly navigation experiences in your React Native applications.*
