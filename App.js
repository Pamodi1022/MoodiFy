import React, { useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import SplashScreen from './Components/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Components/AppNavigator';
import { MoodProvider } from './Components/MoodContext';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Transition after 4 seconds
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#BDD3CC" barStyle="dark-content" />
      <MoodProvider>
        <NavigationContainer>
          {showSplash ? <SplashScreen /> : <AppNavigator />}
        </NavigationContainer>
      </MoodProvider>
    </View>
  );
}