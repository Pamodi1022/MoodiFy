import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import styles from '../Styles/JournalEdit'; // Import your styles here

const JournalEdit = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { journalId } = route.params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [journal, setJournal] = useState(null);
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [photoUri, setPhotoUri] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  
  // Load journal entry and activities when component mounts
  useEffect(() => {
    loadJournalEntry();
    loadActivities();
  }, []);
  
  // Load journal entry from AsyncStorage
  const loadJournalEntry = async () => {
    try {
      const journalEntriesJson = await AsyncStorage.getItem('journal_entries');
      if (journalEntriesJson) {
        const journalEntries = JSON.parse(journalEntriesJson);
        const foundJournal = journalEntries.find(entry => entry.id === journalId);
        
        if (foundJournal) {
          setJournal(foundJournal);
          setNote(foundJournal.note || '');
          setSelectedActivities(foundJournal.activities || []);
          
          // Handle photo
          if (foundJournal.photo && foundJournal.photo.uri) {
            setPhotoUri(foundJournal.photo.uri);
          }
          if (foundJournal.photoBase64) {
            setPhotoBase64(foundJournal.photoBase64);
          }
        } else {
          Alert.alert('Error', 'Journal entry not found');
          navigation.goBack();
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading journal entry:', error);
      Alert.alert('Error', 'Failed to load journal entry');
      setIsLoading(false);
      navigation.goBack();
    }
  };
  
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
  
  // Toggle activity selection
  const toggleActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };
  
  // Take a new photo using the camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permission to take photos');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // Store the URI for display
        setPhotoUri(asset.uri);
        
        // Store base64 for saving
        if (asset.base64) {
          setPhotoBase64(asset.base64);
        } else {
          // If base64 is not directly available, convert URI to base64
          const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
          setPhotoBase64(base64);
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Pick a photo from the gallery
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant media library permission to select photos');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        
        // Store the URI for display
        setPhotoUri(asset.uri);
        
        // Store base64 for saving
        if (asset.base64) {
          setPhotoBase64(asset.base64);
        } else {
          // If base64 is not directly available, convert URI to base64
          const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
          setPhotoBase64(base64);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  // Remove current photo
  const removePhoto = () => {
    setPhotoUri(null);
    setPhotoBase64(null);
  };
  
  // Show photo options (take photo, pick from gallery, remove)
  const showPhotoOptions = () => {
    Alert.alert(
      'Photo Options',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        photoUri ? { text: 'Remove Photo', onPress: removePhoto, style: 'destructive' } : null,
        { text: 'Cancel', style: 'cancel' },
      ].filter(Boolean)
    );
  };
  
  // Save the edited journal entry
  const saveJournal = async () => {
    try {
      if (!journal) return;
      
      // Update the journal with edited values
      const updatedJournal = {
        ...journal,
        note,
        activities: selectedActivities,
        updatedAt: new Date().toISOString(),
      };
      
      // Update photo if changed
      if (photoUri) {
        updatedJournal.photo = { uri: photoUri };
      }
      
      if (photoBase64) {
        updatedJournal.photoBase64 = photoBase64;
      }
      
      // Get all journals and update the specific one
      const journalEntriesJson = await AsyncStorage.getItem('journal_entries');
      let journalEntries = [];
      
      if (journalEntriesJson) {
        journalEntries = JSON.parse(journalEntriesJson);
        const index = journalEntries.findIndex(entry => entry.id === journalId);
        
        if (index !== -1) {
          journalEntries[index] = updatedJournal;
        } else {
          journalEntries.push(updatedJournal);
        }
      } else {
        journalEntries = [updatedJournal];
      }
      
      // Save updated journals back to AsyncStorage
      await AsyncStorage.setItem('journal_entries', JSON.stringify(journalEntries));
      
      Alert.alert('Success', 'Journal entry updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving journal:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    }
  };
  
  // Format journal date for display
  const getFormattedDate = () => {
    if (!journal || !journal.timestamp) return '';
    
    const date = new Date(journal.timestamp);
    return format(date, 'MMMM d, yyyy • h:mm a');
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#13d479" />
        <Text style={styles.loadingText}>Loading journal entry...</Text>
      </SafeAreaView>
    );
  }
  
  if (!journal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Journal not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>      
      {/* Header */}
      <View style={styles.header}>
        <StatusBar backgroundColor="#2A2539" barStyle="light-content" />
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Journal</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveJournal}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date & Mood */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getFormattedDate()}</Text>
          <View style={[styles.moodIndicator, { backgroundColor: journal.mood?.color || '#55a9f0' }]}>
            <Text style={styles.moodEmoji}>{journal.mood?.emoji || '😐'}</Text>
          </View>
        </View>
        
        {/* Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesContainer}>
            {activities.map(activity => (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityItem,
                  selectedActivities.includes(activity.id) && 
                  { backgroundColor: journal.mood?.color || '#55a9f0', opacity: 0.9 }
                ]}
                onPress={() => toggleActivity(activity.id)}
              >
                <Icon 
                  name={activity.icon} 
                  size={24} 
                  color={selectedActivities.includes(activity.id) ? '#fff' : '#aaa'} 
                />
                <Text 
                  style={[
                    styles.activityLabel,
                    selectedActivities.includes(activity.id) && { color: '#fff' }
                  ]}
                >
                  {activity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="How was your day?"
            placeholderTextColor="#888"
            multiline
            value={note}
            onChangeText={setNote}
          />
        </View>
        
        {/* Photo */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photo</Text>
            <TouchableOpacity style={styles.addButton} onPress={showPhotoOptions}>
              <Icon name="camera" size={22} color="#BDDBCC" />
              <Text style={styles.addButtonText}>
                {photoUri ? 'Change Photo' : 'Add Photo'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {photoUri ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                <Icon name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : photoBase64 ? (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: `data:image/jpeg;base64,${photoBase64}` }} 
                style={styles.photo} 
              />
              <TouchableOpacity style={styles.removePhotoButton} onPress={removePhoto}>
                <Icon name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyPhoto}>
              <Icon name="image-outline" size={48} color="#444" />
              <Text style={styles.emptyPhotoText}>No photo added</Text>
            </View>
          )}
        </View>
        
        {/* Voice Recording (Read-only display) */}
        {journal.recordingPath && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Voice Memo</Text>
            <View style={styles.recordingContainer}>
              <Icon name="microphone" size={24} color="#BDDBCC" />
              <Text style={styles.recordingText}>Voice memo available</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalEdit;