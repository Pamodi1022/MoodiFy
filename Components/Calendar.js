import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import {
  format,
  parseISO,
  getDaysInMonth,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import styles from "../Styles/Calendar"; 

const MoodCalendar = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedDayMoods, setSelectedDayMoods] = useState([]);
  const [showMoodList, setShowMoodList] = useState(false);
  const [weeklyMoodStats, setWeeklyMoodStats] = useState({
    rad: 0,
    good: 0,
    meh: 0,
    bad: 0,
    awful: 0,
  });
  const [totalMoods, setTotalMoods] = useState(0);

  const navigateToFavorites = () => {
    navigation.navigate('Favourite');
  };

  // Mood configuration with colors and emojis
  const moodConfig = {
    rad: { color: "#AED6F1", emoji: "😃", name: "Rad" },
    good: { color: "#FAD7A0", emoji: "😊", name: "Good" },
    meh: { color: "#D7BDE2", emoji: "😐", name: "Meh" },
    bad: { color: "#ABEBC6", emoji: "😔", name: "Bad" },
    awful: { color: "#F5B7B1", emoji: "😫", name: "Awful" },
  };

  useEffect(() => {
    loadMoodEntries();
  }, []);

  useEffect(() => {
    calculateWeeklyMoodStats();
  }, [moodEntries, selectedDate]);

  const loadMoodEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem("mood_entries");
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        setMoodEntries(parsedEntries);
        filterMoodsForDate(selectedDate);
        calculateWeeklyMoodStats();
      }
    } catch (error) {
      console.error("Error loading mood entries:", error);
    }
  };

  const calculateWeeklyMoodStats = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });

    const weekEntries = moodEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    const moodCounts = {
      rad: 0,
      good: 0,
      meh: 0,
      bad: 0,
      awful: 0,
    };

    weekEntries.forEach((entry) => {
      const moodType = entry.moodData.name.toLowerCase();
      if (moodCounts.hasOwnProperty(moodType)) {
        moodCounts[moodType]++;
      }
    });

    setWeeklyMoodStats(moodCounts);
    setTotalMoods(weekEntries.length);
  };

  const onDateSelect = (date) => {
    setSelectedDate(date);
    const moods = filterMoodsForDate(date);

    // Show mood list if there are moods for this date
    if (moods.length > 0) {
      setShowMoodList(true);
    }
  };

  const filterMoodsForDate = (date) => {
    const filtered = moodEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
    setSelectedDayMoods(filtered);
    return filtered;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setSelectedMonth(newMonth);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth);
    const startDay = startOfMonth(selectedMonth).getDay();
    const monthName = format(selectedMonth, "MMMM yyyy");

    // Convert Sunday (0) to 6 for our Monday-first calendar
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    // Get days for previous month to fill first row
    const prevMonthDays = [];
    if (adjustedStartDay > 0) {
      const prevMonth = new Date(selectedMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const daysInPrevMonth = getDaysInMonth(prevMonth);

      for (
        let i = daysInPrevMonth - adjustedStartDay + 1;
        i <= daysInPrevMonth;
        i++
      ) {
        prevMonthDays.push({
          day: i,
          month: prevMonth.getMonth(),
          year: prevMonth.getFullYear(),
          isCurrentMonth: false,
        });
      }
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        day: i,
        month: selectedMonth.getMonth(),
        year: selectedMonth.getFullYear(),
        isCurrentMonth: true,
      });
    }

    // Get days for next month to complete the grid
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const daysNeeded = Math.ceil(totalDays / 7) * 7 - totalDays;

    for (let i = 1; i <= daysNeeded; i++) {
      const nextMonth = new Date(selectedMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonthDays.push({
        day: i,
        month: nextMonth.getMonth(),
        year: nextMonth.getFullYear(),
        isCurrentMonth: false,
      });
    }

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    const weeks = [];

    // Create weeks
    for (let i = 0; i < allDays.length; i += 7) {
      weeks.push(allDays.slice(i, i + 7));
    }

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth(-1)}>
            <Icon name="chevron-left" size={30} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthName}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)}>
            <Icon name="chevron-right" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekdaysContainer}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.weekdayText}>
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((dateInfo, dayIndex) => {
              const dateObj = new Date(
                dateInfo.year,
                dateInfo.month,
                dateInfo.day
              );
              const isSelected =
                dateObj.getDate() === selectedDate.getDate() &&
                dateObj.getMonth() === selectedDate.getMonth() &&
                dateObj.getFullYear() === selectedDate.getFullYear();

              const isToday =
                dateObj.getDate() === new Date().getDate() &&
                dateObj.getMonth() === new Date().getMonth() &&
                dateObj.getFullYear() === new Date().getFullYear();

              const dayMoods = moodEntries.filter((entry) => {
                const entryDate = new Date(entry.date);
                return (
                  entryDate.getDate() === dateObj.getDate() &&
                  entryDate.getMonth() === dateObj.getMonth() &&
                  entryDate.getFullYear() === dateObj.getFullYear()
                );
              });

              // Determine if this day has multiple moods with different colors
              const hasMultipleColors =
                dayMoods.length > 0 &&
                dayMoods.some(
                  (mood, idx) =>
                    idx > 0 &&
                    mood.moodData.color !== dayMoods[0].moodData.color
                );

              // Get the dominant mood color for cell background
              const dominantMood =
                dayMoods.length > 0 ? dayMoods[0].moodData : null;
              const cellBackgroundColor =
                dateInfo.isCurrentMonth && dayMoods.length > 0
                  ? `${dominantMood.color}30` // Add transparency to the color
                  : undefined;

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    !dateInfo.isCurrentMonth && styles.nonCurrentMonthDay,
                    isSelected && styles.selectedDay,
                    isToday && styles.todayDay,
                    cellBackgroundColor && {
                      backgroundColor: cellBackgroundColor,
                    },
                  ]}
                  onPress={() => onDateSelect(dateObj)}
                >
                  <View style={styles.dayCellContent}>
                    <Text
                      style={[
                        styles.dayText,
                        !dateInfo.isCurrentMonth &&
                          styles.nonCurrentMonthDayText,
                        isSelected && styles.selectedDayText,
                        isToday && styles.todayText,
                      ]}
                    >
                      {dateInfo.day}
                    </Text>
                    {dayMoods.length > 0 && (
                      <View style={styles.moodContainer}>
                        {hasMultipleColors ? (
                          // If multiple different moods, show colored circles
                          <View style={styles.multiMoodContainer}>
                            {dayMoods.slice(0, 3).map((mood, idx) => (
                              <View
                                key={idx}
                                style={[
                                  styles.moodColorIndicator,
                                  { backgroundColor: mood.moodData.color },
                                ]}
                              />
                            ))}
                          </View>
                        ) : (
                          // If single mood type or same mood multiple times, show emoji
                          <Text style={styles.moodEmoji}>
                            {dominantMood.emoji}
                          </Text>
                        )}
                        {dayMoods.length > 3 && (
                          <View style={styles.moodCountBadge}>
                            <Text style={styles.moodCountBadgeText}>
                              +{dayMoods.length - 3}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const renderMoodModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMoodList}
        onRequestClose={() => setShowMoodList(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {format(selectedDate, "MMMM d, yyyy")}
              </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowMoodList(false)}
              >
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.moodListScrollView}>
              {selectedDayMoods.map((entry, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.moodListItem}
                  onPress={() => {
                    setShowMoodList(false);
                    navigation.navigate("Dashboard", {
                      moodData: entry.moodData,
                      date: entry.date,
                    });
                  }}
                >
                  <View style={styles.moodListItemContent}>
                    <View
                      style={[
                        styles.moodColorCircle,
                        { backgroundColor: entry.moodData.color },
                      ]}
                    >
                      <Text style={styles.moodListEmoji}>
                        {entry.moodData.emoji}
                      </Text>
                    </View>
                    <View style={styles.moodTextContent}>
                      <Text style={styles.moodListName}>
                        {entry.moodData.name}
                      </Text>
                      <Text style={styles.moodListTime}>
                        {format(parseISO(entry.date), "h:mm a")}
                      </Text>
                      {entry.note && (
                        <Text style={styles.moodNote} numberOfLines={2}>
                          {entry.note}
                        </Text>
                      )}
                    </View>
                    <Icon name="chevron-right" size={24} color="#7F7F7F" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.addMoodListButton}
              onPress={() => {
                setShowMoodList(false);
                navigation.navigate("Home", { date: selectedDate });
              }}
            >
              <Icon name="plus" size={24} color="#000" />
              <Text style={styles.addMoodListButtonText}>Add Mood</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMoodGaugeChart = () => {
    const arcLength = 180;
    const startAngle = -180;
    const radius = 120;
    const centerX = 180;
    const centerY = 140;

    // Calculate total entries for the week
    const totalEntries =
      Object.values(weeklyMoodStats).reduce((sum, count) => sum + count, 0) ||
      1;

    // Create segments for each mood type
    const segments = [];
    let currentAngle = startAngle;

    Object.entries(weeklyMoodStats).forEach(([moodType, count]) => {
      if (count === 0) return;

      const proportion = count / totalEntries;
      const sweepAngle = arcLength * proportion;

      const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
      const x2 =
        centerX +
        radius * Math.cos(((currentAngle + sweepAngle) * Math.PI) / 180);
      const y2 =
        centerY +
        radius * Math.sin(((currentAngle + sweepAngle) * Math.PI) / 180);

      const largeArcFlag = sweepAngle > 180 ? 1 : 0;
      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      segments.push({
        path,
        color: moodConfig[moodType].color,
        emoji: moodConfig[moodType].emoji,
        count,
        startAngle: currentAngle,
        endAngle: currentAngle + sweepAngle,
      });

      currentAngle += sweepAngle;
    });

    // Render mood emoji indicators
    const renderMoodEmojis = () => {
      return (
        <View style={styles.moodEmojiContainer}>
          {Object.entries(moodConfig).map(([moodType, config]) => (
            <TouchableOpacity
              key={moodType}
              style={styles.moodEmojiItem}
              onPress={() => {
                // Filter entries for this mood type in the current week
                const filtered = moodEntries.filter((entry) => {
                  const entryDate = new Date(entry.date);
                  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
                  const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
                  return (
                    entry.moodData.name.toLowerCase() === moodType &&
                    entryDate >= start &&
                    entryDate <= end
                  );
                });

                if (filtered.length > 0) {
                  setSelectedDayMoods(filtered);
                  setShowMoodList(true);
                }
              }}
            >
              <View
                style={[styles.emojiCircle, { backgroundColor: config.color }]}
              >
                <View style={styles.emojiCountBadge}>
                  <Text style={styles.emojiCountText}>
                    {weeklyMoodStats[moodType] || 0}
                  </Text>
                </View>
                <Text style={styles.emoji}>{config.emoji}</Text>
              </View>
              <Text style={styles.moodTypeText}>{config.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    return (
      <View style={styles.gaugeChartContainer}>
        <Text style={styles.moodCountTitle}>Weekly Mood Summary</Text>
        <Text style={styles.moodCountSubtitle}>Tap on mood to see entries</Text>

        <View style={styles.gaugeContainer}>
          <Svg width="100%" height="200" viewBox="0 0 360 220">
            {/* Render gauge segments based on actual mood counts */}
            {segments.map((segment, index) => (
              <Path
                key={index}
                d={segment.path}
                fill={segment.color}
                fillOpacity={0.7}
              />
            ))}

            {/* Central circle with total count */}
            <Circle cx={centerX} cy={centerY} r={80} fill="#2A2539" />
            <SvgText
              x={centerX}
              y={centerY - 15}
              fontSize="24"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
            >
              Total
            </SvgText>
            <SvgText
              x={centerX}
              y={centerY + 25}
              fontSize="40"
              fontWeight="bold"
              fill="white"
              textAnchor="middle"
            >
              {totalMoods}
            </SvgText>
            <SvgText
              x={centerX}
              y={centerY + 50}
              fontSize="16"
              fill="#7F7F7F"
              textAnchor="middle"
            >
              {totalMoods === 1 ? "entry" : "entries"}
            </SvgText>
          </Svg>
        </View>

        {renderMoodEmojis()}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#BDD3CC" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood Calendar</Text>
      </View>



      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderCalendar()}

        {/* Add the mood gauge chart here */}
        {renderMoodGaugeChart()}
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Dashboard")}>
          <Icon name="clipboard-text-outline" size={24} color="gray" />
          <Text style={styles.tabText}>Entries</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="chart-line" size={24} color="gray" />
          <Text style={styles.tabText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addEntryButton}
          onPress={() => navigation.navigate("Home", { date: new Date() })}
        >
          <Icon name="plus" size={32} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <Icon name="calendar-month" size={24} color="black" />
          <Text style={styles.tabText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabItem, styles.activeTab]}
          onPress={navigateToFavorites}
        >
          <MaterialIcons name="favorite-border" size={24} color="gray" />
          <Text style={styles.tabText}>Favourites</Text>
        </TouchableOpacity>
      </View>

      {renderMoodModal()}
    </SafeAreaView>
  );
};

export default MoodCalendar;
