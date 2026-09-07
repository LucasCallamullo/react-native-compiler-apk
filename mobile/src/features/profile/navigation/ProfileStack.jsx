// src/features/profile/navigation/ProfileStack.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from '@features/profile/screens/ProfileScreen';
import ShareScreen from '@features/share/screens/ShareScreen';
import ConfigAppScreen from '@features/profile/screens/ConfigAppScreen';

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#09090b' },
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="Share" component={ShareScreen} />
      <ProfileStack.Screen name="ConfigApp" component={ConfigAppScreen} />
    </ProfileStack.Navigator>
  );
}