import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HistoryScreen from '@features/records/screens/HistoryScreen';
import EventsScreen from '@features/audit/screens/EventsScreen';

const HistoryStack = createNativeStackNavigator();

export default function HistoryStackNavigator() {
  return (
    <HistoryStack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#09090b' }
      }}
    >
      <HistoryStack.Screen name="HistoryMain" component={HistoryScreen} />
      <HistoryStack.Screen name="Auditoria" component={EventsScreen} />
    </HistoryStack.Navigator>
  );
}