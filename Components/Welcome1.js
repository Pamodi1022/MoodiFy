import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../Styles/Welcome1'; 


export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nurture Your Mind, One Emoji at a Time</Text>
      <Text style={styles.description}>
        Capture your moods and experiences through the language of emojis without any writing. 
        Uncover patterns, delve into your feelings, and appreciate every moment, big or small.
      </Text>

      <Image
        source={require('../assets/Welcome1.png')} // Replace with your own asset
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
