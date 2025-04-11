import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Styles/Welcome3'; 

// Icons for each category
import EmotionsIcon from '../assets/icons/emotions.png';
import SleepIcon from '../assets/icons/sleep.png';
import HealthIcon from '../assets/icons/health.png';
import HobbiesIcon from '../assets/icons/hobbies.png';
import FoodIcon from '../assets/icons/food.png';
import SocialIcon from '../assets/icons/social.png';
import BetterMeIcon from '../assets/icons/betterme.png';
import ProductivityIcon from '../assets/icons/productivity.png';
import ChoresIcon from '../assets/icons/chores.png';
import WeatherIcon from '../assets/icons/weather.png';
import SchoolIcon from '../assets/icons/school.png';
import BeautyIcon from '../assets/icons/beauty.png';

// Key for AsyncStorage
const SELECTED_CATEGORIES_KEY = '@mood_app:selectedCategories';

const TrackActivitiesScreen = ({ navigation }) => {
  // Track which categories are selected
  const [selectedCategories, setSelectedCategories] = useState({
    emotions: true,
    sleep: true,
    health: true,
    hobbies: true,
    food: true,
    social: true,
    betterMe: true,
    productivity: true,
    chores: true,
    weather: true,
    school: true,
    beauty: true,
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Categories data with icons and descriptions
  const categories = [
    {
      id: 'emotions',
      title: 'Emotions',
      description: 'happy, excited, grateful, relaxed...',
      icon: EmotionsIcon,
    },
    {
      id: 'sleep',
      title: 'Sleep',
      description: 'good sleep, medium sleep, bad sleep...',
      icon: SleepIcon,
    },
    {
      id: 'health',
      title: 'Health',
      description: 'exercise, eat healthy, drink water...',
      icon: HealthIcon,
    },
    {
      id: 'hobbies',
      title: 'Hobbies',
      description: 'movies, read, gaming, relax',
      icon: HobbiesIcon,
    },
    {
      id: 'food',
      title: 'Food',
      description: 'eat healthy, fast food, home cooking...',
      icon: FoodIcon,
    },
    {
      id: 'social',
      title: 'Social',
      description: 'family, friends, party',
      icon: SocialIcon,
    },
    {
      id: 'betterMe',
      title: 'Better Me',
      description: 'meditation, kindness, listening...',
      icon: BetterMeIcon,
    },
    {
      id: 'productivity',
      title: 'Productivity',
      description: 'start early, make list, focus...',
      icon: ProductivityIcon,
    },
    {
      id: 'chores',
      title: 'Chores',
      description: 'shopping, cleaning, cooking...',
      icon: ChoresIcon,
    },
    {
      id: 'weather',
      title: 'Weather',
      description: 'sunny, clouds, rain, snow, ...',
      icon: WeatherIcon,
    },
    {
      id: 'school',
      title: 'School',
      description: 'class, study, homework, exam...',
      icon: SchoolIcon,
    },
    {
      id: 'beauty',
      title: 'Beauty',
      description: 'haircut, wellness, massage...',
      icon: BeautyIcon,
    },
  ];

  // Load saved categories from AsyncStorage when component mounts
  useEffect(() => {
    const loadSavedCategories = async () => {
      try {
        const savedCategories = await AsyncStorage.getItem(SELECTED_CATEGORIES_KEY);
        if (savedCategories !== null) {
          setSelectedCategories(JSON.parse(savedCategories));
        }
      } catch (error) {
        console.error('Error loading saved categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedCategories();
  }, []);

  // Function to save selected categories to AsyncStorage
  const saveSelectedCategories = async () => {
    try {
      await AsyncStorage.setItem(SELECTED_CATEGORIES_KEY, JSON.stringify(selectedCategories));
      return true;
    } catch (error) {
      console.error('Error saving selected categories:', error);
      return false;
    }
  };

  // Toggle selection of a category
  const toggleCategory = (id) => {
    setSelectedCategories({
      ...selectedCategories,
      [id]: !selectedCategories[id],
    });
  };

  // Handle next button press
  const handleNext = async () => {
    // Get array of selected category IDs
    const selected = Object.keys(selectedCategories).filter(
      (key) => selectedCategories[key]
    );
    
    // Save selected categories to AsyncStorage
    const success = await saveSelectedCategories();
    
    if (success) {
      // Navigate to next screen with selected categories
      navigation.navigate('Home', { selectedCategories: selected });
      console.log('Saved Successfully:', selected);
    } else {
      Alert.alert(
        "Save Error",
        "There was a problem saving your selections. Please try again.",
        [{ text: "OK" }]
      );
      console.log('Error saving selected categories');
    }
  };

  // Handle back button press
  const handleBack = () => {
    navigation.goBack();
    console.log('Going back');
  };

  // Show loading indicator if data is loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>     
      {/* Page indicator dots */}
      <View style={styles.pageIndicator}>
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Track Activities, Uncover Patterns</Text>
        <Text style={styles.subtitle}>
          Add depth to your diary entries by selecting activities you engage in. 
          Observe how they impact your emotions over time. Here are a few suggestions 
          to start with:
        </Text>
      </View>


        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => toggleCategory(category.id)}
            activeOpacity={0.8}
          >
            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>
                {selectedCategories[category.id] && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
            </View>
            
            <View style={styles.iconContainer}>
              {category.icon ? (
                <Image source={category.icon} style={styles.icon} />
              ) : (
                <View style={styles.placeholderIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Text style={styles.nextButtonArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TrackActivitiesScreen;