import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import styles from "../Styles/Welcome2";
import { MoodContext } from "./MoodContext"; // Import the context

const MoodPaletteApp = ({ navigation }) => {
  // Use the context instead of local state
  const { 
    colorPalettes, 
    emojiThemes,
    selectedColorPaletteIndex, 
    selectedEmojiThemeIndex,
    setSelectedColorPaletteIndex,
    setSelectedEmojiThemeIndex,
    saveThemeSelections,
    isLoading
  } = useContext(MoodContext);

  // Handle next button press - save selections and navigate
  const handleNext = async () => {
    try {
      await saveThemeSelections();
      navigation.navigate('Welcome3');
      console.log("Selections saved and navigating to Welcome3");
    } catch (error) {
      Alert.alert(
        "Save Error",
        "There was a problem saving your selections. Please try again.",
        [{ text: "OK" }]
      );
      console.error("Error saving selections:", error);
    }
  };

  // Render item for the color palette
  const renderColorPalette = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.colorPalette,
        selectedColorPaletteIndex === index && styles.selectedPalette,
      ]}
      onPress={() => setSelectedColorPaletteIndex(index)}
    >
      {item.map((colorItem, colorIndex) => (
        <View
          key={colorIndex}
          style={[styles.colorOption, { backgroundColor: colorItem.color }]}
        />
      ))}
    </TouchableOpacity>
  );

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
      <View style={styles.pageIndicator}>
        <View style={[styles.dot, styles.inactiveDot]} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={[styles.dot, styles.inactiveDot]} />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Create Your Personal{"\n"}Mood Palette
          </Text>
          <Text style={styles.subtitle}>
            Match the color of your moods to your personality. Later you can
            change emojis, names, and even add new ones.
          </Text>

          <Text style={styles.sectionTitle}>Colors</Text>
          {/* Horizontal FlatList for color palettes */}
          <FlatList
            data={colorPalettes}
            renderItem={renderColorPalette}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorSectionHorizontal}
          />

          <Text style={styles.sectionTitle}>Emoji Theme</Text>
          {emojiThemes.map((theme, themeIndex) => (
            <TouchableOpacity
              key={themeIndex}
              style={[
                styles.emojiTheme,
                selectedEmojiThemeIndex === themeIndex && styles.selectedTheme,
              ]}
              onPress={() => setSelectedEmojiThemeIndex(themeIndex)}
            >
              {theme.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.emojiCircle,
                    // Use the colors from the selected color palette
                    {
                      backgroundColor:
                        colorPalettes[selectedColorPaletteIndex][index].color,
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Text style={styles.nextButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodPaletteApp;