import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './screen/Home';
import NotesAndReminders from './screen/NotesAndReminders';
import CaseManagement from './screen/CaseManagement';
import CaseDetails from './screen/CaseDetails';
import IletisimModulu from './screen/IletisimModulu';
import DilekceModulu from './screen/DilekceModulu';
import SablonForm from './screen/SablonForm';
import SablonSonuc from './screen/SablonSonuc';
import LoginRegister from './screen/LoginRegister';
import Profile from './screen/Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CaseStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CaseManagement"
        component={CaseManagement}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CaseDetails"
        component={CaseDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IletisimModulu"
        component={IletisimModulu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SablonForm"
        component={SablonForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SablonSonuc"
        component={SablonSonuc}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


function DilekceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DilekceModulu"
        component={DilekceModulu}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SablonForm"
        component={SablonForm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SablonSonuc"
        component={SablonSonuc}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MyTabs({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Davalar') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Dilekçe Oluştur') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          paddingBottom: 5,
          height: 60
        },
        headerShown: false
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Ana Sayfa'
        }}
      />
      <Tab.Screen
        name="Davalar"
        component={CaseStack}
        options={{
          tabBarLabel: 'Davalar'
        }}
      />
      <Tab.Screen
        name="Dilekçe Oluştur"
        component={DilekceStack}
        options={{
          tabBarLabel: 'Dilekçe'
        }}
      />
      <Tab.Screen
        name="Profil"
        options={{
          tabBarLabel: 'Profil'
        }}
      >
        {() => <Profile onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
} export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    checkAuthStatus();
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

  
  if (isLoading) {
    return null; 
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <LoginRegister onLoginSuccess={handleLoginSuccess} />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MyTabs onLogout={handleLogout} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
