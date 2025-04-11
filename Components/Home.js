import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { format, isToday } from 'date-fns';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MoodContext } from './MoodContext';
import styles from '../Styles/Home';

const Home = ({ navigation }) => {
  const { moodItems, setSelectedMood } = useContext(MoodContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(null);
  
  // State for showing/hiding pickers
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleEditMoods = () => {
    navigation.navigate('Moods'); // this should match the screen name in your navigator
  };

  // Formatted date text that changes based on if it's today or another date
  const getFormattedDateText = () => {
    if (isToday(selectedDate)) {
      return `Today, ${format(selectedDate, 'd MMMM')}`;
    } else {
      return format(selectedDate, 'd MMMM yyyy');
    }
  };

  // Formatted time
  const formattedTime = format(selectedTime, 'HH:mm');

  // Calendar date selection handler
  const onDateChange = (date) => {
    if (date) {
      // Convert Moment object to JavaScript Date
      const jsDate = new Date(date.toString());
      
      // Preserve the time from selectedTime
      jsDate.setHours(selectedTime.getHours());
      jsDate.setMinutes(selectedTime.getMinutes());
      
      setSelectedDate(jsDate);
      setShowCalendar(false);
    }
  };

  // Time picker handlers
  const handleTimeConfirm = (time) => {
    if (time) {
      // Create a new date with the selected date but updated time
      const updatedDateTime = new Date(selectedDate);
      updatedDateTime.setHours(time.getHours());
      updatedDateTime.setMinutes(time.getMinutes());
      
      setSelectedTime(time);
      setSelectedDate(updatedDateTime); // Update the date to maintain consistency
      setShowTimePicker(false);
    }
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  // Handle mood selection
  const handleMoodSelect = (index) => {
    setSelectedMoodIndex(index);
    // Set the selected mood in the context
    setSelectedMood(index);
    // Navigate to Journal page
    navigation.navigate('Journal');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      
      {/* Close button */}
      <TouchableOpacity 
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
      
      {/* Main content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>How are you?</Text>
        
        {/* Date and time selectors */}
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.calendarIcon}>📅</Text>
            <Text style={styles.dateText}>{getFormattedDateText()}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.timeSelector}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.clockIcon}>🕔</Text>
            <Text style={styles.timeText}>{formattedTime}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>
        
        {/* Mood selection */}
        <View style={styles.moodContainer}>
          {moodItems.map((mood, index) => (
            <View key={index} style={styles.moodItemContainer}>
                <TouchableOpacity
                    style={[
                        styles.moodCircle, 
                        { backgroundColor: mood.color },
                        selectedMoodIndex === index && styles.selectedMoodCircle
                    ]}
                    onPress={() => handleMoodSelect(index)}
                    >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                </TouchableOpacity>

              <Text style={styles.moodName}>{mood.name}</Text>
            </View>
          ))}
        </View>
        
        {/* Mood selection button */}
        <TouchableOpacity 
          style={[
            styles.selectMoodButton,
            selectedMoodIndex !== null && styles.moodSelectedButton
          ]}
        >
          <Text style={styles.selectMoodText}>
            {selectedMoodIndex !== null 
              ? `Feeling ${moodItems[selectedMoodIndex].name}`
              : 'Select your mood...'
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Edit moods button */}
      <TouchableOpacity 
        style={styles.editMoodsButton}
        onPress={handleEditMoods}
        >
        <Text style={styles.editIcon}>✏️</Text>
        <Text style={styles.editMoodsText}>Edit Moods</Text>
    </TouchableOpacity>
      
      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <CalendarPicker
              onDateChange={onDateChange}
              selectedStartDate={selectedDate}
              maxDate={new Date()}
              selectedDayColor="#2A2539"
              selectedDayTextColor="#FFFFFF"
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Time Picker */}
      <DateTimePickerModal
        isVisible={showTimePicker}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
        date={selectedTime}
      />
    </SafeAreaView>
  );
};

export default Home;