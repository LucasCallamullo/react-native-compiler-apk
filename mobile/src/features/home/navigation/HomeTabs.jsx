import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Folder, PlusCircle, AlertTriangle, Link, Calculator } from 'lucide-react-native';

import DashboardScreen from '@features/home/screens/DashboardScreen';
import HistoryStackNavigator from '@features/records/navigation/HistoryStack'; // Importas el nuevo Stack
import NewRecordScreen from '@features/records/screens/NewRecordScreen';
import EmergencyScreen from '@features/emergency/screens/EmergencyScreen';
import ShareScreen from '@features/share/screens/ShareScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs({ navigation }) {
  const lockApp = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Calculator' }],
    });
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
          name="Inicio"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home color={color} size={size || 22} />,
          }}
        />

        {/* Cargas el Stack en lugar de la Screen directamente */}
        <Tab.Screen
          name="Historial"
          component={HistoryStackNavigator}
          options={{
            tabBarIcon: ({ color, size }) => <Folder color={color} size={size || 22} />,
          }}
        />

        <Tab.Screen
          name="Nuevo"
          component={NewRecordScreen}
          options={{
            tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size || 22} />,
          }}
        />
        <Tab.Screen
          name="Emergencia"
          component={EmergencyScreen}
          options={{
            tabBarIcon: ({ color, size }) => <AlertTriangle color={color} size={size || 22} />,
          }}
        />
        <Tab.Screen
          name="Compartir"
          component={ShareScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Link color={color} size={size || 22} />,
          }}
        />
      </Tab.Navigator>

      {/* Botón Flotante para Volver a la Calculadora */}
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