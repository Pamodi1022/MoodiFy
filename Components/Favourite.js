import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import styles from '../Styles/Favourites'; 
import CustomPopup from '../Components/CustomPopup';

const Favorites = ({ navigation, route }) => {
  const [favoriteJournals, setFavoriteJournals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupConfig, setPopupConfig] = useState({
    title: '',
    message: '',
    buttons: []
  });

  // Helper function to show custom popup
  const showCustomPopup = (title, message, buttons) => {
    setPopupConfig({
      title,
      message,
      buttons: buttons || [{ text: 'OK', onPress: () => setShowPopup(false) }]
    });
    setShowPopup(true);
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
      showCustomPopup(
        'Error', 
        'Failed to load activities',
        [{ text: 'OK', onPress: () => setShowPopup(false) }]
      );
    }
  };

  // Load favorite journals
  const loadFavorites = async () => {
    try {
      setRefreshing(true);
      const storedJournals = await AsyncStorage.getItem('journal_entries');
      const journals = storedJournals ? JSON.parse(storedJournals) : [];
      const favorites = journals.filter(journal => journal.isFavorite);
      setFavoriteJournals(favorites);
      
      // Scroll to new favorite if passed in route params
      if (route.params?.newFavorite) {
        const newFavoriteIndex = favorites.findIndex(
          j => j.id === route.params.newFavorite.id
        );
        if (newFavoriteIndex !== -1) {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: newFavoriteIndex, animated: true });
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      showCustomPopup(
        'Error', 
        'Failed to load favorite journals',
        [{ text: 'OK', onPress: () => setShowPopup(false) }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (journalId) => {
    try {
      // Find journal in favorites
      const journalIndex = favoriteJournals.findIndex(j => j.id === journalId);
      if (journalIndex === -1) return;
      
      // Get all journals
      const storedJournals = await AsyncStorage.getItem('journal_entries');
      let journals = storedJournals ? JSON.parse(storedJournals) : [];
      
      // Find and update the journal
      const updatedJournalIndex = journals.findIndex(j => j.id === journalId);
      if (updatedJournalIndex === -1) return;
      
      const updatedFavoriteStatus = !journals[updatedJournalIndex].isFavorite;
      
      // Update the journal
      journals[updatedJournalIndex] = {
        ...journals[updatedJournalIndex],
        isFavorite: updatedFavoriteStatus
      };
      
      // Save updated journals
      await AsyncStorage.setItem('journal_entries', JSON.stringify(journals));
      
      // Update local state
      const updatedFavorites = favoriteJournals.filter(j => j.id !== journalId);
      setFavoriteJournals(updatedFavorites);
      
      // Close details modal if open
      if (selectedJournal?.id === journalId) {
        setShowDetailsModal(false);
      }
      
      showCustomPopup(
        updatedFavoriteStatus ? 'Added to Favorites' : 'Removed from Favorites',
        updatedFavoriteStatus 
          ? 'This journal has been added to your favorites' 
          : 'This journal has been removed from your favorites',
        [{ text: 'OK', onPress: () => setShowPopup(false) }]
      );
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showCustomPopup(
        'Error', 
        'Failed to update favorite status',
        [{ text: 'OK', onPress: () => setShowPopup(false) }]
      );
    }
  };

  // View journal details
  const viewJournalDetails = (journal) => {
    setSelectedJournal(journal);
    setShowDetailsModal(true);
  };

  // Navigate to Dashboard
  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  // Navigate to Favorites
  const navigateToFavorites = () => {
    navigation.navigate('Favorites');
  };

  // Refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadActivities();
      loadFavorites();
    }, [route.params?.refresh])
  );

  const flatListRef = React.useRef();

  const renderJournalItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.journalCard}
      onPress={() => viewJournalDetails(item)}
    >
      {item.photos?.[0]?.uri ? (
        <Image source={{ uri: item.photos[0].uri }} style={styles.journalImage} />
      ) : item.photo?.uri ? (
        <Image source={{ uri: item.photo.uri }} style={styles.journalImage} />
      ) : (
        <View style={[styles.journalImage, styles.noImage]}>
          <Icons name="image" size={40} color="#ccc" />
        </View>
      )}
      
      <View style={styles.journalContent}>
        <Text style={styles.journalTitle}>
          {format(new Date(item.timestamp || item.date), 'MMM dd, yyyy')}
        </Text>
        <Text style={styles.journalText} numberOfLines={2}>
          {item.note || item.text || 'No description'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.favoriteIconContainer}
        onPress={() => toggleFavorite(item.id)}
      >
        <MaterialIcons 
          name="favorite" 
          size={24} 
          color="#ff6b6b" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Custom Popup */}
      <CustomPopup
        visible={showPopup}
        title={popupConfig.title}
        message={popupConfig.message}
        buttons={popupConfig.buttons}
        onDismiss={() => setShowPopup(false)}
      />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToDashboard} style={styles.backButton}>
          <Icons name="arrow-left" size={25} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorite Journals</Text>
      </View>

      {favoriteJournals.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={favoriteJournals}
          renderItem={renderJournalItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={loadFavorites}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No favorite journals yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the heart icon on journals to add them here
          </Text>
        </View>
      )}

      {/* Journal Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalContainer}>
          {selectedJournal && (
            <View style={styles.detailsContainer}>
              <ScrollView contentContainerStyle={styles.detailsScroll}>
                {/* Header with close button */}
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowDetailsModal(false)}
                  >
                    <Icons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(selectedJournal.id)}
                  >
                    <MaterialIcons
                      name="favorite" 
                      size={24} 
                      color="#ff6b6b" 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Journal Title */}
                <Text style={styles.journalTitle}>
                  {selectedJournal.title || 'Untitled Journal'}
                </Text>
                
                {/* Journal Date */}
                <Text style={styles.detailDate}>
                  {format(new Date(selectedJournal.timestamp || selectedJournal.date), 'EEEE, MMMM dd, yyyy')}
                </Text>
                
                {/* Mood */}
                {selectedJournal.mood && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Mood</Text>
                    <View style={[styles.moodContainer, { backgroundColor: selectedJournal.mood.color || '#55a9f0' }]}>
                      <Text style={styles.moodEmoji}>{selectedJournal.mood.emoji || '😐'}</Text>
                    </View>
                  </View>
                )}
                
                {/* Activities */}
                {selectedJournal.activities && selectedJournal.activities.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Activities</Text>
                    <View style={styles.activitiesContainer}>
                      {selectedJournal.activities.map(activityId => {
                        const activity = activities.find(a => a.id === activityId);
                        if (!activity) return null;
                        
                        return (
                          <View key={activityId} style={styles.activityItem}>
                            <Icons name={activity.icon} size={20} color="#555" />
                            <Text style={styles.activityText}>{activity.label}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
                
                {/* Note */}
                {selectedJournal.note && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.noteText}>{selectedJournal.note}</Text>
                  </View>
                )}
                
                {/* Photos */}
                {(selectedJournal.photos || selectedJournal.photo) && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Photos</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {selectedJournal.photos ? (
                        selectedJournal.photos.map((photo, index) => (
                          <Image 
                            key={index}
                            source={{ uri: photo.uri }}
                            style={styles.detailImage}
                          />
                        ))
                      ) : selectedJournal.photo?.uri ? (
                        <Image 
                          source={{ uri: selectedJournal.photo.uri }}
                          style={styles.detailImage}
                        />
                      ) : selectedJournal.photoBase64 ? (
                        <Image 
                          source={{ uri: `data:image/jpeg;base64,${selectedJournal.photoBase64}` }}
                          style={styles.detailImage}
                        />
                      ) : null}
                    </ScrollView>
                  </View>
                )}
              </ScrollView>        
            </View>
          )}
        </View>
      </Modal>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Icons name="notebook" size={22} color="#666" fontWeight="bold" />
          <Text style={styles.tabText}>Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Chart")}>
          <Icons name="chart-line" size={24} color="gray" />
          <Text style={styles.tabText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addEntryButton}
          onPress={() => navigation.navigate("Home", { date: new Date() })}
        >
          <Icons name="plus" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Calendar")}>
          <Icons name="calendar-month" size={24} color="#666" fontWeight="bold" />
          <Text style={styles.tabText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={navigateToFavorites}
        >
          <MaterialIcons name="favorite-border" size={24} color="black" fontWeight="bold" />
          <Text style={[styles.tabText, { color: 'black' }]}>Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Favorites;