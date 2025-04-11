import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import styles from '../Styles/Welcome1';   


export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.pageIndicator}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles. inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
      </View>
      <Text style={styles.title}>Nurture Your Mind, One Emoji at a Time</Text>
      <Text style={styles.description}>
        Capture your moods and experiences through the language of emojis without any writing. 
        Uncover patterns, delve into your feelings, and appreciate every moment, big or small.
      </Text>

      <Image
        source={require('../assets/Welcome1.png')} 
        style={styles.image}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Welcome2')}
      >
        <Text style={styles.buttonText}>Let's Begin</Text>
      </TouchableOpacity>

    </View>
  );
}
