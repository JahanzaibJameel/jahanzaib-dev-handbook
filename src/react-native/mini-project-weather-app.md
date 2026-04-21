# Mini Project: Weather App

## What is this Project?

A complete, production-ready weather application built with React Native that demonstrates mobile development best practices, API integration, state management, and modern UI/UX design patterns.

## Project Overview

### Features
- Real-time weather data from multiple APIs
- Location-based weather detection
- 7-day weather forecast
- Interactive weather maps
- Offline data caching
- Push notifications for weather alerts
- Beautiful animations and transitions
- Dark/Light theme support
- Multi-language support

### Tech Stack
- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **React Query** for API caching
- **Reanimated** for animations
- **Lottie** for weather animations
- **AsyncStorage** for local storage

## Project Structure

```
weather-app/
# Configuration
app.json
package.json
tsconfig.json
babel.config.js
metro.config.js
.env.example

# Source Code
src/
  components/
    common/
      Button/
      Input/
      Loading/
      ErrorBoundary/
    weather/
      WeatherCard/
      WeatherDetails/
      ForecastCard/
      WeatherMap/
    layout/
      Header/
      TabBar/
      Navigation/
      
  screens/
    HomeScreen/
    ForecastScreen/
    MapScreen/
    SettingsScreen/
    
  navigation/
    AppNavigator.tsx
    TabNavigator.tsx
    StackNavigator.tsx
    
  store/
    index.ts
    slices/
      weatherSlice.ts
      locationSlice.ts
      settingsSlice.ts
      
  services/
    WeatherService.ts
    LocationService.ts
    NotificationService.ts
    StorageService.ts
    
  hooks/
    useWeather.ts
    useLocation.ts
    useTheme.ts
    useNotifications.ts
    
  utils/
    constants.ts
    helpers.ts
    formatters.ts
    validators.ts
    
  types/
    weather.ts
    location.ts
    settings.ts
    
  assets/
    images/
    animations/
    fonts/
    icons/

# Tests
__tests__/
  components/
  screens/
  services/
  utils/

# Documentation
docs/
  API.md
  SETUP.md
  DEPLOYMENT.md
```

## Complete Implementation

### App Configuration

```json
// app.json
{
  "expo": {
    "name": "Weather Pro",
    "slug": "weather-pro",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2563eb"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.weatherpro.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2563eb"
      },
      "package": "com.weatherpro.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-font",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to access your location"
        }
      ],
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#2563eb"
        }
      ],
      "expo-linear-gradient"
    ]
  }
}
```

### Weather Service

```typescript
// src/services/WeatherService.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  forecast: ForecastDay[];
  alerts?: WeatherAlert[];
}

export interface ForecastDay {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
  humidity: number;
    windSpeed: number;
    precipitation: number;
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
}

class WeatherService {
  private cache = new Map<string, { data: WeatherData; timestamp: number }>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `${lat},${lon}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric'
          }
        }),
        axios.get(`${BASE_URL}/forecast`, {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: 'metric'
          }
        })
      ]);

      const weatherData = this.transformWeatherData(currentResponse.data, forecastResponse.data);
      
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      await this.cacheWeatherData(cacheKey, weatherData);
      
      return weatherData;
    } catch (error) {
      // Try to load from offline cache
      const offlineData = await this.getCachedWeatherData(cacheKey);
      if (offlineData) {
        return offlineData;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  async searchLocations(query: string): Promise<Location[]> {
    try {
      const response = await axios.get(`${GEO_URL}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY
        }
      });

      return response.data.map((location: any) => ({
        name: location.name,
        country: location.country,
        lat: location.lat,
        lon: location.lon
      }));
    } catch (error) {
      throw new Error('Failed to search locations');
    }
  }

  private transformWeatherData(current: any, forecast: any): WeatherData {
    const forecastDays = this.processForecastData(forecast.list);
    
    return {
      location: {
        name: current.name,
        country: current.sys.country,
        lat: current.coord.lat,
        lon: current.coord.lon
      },
      current: {
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        pressure: current.main.pressure,
        windSpeed: current.wind.speed,
        windDirection: current.wind.deg,
        visibility: current.visibility / 1000,
        uvIndex: 0, // OpenWeather doesn't provide UV in free tier
        condition: current.weather[0].description,
        icon: current.weather[0].icon
      },
      forecast: forecastDays,
      alerts: []
    };
  }

  private processForecastData(forecastList: any[]): ForecastDay[] {
    const dailyData = new Map<string, any[]>();

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, []);
      }
      dailyData.get(date)!.push(item);
    });

    return Array.from(dailyData.entries()).slice(0, 7).map(([date, items]) => {
      const temps = items.map(item => item.main.temp);
      const mainItem = items[Math.floor(items.length / 2)];

      return {
        date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps))
        },
        condition: mainItem.weather[0].description,
        icon: mainItem.weather[0].icon,
        humidity: mainItem.main.humidity,
        windSpeed: mainItem.wind.speed,
        precipitation: mainItem.pop ? mainItem.pop * 100 : 0
      };
    });
  }

  private async cacheWeatherData(key: string, data: WeatherData): Promise<void> {
    try {
      await AsyncStorage.setItem(`weather_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache weather data:', error);
    }
  }

  private async getCachedWeatherData(key: string): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(`weather_${key}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_DURATION * 6) { // 1 hour offline cache
          return data;
        }
      }
    } catch (error) {
      console.error('Failed to get cached weather data:', error);
    }
    return null;
  }
}

export default new WeatherService();
```

### Redux Store Setup

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import weatherSlice from './slices/weatherSlice';
import locationSlice from './slices/locationSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherSlice,
    location: locationSlice,
    settings: settingsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// src/store/slices/weatherSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import WeatherService from '../../services/WeatherService';
import { WeatherData } from '../../types/weather';

interface WeatherState {
  current: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  favorites: Location[];
}

const initialState: WeatherState = {
  current: null,
  loading: false,
  error: null,
  lastUpdated: null,
  favorites: []
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    return await WeatherService.getCurrentWeather(lat, lon);
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToFavorites: (state, action: PayloadAction<Location>) => {
      const exists = state.favorites.some(fav => 
        fav.lat === action.payload.lat && fav.lon === action.payload.lon
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<Location>) => {
      state.favorites = state.favorites.filter(fav => 
        !(fav.lat === action.payload.lat && fav.lon === action.payload.lon)
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  }
});

export const { clearError, addToFavorites, removeFromFavorites } = weatherSlice.actions;
export default weatherSlice.reducer;
```

### Main Weather Screen

```typescript
// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Share
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchWeather, addToFavorites, removeFromFavorites } from '../store/slices/weatherSlice';
import { RootState } from '../store';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastList from '../components/weather/ForecastList';
import LoadingSpinner from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { WeatherData } from '../types/weather';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  
  const { current, loading, error, favorites } = useSelector((state: RootState) => state.weather);
  const { currentLocation } = useSelector((state: RootState) => state.location);
  
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      dispatch(fetchWeather({ lat: currentLocation.lat, lon: currentLocation.lon }));
    }
  }, [currentLocation, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (currentLocation) {
      await dispatch(fetchWeather({ lat: currentLocation.lat, lon: currentLocation.lon }));
    }
    setRefreshing(false);
  };

  const handleShare = async () => {
    if (current) {
      try {
        const message = `Current weather in ${current.location.name}: ${current.current.temperature}°C, ${current.current.condition}`;
        await Share.share({
          message,
          title: 'Weather Update'
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share weather information');
      }
    }
  };

  const handleToggleFavorite = () => {
    if (current && currentLocation) {
      const location = {
        name: current.location.name,
        country: current.location.country,
        lat: current.location.lat,
        lon: current.location.lon
      };

      const isFavorite = favorites.some(fav => 
        fav.lat === location.lat && fav.lon === location.lon
      );

      if (isFavorite) {
        dispatch(removeFromFavorites(location));
      } else {
        dispatch(addToFavorites(location));
      }
    }
  };

  const isFavorite = current && favorites.some(fav => 
    fav.lat === current!.location.lat && fav.lon === current!.location.lon
  );

  if (loading && !current) {
    return <LoadingSpinner />;
  }

  if (error && !current) {
    return <ErrorDisplay error={error} onRetry={onRefresh} />;
  }

  if (!current) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.message}>No weather data available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.location}>{current.location.name}</Text>
        <Text style={styles.country}>{current.location.country}</Text>
      </View>

      <WeatherCard
        weather={current.current}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isFavorite}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
        <ForecastList forecast={current.forecast} />
      </View>

      {current.alerts && current.alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Weather Alerts</Text>
          {current.alerts.map((alert, index) => (
            <View key={index} style={styles.alert}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDescription}>{alert.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b'
  },
  country: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16
  },
  alertsSection: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  alert: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4
  },
  alertDescription: {
    fontSize: 14,
    color: '#7f1d1d'
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginTop: 100
  }
});

export default HomeScreen;
```

### Weather Card Component

```typescript
// src/components/weather/WeatherCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { WeatherData } from '../../types/weather';

interface WeatherCardProps {
  weather: WeatherData['current'];
  onShare: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onShare,
  onToggleFavorite,
  isFavorite
}) => {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: any } = {
      '01d': require('../../assets/icons/sunny.png'),
      '01n': require('../../assets/icons/moon.png'),
      '02d': require('../../assets/icons/partly-cloudy.png'),
      '02n': require('../../assets/icons/cloudy-night.png'),
      '03d': require('../../assets/icons/cloudy.png'),
      '03n': require('../../assets/icons/cloudy.png'),
      '04d': require('../../assets/icons/overcast.png'),
      '04n': require('../../assets/icons/overcast.png'),
      '09d': require('../../assets/icons/drizzle.png'),
      '09n': require('../../assets/icons/drizzle.png'),
      '10d': require('../../assets/icons/rain.png'),
      '10n': require('../../assets/icons/rain.png'),
      '11d': require('../../assets/icons/thunderstorm.png'),
      '11n': require('../../assets/icons/thunderstorm.png'),
      '13d': require('../../assets/icons/snow.png'),
      '13n': require('../../assets/icons/snow.png'),
      '50d': require('../../assets/icons/mist.png'),
      '50n': require('../../assets/icons/mist.png')
    };
    return iconMap[iconCode] || iconMap['01d'];
  };

  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={styles.celsius}>C</Text>
          </View>
          <Image source={getWeatherIcon(weather.icon)} style={styles.weatherIcon} />
        </View>

        <Text style={styles.condition}>{weather.condition}</Text>
        <Text style={styles.feelsLike}>Feels like {weather.feelsLike}°C</Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{weather.windSpeed} m/s</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Pressure</Text>
            <Text style={styles.detailValue}>{weather.pressure} hPa</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={onToggleFavorite}
          >
            <Text style={[styles.actionText, isFavorite && styles.favoriteText]}>
              {isFavorite ? 'Favorited' : 'Favorite'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: 'white'
  },
  celsius: {
    fontSize: 24,
    fontWeight: '300',
    color: 'white',
    marginTop: 8
  },
  weatherIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  condition: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize'
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24
  },
  detailItem: {
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500'
  },
  favoriteText: {
    color: '#fbbf24'
  }
});

export default WeatherCard;
```

## Real Use Case

### Production Weather Apps

**AccuWeather** and **Weather Channel** implement similar patterns:

```typescript
// Enhanced Weather Service with Multiple APIs
class AdvancedWeatherService {
  private apis = [
    { name: 'openweather', url: 'https://api.openweathermap.org/data/2.5', key: process.env.OPENWEATHER_KEY },
    { name: 'weatherapi', url: 'https://api.weatherapi.com/v1', key: process.env.WEATHERAPI_KEY },
    { name: 'accuweather', url: 'https://dataservice.accuweather.com', key: process.env.ACCUWEATHER_KEY }
  ];

  async getWeatherWithFallback(lat: number, lon: number): Promise<WeatherData> {
    for (const api of this.apis) {
      try {
        const data = await this.fetchFromAPI(api, lat, lon);
        return this.normalizeWeatherData(data, api.name);
      } catch (error) {
        console.warn(`API ${api.name} failed:`, error);
        continue;
      }
    }
    throw new Error('All weather APIs failed');
  }

  private async fetchFromAPI(api: any, lat: number, lon: number): Promise<any> {
    // Implementation for each API
  }

  private normalizeWeatherData(data: any, source: string): WeatherData {
    // Normalize data from different APIs to consistent format
  }
}
```

## Pro Tip

**Implement Smart Caching and Background Updates**

```typescript
// src/services/BackgroundWeatherService.ts
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import WeatherService from './WeatherService';

const BACKGROUND_FETCH_TASK = 'background-weather-update';

class BackgroundWeatherService {
  async initialize() {
    await this.registerBackgroundTask();
    await this.startPeriodicUpdates();
  }

  private async registerBackgroundTask() {
    await TaskManager.defineTask(BACKGROUND_FETCH_TASK, {
      taskName: BACKGROUND_FETCH_TASK,
      taskType: 'backgroundFetch',
      taskInterval: 900, // 15 minutes
    });
  }

  private async startPeriodicUpdates() {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15 * 60, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }

  async updateWeatherInBackground() {
    try {
      // Get user's favorite locations
      const favorites = await this.getFavoriteLocations();
      
      // Update weather for each location
      for (const location of favorites) {
        await WeatherService.getCurrentWeather(location.lat, location.lon);
      }
      
      // Send notifications for weather alerts
      await this.checkForWeatherAlerts();
      
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error('Background weather update failed:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  }
}
```

## Exercise

**Build the Complete Weather App**

Create a production-ready weather application with the following requirements:

```typescript
// Exercise Tasks:
// 1. Set up the complete project structure
// 2. Implement all weather API integrations
// 3. Create beautiful UI components with animations
// 4. Add location services and geolocation
// 5. Implement offline functionality
// 6. Add push notifications for weather alerts
// 7. Create comprehensive error handling
// 8. Add unit and integration tests
// 9. Implement theme switching
// 10. Add multi-language support

// Implementation Checklist:

// 1. Project Setup
// - Create React Native project with Expo
// - Configure TypeScript and ESLint
// - Set up navigation and state management
// - Configure environment variables

// 2. Core Features
// - Weather API integration
// - Location services
// - Weather caching
// - Offline mode

// 3. UI Components
// - Weather card with animations
// - Forecast list
// - Weather map integration
// - Settings screen

// 4. Advanced Features
// - Push notifications
// - Background updates
// - Widget support
// - Apple Watch/Android Wear support

// 5. Testing
// - Unit tests for services
// - Component tests
// - Integration tests
// - E2E tests

// 6. Deployment
// - App store optimization
// - Build configurations
// - Release management
// - Analytics integration
```

**Your Tasks:**
1. Set up the complete React Native project structure
2. Implement all weather services and API integrations
3. Create beautiful UI components with animations
4. Add location services and geolocation features
5. Implement offline functionality and caching
6. Add push notifications for weather alerts
7. Create comprehensive error handling and user feedback
8. Add unit and integration tests
9. Implement theme switching (dark/light mode)
10. Add multi-language support (i18n)

This exercise teaches you:
- React Native development best practices
- API integration and data management
- State management with Redux Toolkit
- Component architecture and reusability
- Offline-first application design
- Push notifications and background tasks
- Animation and user experience design
- Testing strategies for mobile apps
- App store deployment and optimization
- Internationalization and localization

---

**Next Up**: Learn about building the ChatGPT Clone AI project! AI Project Development
