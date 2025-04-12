import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { Audio } from 'expo-av';
import styles from '../Styles/Dashboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

const Dashboard = () => {
  const navigation = useNavigation();
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sound, setSound] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [activities, setActivities] = useState([]);
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);

  const navigateToFavorites = () => {
    navigation.navigate('Favourite');
  };

  // Get the current month and year for header
  const monthYearDisplay = format(currentMonth, 'MMMM yyyy');
  const today = format(new Date(), 'dd MMMM');

  // Fetch journals when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadJournals();
      loadActivities();
      return () => {
        // Clean up sound when leaving the screen
        if (sound) {
          sound.unloadAsync();
        }
      };
    }, [])
  );

  // Effect for filtering journals based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      // If no search query, filter by current month
      filterJournalsByMonth(currentMonth);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = journals.filter(journal => {
        // Search by date
        const journalDate = new Date(journal.timestamp);
        const formattedDate = format(journalDate, 'dd MMMM yyyy').toLowerCase();
        if (formattedDate.includes(lowercasedQuery)) return true;
        
        // Search by mood
        if (journal.mood && journal.mood.label && 
            journal.mood.label.toLowerCase().includes(lowercasedQuery)) return true;
        
        // Search by note content
        if (journal.note && journal.note.toLowerCase().includes(lowercasedQuery)) return true;
        
        // Search by activities
        const activityMatches = journal.activities.some(actId => {
          const activity = activities.find(a => a.id === actId);
          return activity && activity.label.toLowerCase().includes(lowercasedQuery);
        });
        if (activityMatches) return true;
        
        return false;
      });
      setFilteredJournals(filtered);
    }
  }, [searchQuery, journals, currentMonth, activities]);

  // Load activities from AsyncStorage
  const loadActivities = async () => {
    try {
      const activitiesJson = await AsyncStorage.getItem('activities');
      if (activitiesJson) {
        setActivities(JSON.parse(activitiesJson));
      } else {
        // Use default activities if none found in storage
        const defaultActivities = [
            { id: 1, icon: 'account-group', label: 'family' },
            { id: 2, icon: 'account-multiple', label: 'friends' },
            { id: 3, icon: 'heart', label: 'date' },
            { id: 4, icon: 'yoga', label: 'exercise' },
            { id: 5, icon: 'run', label: 'sport' },
            { id: 6, icon: 'bed', label: 'sleep early' },
            { id: 7, icon: 'food-apple', label: 'eat healthy' },
            { id: 8, icon: 'umbrella-beach', label: 'relax' },
            { id: 9, icon: 'television', label: 'movies' },
            { id: 10, icon: 'book-open-variant', label: 'read' },
            { id: 11, icon: 'gamepad-variant', label: 'gaming' },
            { id: 12, icon: 'broom', label: 'cleaning' },
            { id: 13, icon: 'cart', label: 'shopping' },
            { id: 14, icon: 'food', label: 'Cooking' },
            { id: 15, icon: 'meditation', label: 'meditation' },
        ];
        setActivities(defaultActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Load journals from AsyncStorage
  const loadJournals = async () => {
    try {
      const journalEntriesJson = await AsyncStorage.getItem('journal_entries');
      if (journalEntriesJson) {
        const allJournals = JSON.parse(journalEntriesJson);
        
        // Sort journals by date (newest first)
        const sortedJournals = allJournals.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setJournals(sortedJournals);
        // Initially filter by current month
        filterJournalsByMonth(currentMonth, sortedJournals);
      } else {
        // Add mock data for testing
        const mockJournals = [
          {
            id: '1',
            timestamp: new Date(2025, 3, 11, 23, 42).toISOString(),
            mood: { emoji: '😐', color: '#55a9f0', label: 'meh' },
            activities: [3, 4, 5],
            note: 'Debugging and coding',
            photo: { uri: 'https://example.com/panel-discussion.jpg' },
          },
          {
            id: '2',
            timestamp: new Date(2025, 3, 11, 23, 40).toISOString(),
            mood: { emoji: '😃', color: '#a2d149', label: 'good' },
            activities: [1, 2, 3, 4, 5],
            note: 'Developing MoodiFy App',
            recordingPath: 'file:///recording.mp3',
            photoBase64: 'base64-encoded-image',
          },
        ];
        setJournals(mockJournals);
        setFilteredJournals(mockJournals);
      }
    } catch (error) {
      console.error('Error loading journals:', error);
      Alert.alert('Error', 'Failed to load journal entries.');
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    
    // Filter journals by the selected month
    filterJournalsByMonth(prevMonth);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    
    // Filter journals by the selected month
    filterJournalsByMonth(nextMonth);
  };

  // Filter journals by selected month
  const filterJournalsByMonth = (selectedMonth, journalList = journals) => {
    const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    
    const monthJournals = journalList.filter(journal => {
      const journalDate = new Date(journal.timestamp);
      return journalDate >= startOfMonth && journalDate <= endOfMonth;
    });
    
    setFilteredJournals(monthJournals);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      filterJournalsByMonth(currentMonth);
    }
  };

  // Toggle mood selection screen
  const toggleMoodSelection = () => {
    setShowMoodSelection(!showMoodSelection);
  };

// Delete journal entry
const deleteJournalEntry = async (journalId) => {
  try {
    // Get all journal entries from AsyncStorage
    const journalEntriesJson = await AsyncStorage.getItem('journal_entries');
    if (!journalEntriesJson) return;
    
    let journalEntries = JSON.parse(journalEntriesJson);
    
    // Find the journal entry to delete
    const journalToDelete = journalEntries.find(j => j.id === journalId);
    if (!journalToDelete) return;
    
    // Delete associated files (photo and recording)
    try {
      // Delete photo if exists
      if (journalToDelete.photo?.uri) {
        await FileSystem.deleteAsync(journalToDelete.photo.uri);
      }
      
      // Delete recording if exists
      if (journalToDelete.recordingPath) {
        await FileSystem.deleteAsync(journalToDelete.recordingPath);
      }
      
      // Delete journal directory if exists
      const journalDir = `${FileSystem.documentDirectory}journal_${journalId}`;
      const dirInfo = await FileSystem.getInfoAsync(journalDir);
      if (dirInfo.exists) {
        await FileSystem.deleteAsync(journalDir, { idempotent: true });
      }
    } catch (error) {
      console.error('Error deleting journal files:', error);
    }
    
    // Remove from favorites if it exists there
    try {
      const favoritesJson = await AsyncStorage.getItem('favorite_journals');
      if (favoritesJson) {
        let favorites = JSON.parse(favoritesJson);
        favorites = favorites.filter(fav => fav.id !== journalId);
        await AsyncStorage.setItem('favorite_journals', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
    
    // Remove from mood entries if it exists there
    try {
      const moodEntriesJson = await AsyncStorage.getItem('mood_entries');
      if (moodEntriesJson) {
        let moodEntries = JSON.parse(moodEntriesJson);
        moodEntries = moodEntries.filter(entry => entry.journalId !== journalId);
        await AsyncStorage.setItem('mood_entries', JSON.stringify(moodEntries));
      }
    } catch (error) {
      console.error('Error removing from mood entries:', error);
    }
    
    // Update the journal entries by removing the deleted one
    const updatedJournals = journalEntries.filter(journal => journal.id !== journalId);
    
    // Save the updated list back to AsyncStorage
    await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedJournals));
    
    // Update local state
    setJournals(updatedJournals);
    setFilteredJournals(updatedJournals.filter(journal => {
      const journalDate = new Date(journal.timestamp);
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      return journalDate >= startOfMonth && journalDate <= endOfMonth;
    }));
    
    Alert.alert('Success', 'Journal entry deleted successfully');
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    Alert.alert('Error', 'Failed to delete journal entry');
  }
};

// Enhanced handleDropdownOption function
const handleDropdownOption = async (option) => {
  if (!selectedJournal) return;

  switch (option) {
    case 'edit':
      navigation.navigate('JournalEdit', { journalId: selectedJournal.id });
      break;
      
    case 'share':
      await handleShareJournal(selectedJournal);
      break;
      
    case 'favorite':
      await toggleFavoriteJournal(selectedJournal.id);
      navigation.navigate('Favourite', { journalId:selectedJournal.id })
      break;
      
    case 'addPhoto':
      await handleAddPhoto(selectedJournal.id);
      break;
      
    case 'exportVoice':
      await handleExportVoiceMemo(selectedJournal);
      break;
      
    case 'delete':
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this journal entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => deleteJournalEntry(selectedJournal.id)
          }
        ]
      );
      break;
      
    default:
      break;
  }

  // Close dropdown after handling option
  setShowDropdown(false);
};

// Share journal entry with text, images, and audio
const handleShareJournal = async (journal) => {
  try {
    // Request permission if needed
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing not available', 'Sharing is not available on this device');
      return;
    }
    
    // Create a timestamp for the entry
    const entryDate = format(new Date(journal.timestamp), 'dd MMMM yyyy HH:mm');
    
    // Format journal entry as text
    let shareText = `MoodiFy Journal Entry - ${entryDate}\n\n`;
    shareText += `Mood: ${journal.mood?.label || 'Not specified'}\n\n`;
    
    // Add activities if present
    if (journal.activities && journal.activities.length > 0) {
      shareText += "Activities: ";
      const activityLabels = journal.activities.map(actId => {
        const activity = activities.find(a => a.id === actId);
        return activity ? activity.label : '';
      }).filter(label => label);
      
      shareText += activityLabels.join(', ') + '\n\n';
    }
    
    // Add note if present
    if (journal.note) {
      shareText += `Note: ${journal.note}\n\n`;
    }
    
    // Create temp file for text content
    const tempTextFile = `${FileSystem.cacheDirectory}journal_entry_${journal.id}.txt`;
    await FileSystem.writeAsStringAsync(tempTextFile, shareText);
    
    // List of files to share
    const filesToShare = [tempTextFile];
    
    // Add image if present
    if (journal.photo?.uri || journal.photoBase64) {
      const imageUri = journal.photo?.uri || 
        `data:image/jpeg;base64,${journal.photoBase64}`;
      
      // Create temp image file
      const tempImageFile = `${FileSystem.cacheDirectory}journal_image_${journal.id}.jpg`;
      
      if (journal.photo?.uri) {
        // Copy external image to temp file
        await FileSystem.copyAsync({
          from: journal.photo.uri,
          to: tempImageFile
        });
      } else if (journal.photoBase64) {
        // Write base64 image to temp file
        await FileSystem.writeAsStringAsync(
          tempImageFile,
          journal.photoBase64,
          { encoding: FileSystem.EncodingType.Base64 }
        );
      }
      
      filesToShare.push(tempImageFile);
    }
    
    // Add audio if present
    if (journal.recordingPath) {
      // Create temp audio file
      const tempAudioFile = `${FileSystem.cacheDirectory}journal_audio_${journal.id}.m4a`;
      
      // Copy audio file to temp location
      await FileSystem.copyAsync({
        from: journal.recordingPath,
        to: tempAudioFile
      });
      
      filesToShare.push(tempAudioFile);
    }
    
    // Show sharing UI with files
    await Sharing.shareAsync(filesToShare.length === 1 ? filesToShare[0] : filesToShare[0], {
      dialogTitle: 'Share Journal Entry',
      mimeType: 'text/plain',
      UTI: 'public.text'
    });
    
    // Clean up temp files
    setTimeout(async () => {
      for (const file of filesToShare) {
        try {
          await FileSystem.deleteAsync(file);
        } catch (e) {
          console.log('Error cleaning up temp file:', e);
        }
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error sharing journal:', error);
    Alert.alert('Sharing Failed', 'There was an error sharing your journal entry.');
  }
};

const toggleFavoriteJournal = async (journalId) => {
    try {
      // Find journal entry
      const journalIndex = journals.findIndex(j => j.id === journalId);
      if (journalIndex === -1) return;
      
      // Create updated journals array
      const updatedJournals = [...journals];
      
      // Toggle favorite status
      const newFavoriteStatus = !updatedJournals[journalIndex].isFavorite;
      updatedJournals[journalIndex] = {
        ...updatedJournals[journalIndex],
        isFavorite: newFavoriteStatus
      };
      
      // Update state
      setJournals(updatedJournals);
      
      // Update filtered journals if needed
      const filteredIndex = filteredJournals.findIndex(j => j.id === journalId);
      if (filteredIndex !== -1) {
        const updatedFiltered = [...filteredJournals];
        updatedFiltered[filteredIndex] = updatedJournals[journalIndex];
        setFilteredJournals(updatedFiltered);
      }
      
      // Save to storage
      await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedJournals));
      
      // Show confirmation and navigate if marked as favorite
      const message = newFavoriteStatus ? 
        'Journal entry marked as favorite' : 
        'Journal entry removed from favorites';
      
      Alert.alert('Success', message);
      
      // Navigate to Favorites screen if marked as favorite
      if (newFavoriteStatus) {
        navigation.navigate('Favourite', { 
          newFavorite: updatedJournals[journalIndex],
          refresh: true 
        });
        
        // Also save to favorites storage
        await saveToFavorites(updatedJournals[journalIndex]);
      } else {
        // Remove from favorites storage
        await removeFromFavorites(journalId);
      }
      
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };
  
  // Helper functions to manage favorites storage
  const saveToFavorites = async (journal) => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorite_journals');
      let favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      
      // Check if already exists
      const exists = favorites.some(fav => fav.id === journal.id);
      if (!exists) {
        favorites.push(journal);
        await AsyncStorage.setItem('favorite_journals', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error saving to favorites:', error);
    }
  };
  
  const removeFromFavorites = async (journalId) => {
    try {
      const favoritesJson = await AsyncStorage.getItem('favorite_journals');
      if (favoritesJson) {
        let favorites = JSON.parse(favoritesJson);
        favorites = favorites.filter(fav => fav.id !== journalId);
        await AsyncStorage.setItem('favorite_journals', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

// Add photo to journal entry
const handleAddPhoto = async (journalId) => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to add photos.');
        return;
      }
      
      // Show image picker - allow multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: true, // Enable multiple selection
      });
      
      if (result.canceled) return;
      
      // Get selected images
      const selectedAssets = result.assets;
      
      // Find journal entry
      const journalIndex = journals.findIndex(j => j.id === journalId);
      if (journalIndex === -1) return;
      
      // Create updated journals array
      const updatedJournals = [...journals];
      const currentJournal = updatedJournals[journalIndex];
      
      // Prepare photos array (initialize if doesn't exist)
      const currentPhotos = currentJournal.photos || [];
      
      // Add new photos to existing ones
      const newPhotos = selectedAssets.map(asset => ({
        uri: asset.uri,
        // You can add other properties like id, timestamp if needed
      }));
      
      // Update journal with combined photos
      updatedJournals[journalIndex] = {
        ...currentJournal,
        photos: [...currentPhotos, ...newPhotos],
        // Keep backward compatibility with single photo field if needed
        photo: currentPhotos.length > 0 ? currentPhotos[0] : newPhotos[0],
        // Remove base64 photo if exists to avoid duplication
        photoBase64: null
      };
      
      // Update state
      setJournals(updatedJournals);
      
      // Update filtered journals if needed
      const filteredIndex = filteredJournals.findIndex(j => j.id === journalId);
      if (filteredIndex !== -1) {
        const updatedFiltered = [...filteredJournals];
        updatedFiltered[filteredIndex] = updatedJournals[journalIndex];
        setFilteredJournals(updatedFiltered);
      }
      
      // Save to storage
      await AsyncStorage.setItem('journal_entries', JSON.stringify(updatedJournals));
      
      Alert.alert('Success', `${selectedAssets.length} photo(s) added to journal entry`);
      
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Error', 'Failed to add photo to journal entry');
    }
  };

// Export voice memo to device storage
const handleExportVoiceMemo = async (journal) => {
  try {
    if (!journal.recordingPath) {
      Alert.alert('No Recording', 'This journal entry does not have a voice memo.');
      return;
    }
    
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your media library to save recordings.');
      return;
    }
    
    // Show export options
    Alert.alert(
      'Export Voice Memo',
      'Choose export option:',
      [
        { 
          text: 'Save to Device', 
          onPress: async () => {
            try {
              // Create filename based on date
              const date = format(new Date(journal.timestamp), 'yyyyMMdd_HHmmss');
              const filename = `moodify_voice_${date}.m4a`;
              
              // Create a copy in the app's documents directory
              const destinationUri = `${FileSystem.documentDirectory}${filename}`;
              await FileSystem.copyAsync({
                from: journal.recordingPath,
                to: destinationUri
              });
              
              // Save file to media library
              const asset = await MediaLibrary.createAssetAsync(destinationUri);
              
              // Create album if it doesn't exist
              const album = await MediaLibrary.getAlbumAsync('MoodiFy');
              if (album === null) {
                await MediaLibrary.createAlbumAsync('MoodiFy', asset, false);
              } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              }
              
              Alert.alert('Success', 'Voice memo saved to your device in MoodiFy album');
              
            } catch (error) {
              console.error('Error saving voice memo:', error);
              Alert.alert('Error', 'Failed to save voice memo to device');
            }
          }
        },
        { 
          text: 'Share', 
          onPress: async () => {
            try {
              // Check if sharing is available
              if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Sharing not available', 'Sharing is not available on this device');
                return;
              }
              
              // Create filename based on date
              const date = format(new Date(journal.timestamp), 'yyyyMMdd_HHmmss');
              const filename = `moodify_voice_${date}.m4a`;
              
              // Create a copy in the cache directory
              const tempFile = `${FileSystem.cacheDirectory}${filename}`;
              await FileSystem.copyAsync({
                from: journal.recordingPath,
                to: tempFile
              });
              
              // Show share dialog
              await Sharing.shareAsync(tempFile, {
                dialogTitle: 'Share Voice Memo',
                mimeType: 'audio/m4a',
                UTI: 'public.audio'
              });
              
              // Clean up temp file
              setTimeout(async () => {
                try {
                  await FileSystem.deleteAsync(tempFile);
                } catch (e) {
                  console.log('Error cleaning up temp file:', e);
                }
              }, 5000);
              
            } catch (error) {
              console.error('Error sharing voice memo:', error);
              Alert.alert('Error', 'Failed to share voice memo');
            }
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
    
  } catch (error) {
    console.error('Error exporting voice memo:', error);
    Alert.alert('Error', 'Failed to export voice memo');
  }
};
  // Navigate to Home
  const navigateToHome = () => {
    navigation.navigate('Home');
  };

  // Play recorded audio
  const playRecordedAudio = async (recordingPath) => {
    if (!recordingPath) return;
    
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingPath }
      );
      
      // Set the sound object
      setSound(newSound);
      
      // Play the sound
      await newSound.playAsync();
      
      // Listen for when playback finishes
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          newSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play recording.');
    }
  };

  // Group journals by date for connected display
  const groupJournalsByDate = (journals) => {
    const grouped = {};
    
    journals.forEach(journal => {
      const date = format(new Date(journal.timestamp), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(journal);
    });
    
    // Sort each group by time (newest first within the day)
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    });
    
    // Convert to array and sort by date (newest date first)
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .map(date => ({
        date,
        formattedDate: format(new Date(date), 'dd MMMM'),
        isToday: format(new Date(date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
        entries: grouped[date]
      }));
  };

  // Render mood selection overlay
  const renderMoodSelection = () => {
    if (!showMoodSelection) return null;
    
    const moods = [
      { emoji: '😃', label: 'rad', color: '#1DB954' },
      { emoji: '😊', label: 'good', color: '#A2D149' },
      { emoji: '😐', label: 'meh', color: '#55A9F0' },
      { emoji: '☹️', label: 'bad', color: '#F28C38' },
      { emoji: '😖', label: 'awful', color: '#E94642' },
    ];
    
    return (
      <View style={styles.moodSelectionOverlay}>
        <View style={styles.moodSelectionContainer}>
          <Text style={styles.moodSelectionTitle}>How are you?</Text>
          <View style={styles.moodOptions}>
            {moods.map((mood) => (
              <TouchableOpacity 
                key={mood.label}
                style={[styles.moodOption, { backgroundColor: mood.color }]}
                onPress={() => {
                  // Handle mood selection
                  toggleMoodSelection();
                  navigation.navigate('JournalCreate', { selectedMood: mood });
                }}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Render dropdown menu
  const renderDropdownMenu = () => {
    if (!showDropdown) return null;
    
    return (
      <Modal
        transparent
        visible={showDropdown}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity 
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('edit')}
            >
              <Text style={styles.dropdownText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('share')}
            >
              <Text style={styles.dropdownText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('favorite')}
            >
              <Text style={styles.dropdownText}>Mark as Favorite</Text>
            </TouchableOpacity>
            
            <View style={styles.dropdownDivider} />
            
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('addPhoto')}
            >
              <Text style={styles.dropdownText}>Add Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('exportVoice')}
            >
              <Text style={styles.dropdownText}>Export Voice Memo</Text>
            </TouchableOpacity>
            
            <View style={styles.dropdownDivider} />
            
            <TouchableOpacity 
              style={styles.dropdownOption}
              onPress={() => handleDropdownOption('delete')}
            >
              <Text style={[styles.dropdownText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

 // Add this function to your Dashboard component
const viewJournalDetails = (journal) => {
    navigation.navigate('JournalView', { 
      journalId: journal.id,
      journalData: journal 
    });
  };
  
  // Update the renderJournalGroup function to use viewJournalDetails
  const renderJournalGroup = ({ item }) => {
    const { date, formattedDate, isToday, entries } = item;
    const dateHeader = isToday ? `TODAY, ${formattedDate}` : `YESTERDAY, ${formattedDate}`;
    
    return (
      <View style={styles.journalGroup}>
        {entries.length > 0 && (
          <View style={styles.dateHeader}>
            {isToday && <View style={styles.todayIndicator} />}
            <Text style={styles.dateHeaderText}>{dateHeader}</Text>
          </View>
        )}
        
        {entries.map((entry, index) => {
          const journalDate = new Date(entry.timestamp);
          const formattedTime = format(journalDate, 'HH:mm');
          const journalMood = entry.mood || { emoji: '😐', color: '#55a9f0', label: 'meh' };
          const isLastEntry = index === entries.length - 1;
          
          return (
            <View key={entry.id} style={styles.journalEntryContainer}>
              {!isLastEntry && <View style={styles.verticalConnector} />}
              
              <TouchableOpacity 
                style={styles.journalCard}
                onPress={() => viewJournalDetails(entry)} // Updated this line
              >
                {/* Rest of your journal card content */}
                <View style={styles.journalHeader}>
                  <View style={[styles.journalMoodContainer, { backgroundColor: journalMood.color }]}>
                    <Text style={styles.journalEmoji}>{journalMood.emoji}</Text>
                  </View>
                  <View style={styles.journalInfo}>
                    <Text style={[styles.journalMood, { color: journalMood.color }]}>
                      {journalMood.label} {formattedTime}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.journalMenuButton}
                    onPress={() => {
                        setSelectedJournal(entry);
                        setShowDropdown(true);
                      }}
                  >
                    <Icon name="dots-horizontal" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                
                {/* Activities */}
                {entry.activities && entry.activities.length > 0 && (
                  <View style={styles.journalActivities}>
                    {entry.activities.map(activityId => {
                      const activity = activities.find(a => a.id === activityId);
                      if (!activity) return null;
                      
                      return (
                        <View key={activityId} style={styles.journalActivity}>
                          <Icon name={activity.icon} size={18} color={journalMood.color} />
                          <Text style={styles.journalActivityText}>{activity.label}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
                
                {/* Note */}
                {entry.note && (
                  <Text style={styles.journalNote}>{entry.note}</Text>
                )}
                
                {/* Media content */}
                <View style={styles.journalMedia}>
                  {/* Voice Recording */}
                  {entry.recordingPath && (
                    <TouchableOpacity 
                      style={styles.journalAudio}
                      onPress={() => playRecordedAudio(entry.recordingPath)}
                    >
                      <View style={styles.audioProgressBar}>
                        {[...Array(23)].map((_, i) => (
                          <View key={i} style={styles.audioDot} />
                        ))}
                      </View>
                      <View style={styles.audioControls}>
                        <Text style={styles.audioDuration}>0:03</Text>
                        <TouchableOpacity 
                          style={styles.audioPlayButton}
                          onPress={() => playRecordedAudio(entry.recordingPath)}
                        >
                          <Icon name="play" size={24} color="black" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                  
                  {/* Images */}
                  <View style={styles.imageGallery}>
                    {entry.photo && entry.photo.uri && (
                      <Image source={{ uri: entry.photo.uri }} style={styles.journalImage} />
                    )}
                    {!entry.photo?.uri && entry.photoBase64 && (
                      <Image 
                        source={{ uri: `data:image/jpeg;base64,${entry.photoBase64}` }} 
                        style={styles.journalImage} 
                      />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  };

  // Group journals by date
  const groupedJournals = groupJournalsByDate(filteredJournals);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#BDD3CC" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>     
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Icon name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>{monthYearDisplay}</Text>
          
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Icon name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
          <Icon name={showSearch ? "close" : "magnify"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#555" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search journal entries..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Icon name="close-circle" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* Dropdown Menu */}
      {renderDropdownMenu()}
      
      {/* Mood Selection if showing */}
      {showMoodSelection && renderMoodSelection()}
      
      {/* Journal List */}
      {journals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Let's add the first entry!</Text>
          <Text style={styles.emptySubtitle}>Tap the big PLUS button below.</Text>
          <Icon name="arrow-down" size={32} color="#13d479" />
        </View>
      ) : (
        <FlatList
          data={groupedJournals}
          renderItem={renderJournalGroup}
          keyExtractor={item => item.date}
          contentContainerStyle={styles.journalList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Icon name="magnify" size={48} color="black" />
              <Text style={styles.noResultsText}>No journal entries found</Text>
              {searchQuery.length > 0 && (
                <Text style={styles.noResultsSubtext}>
                  Try different search terms
                </Text>
              )}
            </View>
          }
        />
      )}
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="notebook" size={22} color="black" />
          <Text style={styles.navText}>Entries</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Icon name="chart-line" size={22} color="#666" fontWeight="bold"/>
          <Text style={[styles.navText, { color: '#666' }]}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={navigateToHome}
        >
          <Icon name="plus" size={30} color="#000" />
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.navItem } onPress={() => navigation.navigate("Calendar")}>
          <Icon name="calendar-month" size={22} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Calendar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem}
          onPress={navigateToFavorites}
        >
          <MaterialIcons name="favorite-border" size={22} color="#666" />
          <Text style={[styles.navText, { color: '#666' }]}>Favourites</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;