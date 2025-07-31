import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, StatusBar, AppState } from 'react-native';

// Ekranlar
import Home from './screen/Home';
import CaseManagement from './screen/CaseManagement';
import CaseDetails from './screen/CaseDetails';
import IletisimModulu from './screen/IletisimModulu';
import DilekceModulu from './screen/DilekceModulu';
import SablonForm from './screen/SablonForm';
import SablonSonuc from './screen/SablonSonuc';
import Login from './screen/Login';
import Register from './screen/Register';
import Profile from './screen/Profile';
import SplashScreen from './components/SplashScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- Alt Stack'ler ---
function CaseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CaseManagement" component={CaseManagement} options={{ headerShown: false }} />
      <Stack.Screen name="CaseDetails" component={CaseDetails} options={{ headerShown: false }} />
      <Stack.Screen name="IletisimModulu" component={IletisimModulu} options={{ headerShown: false }} />
      <Stack.Screen name="SablonForm" component={SablonForm} options={{ headerShown: false }} />
      <Stack.Screen name="SablonSonuc" component={SablonSonuc} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function DilekceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DilekceModulu" component={DilekceModulu} options={{ headerShown: false }} />
      <Stack.Screen name="SablonForm" component={SablonForm} options={{ headerShown: false }} />
      <Stack.Screen name="SablonSonuc" component={SablonSonuc} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function AuthStack({ onLoginSuccess }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ headerShown: false }}>
        {(props) => <Login {...props} onLoginSuccess={onLoginSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// --- Alt Sekmeli Yapı ---
function MyTabs({ onLogout }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Davalar') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Dilekçe Oluştur') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          paddingBottom: 0,
          paddingTop: 5,
          height: Platform.OS === 'android' ? 65 : 60,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          marginBottom: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Ana Sayfa' }} />
      <Tab.Screen name="Davalar" component={CaseStack} options={{ tabBarLabel: 'Davalar' }} />
      <Tab.Screen name="Dilekçe Oluştur" component={DilekceStack} options={{ tabBarLabel: 'Dilekçe' }} />
      <Tab.Screen name="Profil" options={{ tabBarLabel: 'Profil' }}>
        {() => <Profile onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        StatusBar.setBackgroundColor('#2196F3', true);
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setTranslucent(false);
        StatusBar.setHidden(false, true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (userToken && isLoggedIn === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth kontrol hatası:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    // Giriş başarılı → direkt Tab yapısına geç
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'isLoggedIn', 'userEmail', 'userName']);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout hatası:', error);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
              <Stack.Screen name="Auth">
                {() => <AuthStack onLoginSuccess={handleLoginSuccess} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Tabs">
                {() => <MyTabs onLogout={handleLogout} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
