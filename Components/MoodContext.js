import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage - all in one place
const STORAGE_KEYS = {
  COLOR_PALETTE: '@mood_app:selectedColorPalette',
  EMOJI_THEME: '@mood_app:selectedEmojiTheme',
  MOOD_NAMES: '@mood_app:moodNames',
  MOOD_ENTRIES: '@mood_app:moodEntries',
};

// All the emoji themes
const emojiThemes = [
  // Theme 1: Simple faces with dots
  [
    { emoji: "•◡•" },
    { emoji: "•ᴗ•" },
    { emoji: "•_•" },
    { emoji: "•︵•" },
    { emoji: "≥﹏≤" },
  ],
  // Theme 2: Round eyes
  [
    { emoji: "◕ᴗ◕" },
    { emoji: "◕ᴗ◕" },
    { emoji: "◕_◕" },
    { emoji: "◕︵◕" },
    { emoji: "×_×" },
  ],
  // Theme 3: Curved eyes
  [
    { emoji: "◠◡◠" },
    { emoji: "◠ᴗ◠" },
    { emoji: "◠_◠" },
    { emoji: "◠︵◠" },
    { emoji: "×﹏×" },
  ],
  // Theme 4: Mixed expressions
  [
    { emoji: "◠‿◠" },
    { emoji: "◠◠" },
    { emoji: "◠︵◠" },
    { emoji: "◠﹏◠" },
    { emoji: "◠益◠" },
  ],
  // Theme 5: Varied expressions
  [
    { emoji: "◠‿◠" },
    { emoji: "◠_◠" },
    { emoji: "◠_◠" },
    { emoji: "◠~◠" },
    { emoji: "×o×" },
  ],
  // Theme 6: Minimal expressions
  [
    { emoji: "^ᴗ^" },
    { emoji: "•ᴗ•" },
    { emoji: "•-•" },
    { emoji: "•︵•" },
    { emoji: "•`•" },
  ],
  // Theme 7: Kaomoji
  [
    { emoji: "(ᵔᴥᵔ)" },
    { emoji: "(ᵔ◡ᵔ)" },
    { emoji: "(•_•)" },
    { emoji: "(´･･`)" },
    { emoji: "(•́︿•̀)" },
  ],
];

// All the color palettes
const colorPalettes = [
  // Palette 1: Original colors
  [
    { color: "#1ABC9C", name: "Teal" },
    { color: "#A7D129", name: "Lime" },
    { color: "#5DADE2", name: "Blue" },
    { color: "#F39C12", name: "Orange" },
    { color: "#E74C3C", name: "Red" },
  ],
  // Palette 2: More vibrant colors
  [
    { color: "#8E44AD", name: "Purple" },
    { color: "#E91E63", name: "Pink" },
    { color: "#D35400", name: "Dark Orange" },
    { color: "#F1C40F", name: "Yellow" },
    { color: "#CDDC39", name: "Olive" },
  ],
  // Additional palettes...
  // Palette 3: Pastel colors
  [
    { color: "#AED6F1", name: "Pastel Blue" },
    { color: "#FAD7A0", name: "Pastel Orange" },
    { color: "#D7BDE2", name: "Pastel Purple" },
    { color: "#ABEBC6", name: "Pastel Green" },
    { color: "#F5B7B1", name: "Pastel Red" },
  ],
  // Palette 4: Dark colors
  [
    { color: "#34495E", name: "Navy Blue" },
    { color: "#7D3C98", name: "Dark Purple" },
    { color: "#2E4053", name: "Dark Gray" },
    { color: "#784212", name: "Brown" },
    { color: "#7B241C", name: "Dark Red" },
  ],
  // Palette 5: Additional colors
  [
    { color: "#00CED1", name: "Turquoise" },
    { color: "#FF9FF3", name: "Light Pink" },
    { color: "#F4D03F", name: "Golden Yellow" },
    { color: "#BDC3C7", name: "Silver" },
    { color: "#27AE60", name: "Emerald Green" },
  ],
  // Palette 6: Gradient-inspired solid colors
  [
    { color: "#3498DB", name: "Royal Blue" },
    { color: "#16A085", name: "Deep Teal" },
    { color: "#E67E22", name: "Pumpkin" },
    { color: "#9B59B6", name: "Amethyst" },
    { color: "#2ECC71", name: "Mint Green" },
  ],
  // Palette 7: Muted tones
  [
    { color: "#95A5A6", name: "Gray" },
    { color: "#D5DBDB", name: "Light Gray" },
    { color: "#EAEDED", name: "Off White" },
    { color: "#7F8C8D", name: "Slate Gray" },
    { color: "#566573", name: "Charcoal" },
  ],
  // Palette 8: User palette colors
  [
    { color: "#EDEFC8", name: "Pale Yellow" },
    { color: "#EAE9E5", name: "Light Beige" },
    { color: "#EFC8C8", name: "Light Pink" },
    { color: "#BDD3CC", name: "Light Teal" },
    { color: "#7C6767", name: "Taupe" },
  ],
  // Palette 9: Bright accent colors
  [
    { color: "#58D68D", name: "Bright Green" },
    { color: "#5DADE2", name: "Sky Blue" },
    { color: "#F7DC6F", name: "Canary Yellow" },
    { color: "#EC7063", name: "Coral" },
    { color: "#BB8FCE", name: "Lavender" },
  ],
];

