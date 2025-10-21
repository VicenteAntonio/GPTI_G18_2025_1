import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import MeditationScreen from '../screens/MeditationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DevToolsScreen from '../screens/DevToolsScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Meditation: { sessionId: string };
  DevTools: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: '#95A5A6',
        headerStyle: {
          backgroundColor: '#4ECDC4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4ECDC4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Meditation"
        component={MeditationScreen}
        options={{
          title: 'Meditación',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="DevTools"
        component={DevToolsScreen}
        options={{
          title: '🛠️ Dev Tools',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
