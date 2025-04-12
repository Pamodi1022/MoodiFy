import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Share,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { Audio } from "expo-av";
import styles from "../Styles/JournalView"; 

const JournalView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { journalId } = route.params;

  const [journal, setJournal] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load journal data and activities
  useEffect(() => {
    loadJournalData();
    loadActivities();

    return () => {
      // Clean up audio resources when unmounting
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [journalId]);

  // Load specific journal entry from AsyncStorage
  const loadJournalData = async () => {
    try {
      const journalEntriesJson = await AsyncStorage.getItem("journal_entries");

      if (journalEntriesJson) {
        const journals = JSON.parse(journalEntriesJson);
        const foundJournal = journals.find((j) => j.id === journalId);

        if (foundJournal) {
          setJournal(foundJournal);
        } else {
          Alert.alert("Error", "Journal entry not found");
          navigation.goBack();
        }
      } else {
        Alert.alert("Error", "No journal entries found");
        navigation.goBack();
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading journal data:", error);
      Alert.alert("Error", "Failed to load journal entry");
      navigation.goBack();
    }
  };

  // Load activities from AsyncStorage
  const loadActivities = async () => {
    try {
      // First try to get activities from AsyncStorage
      const activitiesJson = await AsyncStorage.getItem("activities");
      
      if (activitiesJson) {
        const parsedActivities = JSON.parse(activitiesJson);
        setActivities(parsedActivities);
        console.log("Activities loaded from storage:", parsedActivities);
      } else {
        // If no custom activities found, use default activities list
        const defaultActivities = [
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
        setActivities(defaultActivities);
        console.log("Using default activities list");
      }
    } catch (error) {
      console.error("Error loading activities:", error);
      // Set default activities as fallback
      const defaultActivities = [
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
      setActivities(defaultActivities);
    }
  };

  // Handle playing audio recordings
  const handlePlayRecording = async () => {
    if (!journal || !journal.recordingPath) return;

    try {
      if (sound) {
        // If sound is already loaded, toggle play/pause
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load the sound if not loaded
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: journal.recordingPath },
          { progressUpdateIntervalMillis: 200 },
          onPlaybackStatusUpdate
        );

        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing recording:", error);
      Alert.alert("Error", "Failed to play voice recording");
    }
  };

  // Handle playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPlaybackPosition(0);
      }
    }
  };

  // Format time for audio player (mm:ss)
  const formatTime = (milliseconds) => {
    if (!milliseconds) return "00:00";

    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Share journal entry
  const shareJournal = async () => {
    if (!journal) return;

    try {
      const entryDate = format(
        new Date(journal.timestamp),
        "dd MMMM yyyy HH:mm"
      );

      // Format journal entry as text for sharing
      let shareText = `MoodiFy Journal Entry - ${entryDate}\n\n`;
      shareText += `Mood: ${journal.mood?.label || "Not specified"}\n\n`;

      // Add activities if present
      if (journal.activities && journal.activities.length > 0) {
        shareText += "Activities: ";
        const activityLabels = journal.activities
          .map((actId) => {
            const activity = activities.find((a) => a.id === actId);
            return activity ? activity.label : "";
          })
          .filter((label) => label);

        shareText += activityLabels.join(", ") + "\n\n";
      }

      // Add note if present
      if (journal.note) {
        shareText += `Note: ${journal.note}\n\n`;
      }

      await Share.share({
        message: shareText,
        title: "MoodiFy Journal Entry",
      });
    } catch (error) {
      console.error("Error sharing journal:", error);
      Alert.alert("Error", "Failed to share journal entry");
    }
  };

  // Navigate back to the dashboard
  const goBack = () => {
    navigation.goBack();
  };

  // Edit the current journal entry
  const editJournal = () => {
    navigation.navigate("JournalEdit", { journalId: journalId });
  };

  // Render gallery image
  const renderImage = ({ item, index }) => {
    return (
      <Image
        source={{ uri: item.uri || `data:image/jpeg;base64,${item}` }}
        style={styles.galleryImage}
        resizeMode="cover"
      />
    );
  };

  // Handle image loading and determine which images to show
  const getImagesToShow = () => {
    if (!journal) return [];

    const images = [];

    // Add multi photos if available
    if (journal.photos && journal.photos.length > 0) {
      images.push(...journal.photos);
    }
    // Add single photo if available and not already added
    else if (journal.photo && journal.photo.uri) {
      images.push(journal.photo);
    }
    // Add base64 photo if available
    else if (journal.photoBase64) {
      images.push(journal.photoBase64);
    }

    return images;
  };

  if (loading || !journal) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading journal entry...</Text>
      </View>
    );
  }

  const journalDate = new Date(journal.timestamp);
  const formattedDate = format(journalDate, "dd MMMM yyyy");
  const formattedTime = format(journalDate, "HH:mm");
  const journalMood = journal.mood || {
    emoji: "😐",
    color: "#55a9f0",
    label: "meh",
  };
  const journalActivities = journal.activities || [];
  const images = getImagesToShow();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Journal Details</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={editJournal} style={styles.actionButton}>
            <Icon name="pencil" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareJournal} style={styles.actionButton}>
            <Icon name="share-variant" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Date and Time */}
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        {/* Mood */}
        <View style={styles.moodContainer}>
          <View
            style={[
              styles.moodIconContainer,
              { backgroundColor: journalMood.color },
            ]}
          >
            <Text style={styles.moodEmoji}>{journalMood.emoji}</Text>
          </View>
          <Text style={[styles.moodText, { color: journalMood.color }]}>
            <Text style={styles.moodLabel}>{journalMood.label}</Text>
          </Text>
        </View>

        {/* Activities */}
        {journalActivities.length > 0 && (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <View style={styles.activitiesContainer}>
            {journalActivities.map(activityId => {
                const activity = activities.find(a => a.id === activityId);
                if (!activity) return null;

                return (
                <View key={activityId} style={styles.activityItem}>
                    <Icon name={activity.icon} size={20} color={journalMood.color} />
                    <Text style={styles.activityLabel}>{activity.label}</Text>
                </View>
                );
            })}
            </View>
        </View>
        )}

        {/* Notes */}
        {journal.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{journal.note}</Text>
            </View>
          </View>
        )}

        {/* Photos/Images */}
        {images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <View style={styles.imageGalleryContainer}>
              <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const newIndex = Math.floor(
                    event.nativeEvent.contentOffset.x / (width - 40)
                  );
                  setCurrentImageIndex(newIndex);
                }}
              />

              {/* Pagination indicators if multiple images */}
              {images.length > 1 && (
                <View style={styles.paginationContainer}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentImageIndex ? styles.activeDot : {},
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* Voice Recording */}
        {journal.recordingPath && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Voice Memo</Text>
            <View style={styles.audioPlayerContainer}>
              <TouchableOpacity
                onPress={handlePlayRecording}
                style={styles.playButton}
              >
                <Icon
                  name={isPlaying ? "pause" : "play"}
                  size={28}
                  color="black"
                />
              </TouchableOpacity>

              <View style={styles.audioProgressContainer}>
                <View style={styles.audioProgressBar}>
                  <View
                    style={[
                      styles.audioProgress,
                      {
                        width: `${
                          (playbackPosition / playbackDuration) * 100 || 0
                        }%`,
                        backgroundColor: '#BDD3CC',
                      },
                    ]}
                  />
                </View>

                <View style={styles.audioTimeContainer}>
                  <Text style={styles.audioTimeText}>
                    {formatTime(playbackPosition)}
                  </Text>
                  <Text style={styles.audioTimeText}>
                    {formatTime(playbackDuration)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalView;