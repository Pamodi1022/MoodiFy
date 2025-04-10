import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome1 from './Welcome1';
import Welcome2 from './Welcome2';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome1" component={Welcome1} />
        <Stack.Screen name="Welcome2" component={Welcome2} />
      </Stack.Navigator>
  );
}
