import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { MoodContext } from "./MoodContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import styles from "../Styles/Journal";
import CustomPopup from "./CustomPopup";


const JournalPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedMood } = useContext(MoodContext);
  const [journalId] = useState(route.params?.journalId || uuidv4());
  const [note, setNote] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null); // Store base64 data

  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPath, setRecordingPath] = useState(null);
  const [recordingTime, setRecordingTime] = useState("00:00");
  const [hasRecording, setHasRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);

  // Unique directory for this journal entry
  const journalDir = `${FileSystem.documentDirectory}journal_${journalId}`;

  // Activities data with icons and labels
  const activities = [
    { id: 1, icon: "account-group", label: "family" },
    { id: 2, icon: "account-multiple", label: "friends" },
    { id: 3, icon: "heart", label: "date" },
    { id: 4, icon: "yoga", label: "exercise" },
    { id: 5, icon: "run", label: "sport" },
    { id: 6, icon: "bed", label: "sleep early" },
    { id: 7, icon: "food-apple", label: "eat healthy" },
    { id: 8, icon: "umbrella-beach", label: "relax" },
    { id: 9, icon: "television", label: "movies" },
    { id: 10, icon: "book-open-variant", label: "read" },
    { id: 11, icon: "gamepad-variant", label: "gaming" },
    { id: 12, icon: "broom", label: "cleaning" },
    { id: 13, icon: "cart", label: "shopping" },
    { id: 14, icon: "food", label: "Cooking" },
    { id: 15, icon: "meditation", label: "meditation" },
  ];

    // Add new state for popups
    const [showPopup, setShowPopup] = useState(false);
    const [popupConfig, setPopupConfig] = useState({
      title: "",
      message: "",
      onConfirm: null,
      onCancel: null
    });
  
    // Helper function to show popup
    const showCustomPopup = (title, message, onConfirm, onCancel = null) => {
      setPopupConfig({
        title,
        message,
        onConfirm: () => {
          onConfirm();
          setShowPopup(false);
        },
        onCancel: onCancel ? () => {
          onCancel();
          setShowPopup(false);
        } : null
      });
      setShowPopup(true);
    };

  // Load journal data if exists
  useEffect(() => {
    const loadJournalData = async () => {
      try {
        const journalData = await AsyncStorage.getItem(`journal_${journalId}`);
        if (journalData) {
          const parsedData = JSON.parse(journalData);
          setNote(parsedData.note || "");
          setSelectedActivities(parsedData.activities || []);
          setPhoto(parsedData.photo || null);
          setPhotoBase64(parsedData.photoBase64 || null);
          setRecordingPath(parsedData.recordingPath || null);
          setHasRecording(parsedData.hasRecording || false);
          
          // If we have mood data in the journal entry, use that
          if (parsedData.mood) {
            setSelectedMood(parsedData.mood);
          }
        }
    
        // Create directory if it doesn't exist
        const exists = await FileSystem.getInfoAsync(journalDir);
        if (!exists.exists) {
          await FileSystem.makeDirectoryAsync(journalDir, {
            intermediates: true,
          });
        }
      } catch (error) {
        console.error("Error loading journal data:", error);
      }
    };
    
    loadJournalData();

    // Audio setup
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [journalId]);

  // Save data whenever it changes
  useEffect(() => {
    const saveJournalData = async () => {
      try {
        const journalData = {
          id: journalId,
          moodId: selectedMood?.id,
          mood: selectedMood, // Save the entire mood object
          note,
          activities: selectedActivities,
          photo,
          photoBase64, // Save the base64 image data
          recordingPath,
          hasRecording,
          timestamp: new Date().toISOString(),
        };

        await AsyncStorage.setItem(
          `journal_${journalId}`,
          JSON.stringify(journalData)
        );
      } catch (error) {
        console.error("Error saving journal data:", error);
      }
    };

    // Debounce save to prevent too many writes
    const timeoutId = setTimeout(saveJournalData, 500);
    return () => clearTimeout(timeoutId);
  }, [
    journalId,
    selectedMood,
    note,
    selectedActivities,
    photo,
    photoBase64,
    recordingPath,
    hasRecording,
  ]);

  // Toggle activity selection
  const toggleActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId)
      );
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  // Request camera and media library permissions
  const requestMediaPermissions = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const libraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return (
        cameraPermission.status === "granted" &&
        libraryPermission.status === "granted"
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Request audio recording permission
  const requestAudioPermission = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      return permission.status === "granted";
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Show image picker options
  const showImagePickerOptions = () => {
    Alert.alert(
      "Add Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => handleTakePhoto() },
        { text: "Choose from Gallery", onPress: () => handleChoosePhoto() },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  // Read image as base64
  const readImageAsBase64 = async (uri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error("Error reading image as base64:", error);
      return null;
    }
  };

  // Handle taking a photo with camera
  const handleTakePhoto = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      showCustomPopup(
        "Permission Denied",
        "Camera permission is required to take photos.",
        () => {}
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      // Save photo details
      const selectedPhoto = result.assets[0];

      // Copy the photo to our app's directory
      const photoName = `photo_${Date.now()}.jpg`;
      const photoPath = `${journalDir}/${photoName}`;

      await FileSystem.copyAsync({
        from: selectedPhoto.uri,
        to: photoPath,
      });

      // Read the image as base64
      const base64Data = await readImageAsBase64(photoPath);

      setPhoto({
        uri: photoPath,
        name: photoName,
        type: "image/jpeg",
      });

      setPhotoBase64(base64Data);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo.");
    }
  };

  // Handle choosing photo from gallery
  const handleChoosePhoto = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      showCustomPopup(
        "Permission Denied",
        "Storage permission is required to choose photos.",
        () => {}
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      // Save photo details
      const selectedPhoto = result.assets[0];

      // Copy the photo to our app's directory
      const photoName = `photo_${Date.now()}.jpg`;
      const photoPath = `${journalDir}/${photoName}`;

      await FileSystem.copyAsync({
        from: selectedPhoto.uri,
        to: photoPath,
      });

      // Read the image as base64
      const base64Data = await readImageAsBase64(photoPath);

      setPhoto({
        uri: photoPath,
        name: photoName,
        type: "image/jpeg",
      });

      setPhotoBase64(base64Data);
    } catch (error) {
      console.error("Error choosing photo:", error);
      Alert.alert("Error", "Failed to select photo.");
    }
  };

  // Format time for recording display
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Start recording with Expo Audio
  const startRecording = async () => {
    try {
      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create new recording instance
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // Set recording object
      setRecording(newRecording);
      setIsRecording(true);

      // Start tracking recording time
      const intervalId = setInterval(() => {
        if (newRecording._finalDurationMillis) {
          setRecordingTime(formatTime(newRecording._finalDurationMillis));
        } else if (newRecording._progressUpdateTimeMillis) {
          setRecordingTime(formatTime(newRecording._progressUpdateTimeMillis));
        }
      }, 1000);

      // Save interval ID to recording object for cleanup
      newRecording._timeUpdateInterval = intervalId;
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  // Stop recording with Expo Audio
  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Clear time update interval
      if (recording._timeUpdateInterval) {
        clearInterval(recording._timeUpdateInterval);
      }

      // Stop recording
      await recording.stopAndUnloadAsync();

      // Get recording URI
      const uri = recording.getURI();

      // Copy recording to our app's directory
      const audioFileName = `voice_${Date.now()}.m4a`;
      const audioPath = `${journalDir}/${audioFileName}`;

      await FileSystem.copyAsync({
        from: uri,
        to: audioPath,
      });

      // Update state
      setRecording(null);
      setIsRecording(false);
      setHasRecording(true);
      setRecordingPath(audioPath);

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  // Handle voice recording
  const handleVoiceRecording = async () => {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      showCustomPopup(
        "Permission Denied",
        "Microphone permission is required to record audio.",
        () => {}
      );
      return;
    }

    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // Play recorded audio
  const playRecordedAudio = async () => {
    if (!recordingPath) return;

    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: recordingPath,
      });

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
      console.error("Error playing audio:", error);
      Alert.alert("Error", "Failed to play recording.");
    }
  };

  // Delete photo
  const deletePhoto = () => {
    showCustomPopup(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      async () => {
        try {
          if (photo && photo.uri) {
            await FileSystem.deleteAsync(photo.uri);
          }
          setPhoto(null);
          setPhotoBase64(null);
        } catch (error) {
          console.error("Error deleting photo:", error);
        }
      },
      () => {}
    );
  };

  // Delete recording
  const deleteRecording = () => {
    showCustomPopup(
      "Delete Recording",
      "Are you sure you want to delete this recording?",
      async () => {
        try {
          if (recordingPath) {
            await FileSystem.deleteAsync(recordingPath);
          }
          setRecordingPath(null);
          setHasRecording(false);
          setRecordingTime("00:00");
        } catch (error) {
          console.error("Error deleting recording:", error);
        }
      },
      () => {}
    );
  };

  const saveJournal = async () => {
    try {
      // Get all journal entries
      const journalEntriesJson = await AsyncStorage.getItem("journal_entries");
      let journalEntries = journalEntriesJson ? JSON.parse(journalEntriesJson) : [];
  
      // Create entry object with complete mood data
      const journalData = {
        id: journalId,
        moodId: selectedMood?.id,
        mood: selectedMood, // Save the complete mood object
        note,
        activities: selectedActivities,
        photo: photo ? {
          uri: photo.uri,
          name: photo.name,
          type: photo.type,
        } : null,
        photoBase64, // Include the base64 image data
        recordingPath,
        hasRecording,
        timestamp: new Date().toISOString(),
      };
  
      // Check if entry already exists
      const existingIndex = journalEntries.findIndex(entry => entry.id === journalId);
      if (existingIndex >= 0) {
        journalEntries[existingIndex] = journalData;
      } else {
        journalEntries.unshift(journalData);
      }
  
      // Save updated entries
      await AsyncStorage.setItem("journal_entries", JSON.stringify(journalEntries));
  
      // Also save mood entries separately for calendar view
      const moodEntry = {
        id: uuidv4(),
        date: new Date().toISOString(),
        moodId: selectedMood?.id,
        moodData: selectedMood,
        journalId: journalId,
      };
  
      // Get existing mood entries or create new array
      const existingMoodEntries = await AsyncStorage.getItem("mood_entries");
      let moodEntries = existingMoodEntries ? JSON.parse(existingMoodEntries) : [];
      
      // Add new mood entry
      moodEntries.push(moodEntry);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem("mood_entries", JSON.stringify(moodEntries));
  
      // Save the selected mood separately for potential reuse
      if (selectedMood) {
        await AsyncStorage.setItem("last_selected_mood", JSON.stringify(selectedMood));
      }
  
      showCustomPopup(
        "Success",
        "Journal entry saved successfully!",
        () => navigation.navigate("Dashboard")
      );
    } catch (error) {
      console.error("Error saving journal entry:", error);
      showCustomPopup(
        "Error",
        "Failed to save journal entry.",
        () => {}
      );
    }
  };

  // Navigate to edit activities screen
  const editActivities = () => {
    navigation.navigate("EditActivities");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-left" size={32} color="black" />
          {selectedMood && (
            <View style={styles.moodIconContainer}>
              <Text style={styles.moodEmoji}>{selectedMood.emoji}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={saveJournal} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* What have you been up to? */}
        <Text style={styles.questionText}>What have you been up to?</Text>

        {/* Activities Grid */}
        <View style={styles.activitiesGrid}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                selectedActivities.includes(activity.id) &&
                  styles.selectedActivity,
              ]}
              onPress={() => toggleActivity(activity.id)}
            >
              <View
                style={[
                  styles.activityIconContainer,
                  selectedActivities.includes(activity.id) &&
                    styles.selectedActivityIcon,
                ]}
              >
                <Icon name={activity.icon} size={24} color="black" />
              </View>
              <Text style={styles.activityLabel}>{activity.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Note */}
        <View style={styles.noteSection}>
          <View style={styles.noteTitleContainer}>
            <Icon name="note-text-outline" size={24} color="black" />
            <Text style={styles.noteTitle}>Quick Note</Text>
          </View>

          <TextInput
            style={styles.noteInput}
            placeholder="Add Note..."
            placeholderTextColor="#888"
            multiline={true}
            value={note}
            onChangeText={setNote}
          />
        </View>

        {/* Photo */}
        <View style={styles.mediaSection}>
          <View style={styles.mediaTitleContainer}>
            <Icon name="camera" size={24} color="black" />
            <Text style={styles.mediaTitle}>Photo</Text>
          </View>

          {photo ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
              <View style={styles.photoActions}>
                <TouchableOpacity
                  onPress={showImagePickerOptions}
                  style={styles.photoAction}
                >
                  <Icon name="camera-plus" size={24} color="black" />
                  <Text style={styles.photoActionText}>Change</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deletePhoto}
                  style={styles.photoAction}
                >
                  <Icon name="delete" size={24} color="#FF5252" />
                  <Text style={[styles.photoActionText, { color: "#FF5252" }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={showImagePickerOptions}
            >
              <Text style={styles.mediaButtonText}>Tap to Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Voice Memo */}
        <View style={styles.mediaSection}>
          <View style={styles.mediaTitleContainer}>
            <Icon name="microphone" size={24} color="black" />
            <Text style={styles.mediaTitle}>Voice Memo</Text>
          </View>

          {hasRecording && !isRecording ? (
            <View style={styles.recordingContainer}>
              <View style={styles.recordingInfo}>
                <Icon name="music-note" size={24} color="black" />
                <Text style={styles.recordingText}>Recording available</Text>
              </View>
              <View style={styles.recordingActions}>
                <TouchableOpacity
                  onPress={playRecordedAudio}
                  style={styles.recordingAction}
                >
                  <Icon name="play" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleVoiceRecording}
                  style={styles.recordingAction}
                >
                  <Icon name="microphone-plus" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deleteRecording}
                  style={styles.recordingAction}
                >
                  <Icon name="delete" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.mediaButton,
                isRecording && styles.recordingActive,
              ]}
              onPress={handleVoiceRecording}
            >
              {isRecording ? (
                <View style={styles.recordingProgress}>
                  <Text style={styles.recordingTimeText}>{recordingTime}</Text>
                  <Text style={styles.recordingInProgressText}>
                    Recording... Tap to Stop
                  </Text>
                </View>
              ) : (
                <Text style={styles.mediaButtonText}>Tap to Record</Text>
              )}
              <Icon
                name={isRecording ? "stop-circle" : "microphone"}
                size={24}
                color={isRecording ? "#FF5252" : "#4CAF50"}
                style={styles.recordIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <CustomPopup
        isVisible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        onConfirm={popupConfig.onConfirm}
        onCancel={popupConfig.onCancel}
      />
    </SafeAreaView>
  );
};

export default JournalPage;
