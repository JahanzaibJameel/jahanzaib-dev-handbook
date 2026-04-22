# Deployment

Learn how to build and deploy React Native applications to app stores, including App Store, Google Play, and alternative distribution methods.

## **What is App Deployment?**

App deployment is the process of preparing, building, and distributing your React Native application to users through official app stores or alternative channels.

### **Deployment Overview**
- **Build Process**: Convert source code into distributable app packages
- **Store Submission**: Upload apps to official app stores
- **Review Process**: Pass store review and approval
- **Distribution**: Make apps available to end users
- **Updates**: Handle app updates and version management

---

## **Building for Production**

### **iOS Build Process**

#### **Prerequisites**
- **Apple Developer Account**: Required for App Store distribution
- **Xcode**: Latest version for iOS development
- **Mac Computer**: Required for iOS builds
- **Code Signing Certificates**: Provisioning profiles and certificates

#### **Build Configuration**

```bash
# Install dependencies
npm install

# Clean previous builds
npx react-native clean

# Build for iOS
cd ios
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath YourApp.xcarchive \
  archive
```

#### **Xcode Configuration**

1. **Open Project**: Open `ios/YourApp.xcworkspace` in Xcode
2. **Select Target**: Choose your app target
3. **Build Settings**:
   - **Deployment Target**: Set minimum iOS version
   - **Bundle Identifier**: Unique app identifier
   - **Code Signing**: Configure provisioning profile
   - **Version**: Set app version and build number

4. **Capabilities**:
   - Push notifications
   - Background modes
   - App transport security
   - Custom URL schemes

### **Android Build Process**

#### **Prerequisites**
- **Google Play Developer Account**: Required for Play Store distribution
- **Android Studio**: Latest version for Android development
- **Keystore**: Signing key for app distribution
- **API Keys**: Google Play Console API access

#### **Generate Signing Key**

```bash
# Generate release keystore
keytool -genkey -v -keystore your-app-release-key.keystore \
  -alias your-app-key-alias -keyalg RSA -keysize 2048 \
  -validity 10000

# Set environment variables
export MYAPP_RELEASE_STORE_FILE=your-app-release-key.keystore
export MYAPP_RELEASE_KEY_ALIAS=your-app-key-alias
export MYAPP_RELEASE_KEY_PASSWORD=your-keystore-password
export MYAPP_RELEASE_KEY_STORE_PASSWORD=your-keystore-password
```

#### **Build Configuration**

```javascript
// android/app/build.gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_KEY_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

#### **Build APK/AAB**

```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (recommended for Play Store)
./gradlew bundleRelease
```

---

## **App Store Deployment**

### **iOS App Store**

#### **App Store Connect Setup**

1. **Create App Record**:
   - Log in to App Store Connect
   - Click "My Apps" then "+"
   - Fill app information and metadata

2. **App Information**:
   - **App Name**: Display name in App Store
   - **Primary Language**: Default language
   - **Bundle ID**: Unique identifier
   - **SKU**: Internal product identifier

3. **Pricing and Availability**:
   - **Price Tier**: Set app price
   - **Availability**: Countries/regions
   - **Release Date**: Initial release schedule

#### **App Metadata**

```json
{
  "name": "Your App Name",
  "description": "Comprehensive app description",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "category": "App Store category",
  "privacy_policy": "https://yourapp.com/privacy",
  "support_url": "https://yourapp.com/support"
}
```

#### **Screenshots and Media**

**Required Screenshots**:
- **iPhone 6.7" Display**: 1290 x 2796 pixels
- **iPhone 6.5" Display**: 1242 x 2208 pixels
- **iPhone 5.5" Display**: 1242 x 2208 pixels
- **iPad Pro (12.9")**: 2048 x 2732 pixels
- **iPad Pro (11")**: 1668 x 2388 pixels

**App Preview Requirements**:
- **Duration**: 15-30 seconds
- **Format**: MPEG-4 video (.mp4)
- **Resolution**: Same as screenshots
- **Frame Rate**: 30-60 FPS

#### **App Review Process**

1. **Submit for Review**:
   - Upload build through Xcode or Application Loader
   - Complete app information
   - Submit for review

2. **Review Timeline**:
   - **Initial Review**: 24-48 hours
   - **Additional Review**: 1-7 days
   - **Rejection**: Fix issues and resubmit

3. **Common Rejection Reasons**:
   - **Crashes**: App crashes on launch or during use
   - **Metadata**: Incomplete or inaccurate information
   - **Guidelines**: Violation of App Store guidelines
   - **Performance**: Poor performance or battery drain

### **Google Play Store**

#### **Google Play Console Setup**

1. **Create Application**:
   - Log in to Google Play Console
   - Click "Create application"
   - Select app type and fill details

2. **Store Listing**:
   - **App Name**: 30 characters max
   - **Short Description**: 80 characters max
   - **Full Description**: 4000 characters max
   - **Category**: Primary and secondary categories

3. **Content Rating**:
   - Complete content rating questionnaire
   - Target audience and content warnings
   - Age-appropriate ratings

#### **App Release**

```bash
# Upload AAB to Google Play Console
# Or use Google Play CLI
bundletool build-apks --bundle=app-release.aab --output=app-release.apks
```

**Release Tracks**:
- **Internal**: Testing with specific users
- **Alpha**: Limited testing with opt-in users
- **Beta**: Open testing with public access
- **Production**: Full public release

#### **Review Process**

1. **Automated Review**:
   - **Malware Scanning**: Security analysis
   - **Policy Compliance**: Automated policy checks
   - **Performance Analysis**: App performance metrics

2. **Manual Review**:
   - **Content Review**: Human review of app content
   - **Functionality Testing**: App functionality verification
   - **User Experience**: Overall user experience assessment

---

## **Alternative Distribution**

### **Enterprise Distribution**

#### **iOS Enterprise Program**

```bash
# Build enterprise distribution
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -destination generic/platform=iOS \
  -archivePath YourApp.xcarchive \
  archive

# Export enterprise IPA
xcodebuild -exportArchive \
  -archivePath YourApp.xcarchive \
  -exportPath ./export \
  -exportOptionsPlist EnterpriseExport.plist
```

**Enterprise Distribution Methods**:
- **MDM (Mobile Device Management)**: Centralized device management
- **Web Distribution**: Direct download from website
- **Email Distribution**: Send IPA files via email

#### **Android Enterprise**

```bash
# Build signed APK for enterprise
./gradlew assembleRelease

# Upload to enterprise console
# Or distribute via private channels
```

### **Direct Distribution**

#### **Over-the-Air (OTA) Updates**

```javascript
// Check for updates
const checkForUpdates = async () => {
  try {
    const response = await fetch('https://api.yourapp.com/version');
    const latestVersion = await response.json();
    
    const currentVersion = Constants.manifest.version;
    
    if (latestVersion.version > currentVersion) {
      // Prompt user to update
      Alert.alert(
        'Update Available',
        'A new version is available. Would you like to update?',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Update', onPress: () => downloadUpdate(latestVersion.url) }
        ]
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
```

#### **CodePush (React Native)**

```bash
# Install CodePush
npm install @react-native-code-push/code-push

# Link native dependencies
npx react-native link @react-native-code-push/code-push
```

```javascript
import CodePush from "@react-native-code-push/code-push";

// Wrap your app component
class App extends Component {
  // ... your app code
}

export default CodePush(App);
```

---

## **Continuous Deployment**

### **CI/CD Pipeline Setup**

#### **GitHub Actions for iOS**

```yaml
# .github/workflows/ios-build.yml
name: Build and Deploy iOS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd ios && pod install
        
    - name: Build iOS
      run: |
        cd ios
        xcodebuild -workspace YourApp.xcworkspace \
          -scheme YourApp \
          -configuration Release \
          -destination generic/platform=iOS \
          -archivePath YourApp.xcarchive \
          archive
          
    - name: Upload Artifact
      uses: actions/upload-artifact@v3
      with:
        name: ios-build
        path: ios/YourApp.xcarchive
```

#### **GitHub Actions for Android**

```yaml
# .github/workflows/android-build.yml
name: Build and Deploy Android

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
        
    - name: Setup Android SDK
      uses: android-actions/setup-android@v2
      
    - name: Install dependencies
      run: npm install
      
    - name: Build Android
      run: |
        cd android
        ./gradlew assembleRelease
        
    - name: Upload Artifact
      uses: actions/upload-artifact@v3
      with:
        name: android-build
        path: android/app/build/outputs/apk/release/
```

### **Automated Deployment Scripts**

#### **Fastlane Integration**

```ruby
# Fastfile
platform :ios do
  desc "Build and upload to TestFlight"
  lane :beta do
    build_app(
      workspace: "YourApp.xcworkspace",
      scheme: "YourApp",
      export_method: "app-store"
    )
    
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end
  
  desc "Build and upload to App Store"
  lane :release do
    build_app(
      workspace: "YourApp.xcworkspace",
      scheme: "YourApp",
      export_method: "app-store"
    )
    
    upload_to_app_store(
      force: true,
      reject_if_possible: false
    )
  end
end

platform :android do
  desc "Build and upload to Google Play"
  lane :release do
    gradle(
      task: "bundleRelease",
      project_dir: "android"
    )
    
    upload_to_play_store(
      track: "production",
      aab: "../android/app/build/outputs/bundle/release/app-release.aab"
    )
  end
end
```

---

## **Version Management**

### **Semantic Versioning**

#### **Version Structure**
- **Major**: Breaking changes (2.0.0)
- **Minor**: New features (1.2.0)
- **Patch**: Bug fixes (1.2.1)

#### **Version Configuration**

```javascript
// package.json
{
  "version": "1.2.3",
  "name": "your-app"
}

// iOS version (Info.plist)
<key>CFBundleShortVersionString</key>
<string>1.2.3</string>
<key>CFBundleVersion</key>
<string>123</string>

// Android version (build.gradle)
android {
    defaultConfig {
        versionCode 123
        versionName "1.2.3"
    }
}
```

### **Update Strategies**

#### **Forced Updates**

```javascript
const checkForcedUpdate = async () => {
  try {
    const response = await fetch('https://api.yourapp.com/version');
    const { minVersion, currentVersion } = await response.json();
    
    const appVersion = Constants.manifest.version;
    
    if (compareVersions(appVersion, minVersion) < 0) {
      // Force update required
      Alert.alert(
        'Update Required',
        'This version is no longer supported. Please update to continue using the app.',
        [
          { text: 'Update', onPress: () => Linking.openURL(updateUrl) }
        ],
        { cancelable: false }
      );
    } else if (compareVersions(appVersion, currentVersion) < 0) {
      // Optional update available
      Alert.alert(
        'Update Available',
        'A new version is available with new features and improvements.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Update', onPress: () => Linking.openURL(updateUrl) }
        ]
      );
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};
```

---

## **Security Considerations**

### **Code Obfuscation**

#### **Android ProGuard**

```javascript
// android/app/proguard-rules.pro
# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep native modules
-keep class com.yourapp.** { *; }

# Remove debug logs
-assumenosideeffects class android.util.Log {
    public static *** v(...);
    public static *** d(...);
    public static *** i(...);
}
```

#### **iOS Code Protection**

```bash
# Enable bitcode in Xcode build settings
# Enable address sanitizer
# Enable stack protection
# Strip debug symbols
```

### **API Security**

#### **Environment Variables**

```javascript
// Use environment variables for sensitive data
const API_BASE_URL = __DEV__ 
  ? 'https://dev-api.yourapp.com'
  : 'https://api.yourapp.com';

const API_KEY = __DEV__ 
  ? 'dev-api-key'
  : process.env.API_KEY; // Set at build time
```

#### **Network Security**

```xml
<!-- android/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">yourapp.com</domain>
    </domain-config>
</network-security-config>
```

---

## **Performance Optimization**

### **Bundle Size Optimization**

#### **Android Bundle Analysis**

```bash
# Analyze APK size
./gradlew analyzeReleaseBundle

# Check bundle size
bundletool build-apks --bundle=app-release.aab --output=app.apks
```

#### **iOS Bundle Analysis**

```bash
# Analyze app size
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -showBuildSettings | grep PRODUCT_NAME
```

### **Asset Optimization**

#### **Image Optimization**

```javascript
// Use optimized image formats
const optimizedImages = {
  // Use WebP for Android
  android: 'image.webp',
  // Use HEIC for iOS
  ios: 'image.heic',
  // Fallback to PNG
  default: 'image.png'
};

// Compress images at build time
const compressImages = () => {
  // Implement image compression logic
};
```

---

## **Testing Before Deployment**

### **Pre-deployment Checklist**

#### **Functionality Testing**
- [ ] All features work as expected
- [ ] No crashes or freezes
- [ ] Proper error handling
- [ ] Offline functionality works
- [ ] Push notifications work

#### **Performance Testing**
- [ ] App launches within acceptable time
- [ ] Smooth scrolling and animations
- [ ] Memory usage is acceptable
- [ ] Battery drain is minimal
- [ ] Network requests are optimized

#### **Compatibility Testing**
- [ ] Works on minimum supported OS versions
- [ ] Works on different screen sizes
- [ ] Works on different device types
- [ ] Works with different network conditions
- [ ] Works with accessibility features

#### **Store Requirements**
- [ ] App metadata is complete
- [ ] Screenshots meet requirements
- [ ] Privacy policy is available
- [ ] Terms of service are available
- [ ] App icon and splash screen are set

---

## **Real Use Case**

### **E-commerce App Deployment**

```javascript
// Deployment configuration
const deploymentConfig = {
  // Environment-specific settings
  development: {
    apiUrl: 'https://dev-api.ecommerce.com',
    enableDebugMode: true,
    crashReporting: false
  },
  staging: {
    apiUrl: 'https://staging-api.ecommerce.com',
    enableDebugMode: false,
    crashReporting: true
  },
  production: {
    apiUrl: 'https://api.ecommerce.com',
    enableDebugMode: false,
    crashReporting: true
  }
};

// Environment detection
const getEnvironment = () => {
  if (__DEV__) return 'development';
  if (Constants.manifest.releaseChannel === 'staging') return 'staging';
  return 'production';
};

// Deployment script
const deployApp = async (environment) => {
  const config = deploymentConfig[environment];
  
  console.log(`Deploying to ${environment}...`);
  
  // Build configuration
  await buildApp(environment);
  
  // Upload to appropriate store
  if (environment === 'production') {
    await uploadToAppStore();
    await uploadToPlayStore();
  } else {
    await uploadToTestFlight();
    await uploadToPlayStore('internal');
  }
  
  console.log(`Deployment to ${environment} completed!`);
};
```

---

## **Pro Tip**

**Implement feature flags to control feature rollout and enable instant updates without app store approval. Use a remote configuration service to toggle features dynamically, allowing you to fix issues or roll out new features instantly.**

```javascript
// Feature flags implementation
const featureFlags = {
  newCheckoutFlow: false,
  enhancedSearch: true,
  darkMode: true
};

const checkFeatureFlag = async (featureName) => {
  try {
    const response = await fetch(`https://api.yourapp.com/features/${featureName}`);
    const { enabled } = await response.json();
    return enabled;
  } catch (error) {
    // Fallback to default value
    return featureFlags[featureName] || false;
  }
};

// Usage in components
const CheckoutFlow = () => {
  const [useNewFlow, setUseNewFlow] = useState(false);
  
  useEffect(() => {
    checkFeatureFlag('newCheckoutFlow').then(setUseNewFlow);
  }, []);
  
  return useNewFlow ? <NewCheckoutFlow /> : <OldCheckoutFlow />;
};
```

---

## **Exercise / Mini Task**

**Task**: Create a deployment pipeline for a React Native app using GitHub Actions that automatically builds and deploys to TestFlight (iOS) and Internal Testing (Android) when code is pushed to the main branch.

**Requirements**:
1. Set up GitHub Actions workflow for both iOS and Android
2. Configure automatic build and upload to testing platforms
3. Implement version management
4. Add environment-specific configurations
5. Include build artifact storage
6. Add deployment notifications

**Bonus**:
- Implement automated testing before deployment
- Add rollback functionality
- Include deployment analytics
- Set up staging environment

---

*App deployment is the final step in bringing your React Native application to users. Master these concepts to ensure smooth, secure, and successful app releases.*