// Default mood names
const defaultMoodNames = ["rad", "good", "meh", "bad", "awful"];

// Create the context
export const MoodContext = createContext();

export const MoodProvider = ({ children }) => {
  // Core state
  const [selectedColorPaletteIndex, setSelectedColorPaletteIndex] = useState(0);
  const [selectedEmojiThemeIndex, setSelectedEmojiThemeIndex] = useState(0);
  const [moodNames, setMoodNames] = useState(defaultMoodNames);
  const [moodEntries, setMoodEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Save theme selections to AsyncStorage
  const saveThemeSelections = useCallback(async () => {
    try {
      // Save selections in parallel for better performance
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COLOR_PALETTE, selectedColorPaletteIndex.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.EMOJI_THEME, selectedEmojiThemeIndex.toString())
      ]);
      return true;
    } catch (error) {
      console.error('Error saving theme selections:', error);
      throw error; // Let the caller handle the error
    }
  }, [selectedColorPaletteIndex, selectedEmojiThemeIndex]);

  // Save mood names to AsyncStorage
  const saveMoodNames = useCallback(async (names) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOOD_NAMES, JSON.stringify(names));
      return true;
    } catch (error) {
      console.error('Error saving mood names:', error);
      throw error;
    }
  }, []);

  // Save mood entries to AsyncStorage
  const saveMoodEntry = useCallback(async (entry) => {
    try {
      const updatedEntries = [...moodEntries, entry];
      await AsyncStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(updatedEntries));
      setMoodEntries(updatedEntries);
      return true;
    } catch (error) {
      console.error('Error saving mood entry:', error);
      throw error;
    }
  }, [moodEntries]);

  // Update mood names
  const updateMoodNames = useCallback(async (names) => {
    try {
      await saveMoodNames(names);
      setMoodNames(names);
      return true;
    } catch (error) {
      console.error('Error updating mood names:', error);
      throw error;
    }
  }, [saveMoodNames]);

  // Load all saved data from AsyncStorage when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load all data in parallel
        const [
          savedColorPalette, 
          savedEmojiTheme, 
          savedMoodNames,
          savedMoodEntries
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.COLOR_PALETTE),
          AsyncStorage.getItem(STORAGE_KEYS.EMOJI_THEME),
          AsyncStorage.getItem(STORAGE_KEYS.MOOD_NAMES),
          AsyncStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES)
        ]);

        // Process color palette
        if (savedColorPalette !== null) {
          const index = parseInt(savedColorPalette, 10);
          if (!isNaN(index) && index >= 0 && index < colorPalettes.length) {
            setSelectedColorPaletteIndex(index);
          }
        }

        // Process emoji theme
        if (savedEmojiTheme !== null) {
          const index = parseInt(savedEmojiTheme, 10);
          if (!isNaN(index) && index >= 0 && index < emojiThemes.length) {
            setSelectedEmojiThemeIndex(index);
          }
        }

        // Process mood names
        if (savedMoodNames !== null) {
          try {
            const parsedNames = JSON.parse(savedMoodNames);
            if (Array.isArray(parsedNames) && parsedNames.length === 5) {
              setMoodNames(parsedNames);
            }
          } catch (parseError) {
            console.error('Error parsing saved mood names:', parseError);
          }
        }

        // Process mood entries
        if (savedMoodEntries !== null) {
          try {
            const parsedEntries = JSON.parse(savedMoodEntries);
            if (Array.isArray(parsedEntries)) {
              setMoodEntries(parsedEntries);
            }
          } catch (parseError) {
            console.error('Error parsing saved mood entries:', parseError);
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Get the current selected palette and theme
  const selectedColorPalette = colorPalettes[selectedColorPaletteIndex] || colorPalettes[0];
  const selectedEmojiTheme = emojiThemes[selectedEmojiThemeIndex] || emojiThemes[0];

  // Combine the palettes, themes, and mood names to create mood items
  const moodItems = selectedColorPalette.map((colorItem, index) => ({
    id: index,
    color: colorItem.color,
    name: moodNames[index] || colorItem.name,
    emoji: selectedEmojiTheme[index]?.emoji || "•_•",
  }));

  // Provide the context value
  const contextValue = {
    // Data
    moodItems,
    colorPalettes,
    emojiThemes,
    moodEntries,
    
    // State
    selectedColorPaletteIndex,
    selectedEmojiThemeIndex,
    isLoading,
    
    // State setters
    setSelectedColorPaletteIndex,
    setSelectedEmojiThemeIndex,
    
    // AsyncStorage operations
    saveThemeSelections,
    updateMoodNames,
    saveMoodEntry,
  };

  return <MoodContext.Provider value={contextValue}>{children}</MoodContext.Provider>;
};