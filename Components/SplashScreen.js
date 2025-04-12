import React, { useEffect, useRef } from 'react';
import { View, StatusBar, Animated } from 'react-native';
import { styles } from '../Styles/SplashScreen'; // Import styles

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity of 0 (invisible)
  const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial scale of 0.5 (smaller)

  useEffect(() => {
    // Trigger the animation when the component mounts
    Animated.timing(fadeAnim, {
      toValue: 1, // Final opacity (fully visible)
      duration: 2500, // Duration in milliseconds
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1, // Final scale (normal size)
      duration: 3000, // Duration in milliseconds
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor="#EDEFC8" barStyle="dark-content" />
      <Animated.Image
        style={[styles.logo, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} 
        source={require('../assets/logo.png')}
      />
      {/* <Text style={styles.splashText}>Welcome to MoodFy</Text> */}
    </View>
  );
};

export default SplashScreen;
