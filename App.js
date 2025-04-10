import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SplashScreen from './Components/SplashScreen';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './Components/AppNavigator';

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
        <NavigationContainer>
          {showSplash ? <SplashScreen /> : <AppNavigator />}
        </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
