import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import  styles  from '../Styles/Welcome2'; // Import your styles

const MoodPaletteApp = () => {
  // Track which color palette is currently selected
  const [selectedColorPalette, setSelectedColorPalette] = useState(0);
  // Track which emoji theme is currently selected
  const [selectedEmojiTheme, setSelectedEmojiTheme] = useState(0);

  const emojiThemes = [
    // Theme 1: Simple faces with dots
    [
      { emoji: '•◡•' },
      { emoji: '•ᴗ•' },
      { emoji: '•_•' },
      { emoji: '•︵•' },
      { emoji: '≥﹏≤' },
    ],
    // Theme 2: Round eyes
    [
      { emoji: '◕ᴗ◕' },
      { emoji: '◕ᴗ◕' },
      { emoji: '◕_◕' },
      { emoji: '◕︵◕' },
      { emoji: '×_×' },
    ],
    // Theme 3: Curved eyes
    [
      { emoji: '◠◡◠' },
      { emoji: '◠ᴗ◠' },
      { emoji: '◠_◠' },
      { emoji: '◠︵◠' },
      { emoji: '×﹏×' },
    ],
    // Theme 4: Mixed expressions
    [
      { emoji: '◠‿◠' },
      { emoji: '◠◠' },
      { emoji: '◠︵◠' },
      { emoji: '◠﹏◠' },
      { emoji: '◠益◠' },
    ],
    // Theme 5: Varied expressions
    [
      { emoji: '◠‿◠' },
      { emoji: '◠_◠' },
      { emoji: '◠_◠' },
      { emoji: '◠~◠' },
      { emoji: '×o×' },
    ],
    // Theme 6: Minimal expressions
    [
      { emoji: '^ᴗ^' },
      { emoji: '•ᴗ•' },
      { emoji: '•-•' },
      { emoji: '•︵•' },
      { emoji: '•`•' },
    ],
    // Theme 7: Kaomoji
    [
      { emoji: '(ᵔᴥᵔ)' },
      { emoji: '(ᵔ◡ᵔ)' },
      { emoji: '(•_•)' },
      { emoji: '(´･･`)' },
      { emoji: '(•́︿•̀)' },
    ],
  ];
  
  const colorPalettes = [
    // Palette 1: Original colors
    [
      { color: '#1ABC9C', name: 'Teal' },
      { color: '#A7D129', name: 'Lime' },
      { color: '#5DADE2', name: 'Blue' },
      { color: '#F39C12', name: 'Orange' },
      { color: '#E74C3C', name: 'Red' }
    ],
    // Palette 2: More vibrant colors
    [
      { color: '#8E44AD', name: 'Purple' },
      { color: '#E91E63', name: 'Pink' },
      { color: '#D35400', name: 'Dark Orange' },
      { color: '#F1C40F', name: 'Yellow' },
      { color: '#CDDC39', name: 'Olive' }
    ],
    // Palette 3: Pastel colors
    [
      { color: '#AED6F1', name: 'Pastel Blue' },
      { color: '#FAD7A0', name: 'Pastel Orange' },
      { color: '#D7BDE2', name: 'Pastel Purple' },
      { color: '#ABEBC6', name: 'Pastel Green' },
      { color: '#F5B7B1', name: 'Pastel Red' }
    ],
    // Palette 4: Dark colors
    [
      { color: '#34495E', name: 'Navy Blue' },
      { color: '#7D3C98', name: 'Dark Purple' },
      { color: '#2E4053', name: 'Dark Gray' },
      { color: '#784212', name: 'Brown' },
      { color: '#7B241C', name: 'Dark Red' }
    ],
    // Palette 5: Additional colors
    [
      { color: '#00CED1', name: 'Turquoise' },
      { color: '#FF9FF3', name: 'Light Pink' },
      { color: '#F4D03F', name: 'Golden Yellow' },
      { color: '#BDC3C7', name: 'Silver' },
      { color: '#27AE60', name: 'Emerald Green' }
    ],
    // Palette 6: Gradient-inspired solid colors
    [
      { color: '#3498DB', name: 'Royal Blue' },
      { color: '#16A085', name: 'Deep Teal' },
      { color: '#E67E22', name: 'Pumpkin' },
      { color: '#9B59B6', name: 'Amethyst' },
      { color: '#2ECC71', name: 'Mint Green' }
    ],
    // Palette 7: Muted tones
    [
      { color: '#95A5A6', name: 'Gray' },
      { color: '#D5DBDB', name: 'Light Gray' },
      { color: '#EAEDED', name: 'Off White' },
      { color: '#7F8C8D', name: 'Slate Gray' },
      { color: '#566573', name: 'Charcoal' }
    ],
    // Palette 8: User palette colors
    [
      { color: '#EDEFC8', name: 'Pale Yellow' },
      { color: '#EAE9E5', name: 'Light Beige' },
      { color: '#EFC8C8', name: 'Light Pink' },
      { color: '#BDD3CC', name: 'Light Teal' },
      { color: '#7C6767', name: 'Taupe' }
    ],
    // Palette 9: Bright accent colors
    [
      { color: '#58D68D', name: 'Bright Green' },
      { color: '#5DADE2', name: 'Sky Blue' },
      { color: '#F7DC6F', name: 'Canary Yellow' },
      { color: '#EC7063', name: 'Coral' },
      { color: '#BB8FCE', name: 'Lavender' }
    ],
  ];

  // Function to select emoji theme
  const selectEmojiTheme = (index) => {
    setSelectedEmojiTheme(index);
  };

  // Function to select color palette
  const selectColorPalette = (index) => {
    setSelectedColorPalette(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#BDD3CC" barStyle="dark-content" />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Your Personal{'\n'}Mood Palette</Text>
          <Text style={styles.subtitle}>
            Match the color of your moods to your personality. Later you can change emojis, names, and even add new ones.
          </Text>

          <Text style={styles.sectionTitle}>Colors</Text>
          <View style={styles.colorSection}>
            {colorPalettes.map((palette, paletteIndex) => (
              <TouchableOpacity
                key={paletteIndex}
                style={[
                  styles.colorPalette,
                  selectedColorPalette === paletteIndex && styles.selectedPalette
                ]}
                onPress={() => selectColorPalette(paletteIndex)}
              >
                {palette.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.colorOption, { backgroundColor: item.color }]}
                  />
                ))}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Emoji Theme</Text>
          {emojiThemes.map((theme, themeIndex) => (
            <TouchableOpacity
              key={themeIndex}
              style={[
                styles.emojiTheme,
                selectedEmojiTheme === themeIndex && styles.selectedTheme
              ]}
              onPress={() => selectEmojiTheme(themeIndex)}
            >
              {theme.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.emojiCircle,
                    // Use the colors from the selected color palette
                    { backgroundColor: colorPalettes[selectedColorPalette][index].color }
                  ]}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
            <Text style={styles.nextButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodPaletteApp;