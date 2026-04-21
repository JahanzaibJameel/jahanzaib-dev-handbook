# React Native Setup

## What is React Native Setup?

React Native Setup is the process of configuring your development environment to build cross-platform mobile applications using React. It involves installing necessary tools, configuring simulators/emulators, and setting up your first React Native project.

## Example

### Environment Setup

```bash
# Install Node.js (LTS version recommended)
# Visit https://nodejs.org/ and download the LTS version

# Verify Node.js installation
node --version  # Should be v16.x or higher
npm --version   # Should be 8.x or higher

# Install React Native CLI
npm install -g @react-native-community/cli

# For iOS development (macOS only)
# Install Xcode from App Store
xcode-select --install

# For Android development
# Download Android Studio from https://developer.android.com/studio
# Install Android SDK and configure ANDROID_HOME environment variable

# Set environment variables (add to ~/.bashrc or ~/.zshrc)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Project Creation

```bash
# Create new React Native project
npx react-native init MyAwesomeApp

# Navigate to project directory
cd MyAwesomeApp

# For iOS (macOS only)
npx react-native run-ios

# For Android
npx react-native run-android

# Alternative: Use Expo CLI (easier for beginners)
npx create-expo-app MyAwesomeApp
cd MyAwesomeApp
npm start
```

### Project Structure

```
MyAwesomeApp/
|-- android/                 # Android-specific code
|-- ios/                     # iOS-specific code
|-- src/                     # Your app source code
|   |-- components/          # Reusable components
|   |-- screens/             # Screen components
|   |-- navigation/          # Navigation configuration
|   |-- services/            # API services
|   |-- utils/               # Utility functions
|   |-- assets/              # Images, fonts, etc.
|   |-- hooks/               # Custom hooks
|   |-- context/             # React Context
|   |-- styles/              # Styling files
|-- App.js                   # Main app component
|-- package.json             # Dependencies
|-- metro.config.js          # Metro bundler config
|-- babel.config.js          # Babel configuration
|-- .eslintrc.js             # ESLint configuration
|-- .prettierrc              # Prettier configuration
```

## Real Use Case

### Professional Development Workflow

Companies like **Facebook**, **Instagram**, and **Tesla** use React Native for their mobile apps:

```javascript
// App.js - Professional app structure
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import LoadingProvider from './src/providers/LoadingProvider';
import ThemeProvider from './src/providers/ThemeProvider';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LoadingProvider>
          <SafeAreaProvider>
            <ErrorBoundary>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </ErrorBoundary>
          </SafeAreaProvider>
        </LoadingProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
```

### Development Scripts

```json
// package.json scripts
{
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "type-check": "tsc --noEmit",
    "clean": "react-native clean-project-auto",
    "pod-install": "cd ios && pod install",
    "build:android": "cd android && ./gradlew assembleRelease",
    "build:ios": "cd ios && xcodebuild -workspace MyAwesomeApp.xcworkspace -scheme MyAwesomeApp -configuration Release -destination generic/platform=iOS -archivePath MyAwesomeApp.xcarchive archive"
  }
}
```

## Pro Tip

**Use Expo CLI for Beginners, React Native CLI for Production**

```javascript
// utils/developmentHelper.js
class DevelopmentHelper {
  static detectEnvironment() {
    return {
      isExpo: !!Constants.expoConfig,
      isDev: __DEV__,
      isWeb: Platform.OS === 'web',
      platform: Platform.OS,
      version: Platform.Version
    };
  }

  static getDevelopmentConfig() {
    const env = this.detectEnvironment();
    
    return {
      apiUrl: env.isDev 
        ? 'http://localhost:3000/api' 
        : 'https://api.yourapp.com',
      enableDebugging: env.isDev,
      enableFlurry: !env.isDev,
      logLevel: env.isDev ? 'debug' : 'error'
    };
  }

  static setupDevelopmentTools() {
    if (__DEV__) {
      // React DevTools
      if (Platform.OS === 'web') {
        import('react-devtools').then((devtools) => {
          devtools.default();
        });
      }

      // Flipper (if available)
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Flipper integration happens automatically in debug mode
      }

      // Console logging with timestamps
      const originalLog = console.log;
      console.log = (...args) => {
        originalLog(`[${new Date().toISOString()}]`, ...args);
      };
    }
  }
}

// Custom Metro configuration for better development experience
// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders: [
      // Watch for changes in node_modules for development
      './node_modules',
    ],
  };
})();
```

## Exercise

**Set Up a Complete React Native Development Environment**

Create a comprehensive setup script and project initialization:

```bash
#!/bin/bash
# scripts/setup-react-native.sh

echo "React Native Development Environment Setup"
echo "=========================================="

# Check system requirements
check_requirements() {
    echo "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo "Node.js is not installed. Please install Node.js 16.x or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        echo "Node.js version 16.x or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    echo "Node.js: $(node -v) - OK"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed."
        exit 1
    fi
    
    echo "npm: $(npm -v) - OK"
    
    # Platform-specific checks
    case "$(uname -s)" in
        Darwin*)
            echo "macOS detected"
            if ! command -v xcodebuild &> /dev/null; then
                echo "Xcode is not installed. Please install Xcode from App Store."
                exit 1
            fi
            echo "Xcode: OK"
            ;;
        Linux*)
            echo "Linux detected"
            if ! command -v java &> /dev/null; then
                echo "Java is not installed. Please install Java 11 or higher."
                exit 1
            fi
            echo "Java: $(java -version 2>&1 | head -n 1) - OK"
            ;;
        CYGWIN*|MINGW*|MSYS*)
            echo "Windows detected"
            if ! command -v choco &> /dev/null; then
                echo "Chocolatey is not installed. Consider installing it for easier package management."
            fi
            ;;
    esac
}

# Install global packages
install_global_packages() {
    echo "Installing global packages..."
    
    # React Native CLI
    if ! command -v react-native &> /dev/null; then
        echo "Installing React Native CLI..."
        npm install -g @react-native-community/cli
    else
        echo "React Native CLI is already installed"
    fi
    
    # Expo CLI (optional)
    if ! command -v expo &> /dev/null; then
        echo "Installing Expo CLI..."
        npm install -g @expo/cli
    else
        echo "Expo CLI is already installed"
    fi
    
    # Useful development tools
    npm install -g react-devtools
}

# Create new project
create_project() {
    PROJECT_NAME=$1
    if [ -z "$PROJECT_NAME" ]; then
        echo "Please provide a project name: ./setup.sh <project-name>"
        exit 1
    fi
    
    echo "Creating React Native project: $PROJECT_NAME"
    
    # Choose between Expo and React Native CLI
    echo "Choose setup type:"
    echo "1) Expo (recommended for beginners)"
    echo "2) React Native CLI (for production apps)"
    read -p "Enter choice (1 or 2): " choice
    
    case $choice in
        1)
            echo "Creating Expo project..."
            npx create-expo-app $PROJECT_NAME --template
            ;;
        2)
            echo "Creating React Native CLI project..."
            npx react-native init $PROJECT_NAME
            ;;
        *)
            echo "Invalid choice. Creating Expo project..."
            npx create-expo-app $PROJECT_NAME --template
            ;;
    esac
    
    cd $PROJECT_NAME
    
    # Install additional dependencies
    echo "Installing additional dependencies..."
    npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
    npm install react-native-screens react-native-safe-area-context
    npm install @reduxjs/toolkit react-redux
    npm install axios
    npm install react-native-vector-icons
    
    # Install dev dependencies
    npm install --save-dev @types/react @types/react-native
    npm install --save-dev eslint prettier
    npm install --save-dev @testing-library/react-native jest
    
    echo "Project setup complete!"
    echo "To start development:"
    echo "  cd $PROJECT_NAME"
    echo "  npm start"
}

# Main execution
main() {
    check_requirements
    install_global_packages
    create_project $1
}

main $1
```

```javascript
// utils/projectInitializer.js
class ProjectInitializer {
  static async setupProject(projectName, options = {}) {
    const {
      type = 'expo', // 'expo' or 'cli'
      navigation = true,
      redux = true,
      testing = true,
      linting = true,
      icons = true
    } = options;

    console.log(`Setting up ${projectName} with ${type}...`);

    // Create project structure
    await this.createProjectStructure(projectName);
    
    // Install dependencies based on options
    if (navigation) await this.setupNavigation();
    if (redux) await this.setupRedux();
    if (testing) await this.setupTesting();
    if (linting) await this.setupLinting();
    if (icons) await this.setupIcons();
    
    // Create initial files
    await this.createInitialFiles(projectName, type);
    
    console.log(`Project ${projectName} setup complete!`);
  }

  static async createProjectStructure(name) {
    const fs = require('fs').promises;
    const path = require('path');
    
    const directories = [
      'src/components',
      'src/screens',
      'src/navigation',
      'src/services',
      'src/utils',
      'src/hooks',
      'src/context',
      'src/styles',
      'src/assets',
      'src/assets/images',
      'src/assets/fonts',
      '__tests__',
      '__tests__/components',
      '__tests__/screens',
      '__tests__/utils'
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  static async setupNavigation() {
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    await execAsync('npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs');
    await execAsync('npm install react-native-screens react-native-safe-area-context');
  }

  static async createInitialFiles(projectName, type) {
    const fs = require('fs').promises;
    
    // Create basic App.js
    const appContent = type === 'expo' ? this.getExpoAppContent() : this.getCliAppContent();
    await fs.writeFile('App.js', appContent);
    
    // Create basic navigation
    await fs.writeFile('src/navigation/AppNavigator.js', this.getNavigatorContent());
    
    // Create basic screen
    await fs.writeFile('src/screens/HomeScreen.js', this.getHomeScreenContent());
    
    // Create package.json scripts
    await this.updatePackageScripts();
  }

  static getExpoAppContent() {
    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}`;
  }

  static getCliAppContent() {
    return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;`;
  }

  static getNavigatorContent() {
    return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Welcome' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;`;
  }

  static getHomeScreenContent() {
    return `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native!</Text>
      <Text style={styles.subtitle}>Your app is ready to develop</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;`;
  }
}

// Usage example
const setupNewProject = async () => {
  await ProjectInitializer.setupProject('MyAwesomeApp', {
    type: 'expo',
    navigation: true,
    redux: true,
    testing: true,
    linting: true,
    icons: true
  });
};

module.exports = ProjectInitializer;
```

**Your Tasks:**
1. Run the setup script to create a new React Native project
2. Configure your development environment for your platform
3. Set up Android Studio or Xcode for mobile testing
4. Create your first custom component
5. Set up debugging tools (React DevTools, Flipper)

This exercise teaches you environment setup, project structure, dependency management, and development workflow for React Native applications.

---

**Next Up**: Learn about React Native Components and Props! Components & Props
