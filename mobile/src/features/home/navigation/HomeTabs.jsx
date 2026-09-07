import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Folder, PlusCircle, AlertTriangle, User, Calculator } from 'lucide-react-native';

import { useAuth } from '@features/auth/context/AuthContext';
import DashboardScreen from '@features/home/screens/DashboardScreen';
import HistoryStackNavigator from '@features/records/navigation/HistoryStack';
import ProfileStackNavigator from '@features/profile/navigation/ProfileStack';
import NewRecordScreen from '@features/records/screens/NewRecordScreen';
import EmergencyScreen from '@features/emergency/screens/EmergencyScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ navigation }) {
  const { isAuthenticated } = useAuth();

  const lockApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Calculator' }],
    });
  };

  const protectedTabListener = {
    tabPress: (e) => {
      if (!isAuthenticated) {
        e.preventDefault();
        navigation.navigate('Login');
      }
    },
  };

  return (
    <View className="flex-1 relative bg-zinc-950">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#a855f7',
          tabBarInactiveTintColor: '#71717a',
          tabBarStyle: {
            backgroundColor: '#09090b',
            borderTopColor: '#27272a',
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size || 22} />,
          }}
        />

        <Tab.Screen
          name="History"
          component={HistoryStackNavigator}
          listeners={protectedTabListener}
          options={{
            tabBarIcon: ({ color, size }) => <Folder color={color} size={size || 22} />,
          }}
        />

        <Tab.Screen
          name="NewRecord"
          component={NewRecordScreen}
          listeners={protectedTabListener}
          options={{
            tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size || 22} />,
          }}
        />

        <Tab.Screen
          name="Emergency"
          component={EmergencyScreen}
          listeners={protectedTabListener}
          options={{
            tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size || 22} />,
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          listeners={protectedTabListener}
          options={{
            tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
          }}
        />
      </Tab.Navigator>

      <TouchableOpacity
        onPress={lockApp}
        activeOpacity={0.8}
        className="absolute bottom-28 right-6 w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-full items-center justify-center shadow-lg shadow-black/50 active:bg-zinc-700"
      >
        <Calculator color="#c084fc" size={24} />
      </TouchableOpacity>
    </View>
  );
}