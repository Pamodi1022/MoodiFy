import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, addWeeks, subWeeks } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../Styles/Chart'; 

const MoodLineChart = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const MOOD_DATA = {
    'awful': { value: 1, color: '#F25749', icon: 'emoticon-sad-outline' },
    'bad': { value: 2, color: '#F98E3C', icon: 'emoticon-confused-outline' },
    'meh': { value: 3, color: '#4A9DE7', icon: 'emoticon-neutral-outline' },
    'good': { value: 4, color: '#9ACD32', icon: 'emoticon-happy-outline' },
    'rad': { value: 5, color: '#1AB19B', icon: 'emoticon-excited-outline' }
  };

  useEffect(() => {
    loadMoodEntries();
  }, [selectedWeek]);

  const loadMoodEntries = async () => {
    setIsLoading(true);
    try {
      const entries = await AsyncStorage.getItem('mood_entries');
      if (entries) {
        const parsedEntries = JSON.parse(entries);
        const sortedEntries = parsedEntries.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
        setMoodEntries(sortedEntries);
        processChartData(sortedEntries);
      } else {
        setupEmptyChart();
      }
    } catch (error) {
      // console.error('Error loading mood entries:', error);
      setupEmptyChart();
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const processChartData = (entries) => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    const weekEntries = entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });
    
    const entriesByDay = {};
    daysInWeek.forEach(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      entriesByDay[dayStr] = [];
    });
    
    weekEntries.forEach(entry => {
      const entryDate = parseISO(entry.date);
      const dayStr = format(entryDate, 'yyyy-MM-dd');
      if (entriesByDay[dayStr]) {
        entriesByDay[dayStr].push(entry);
      }
    });
    
    const labels = [];
    const datasets = [];
    const moodColors = [];
    const tooltipLabels = [];
    
    Object.keys(entriesByDay).sort().forEach(dayStr => {
      const dayEntries = entriesByDay[dayStr];
      const dayLabel = format(parseISO(dayStr), 'EEE'); // Short day name (Mon, Tue, etc.)
      labels.push(dayLabel);
      
      if (dayEntries.length > 0) {
        let moodSum = 0;
        let dominantMood = '';
        let moodCounts = {};
        
        dayEntries.forEach(entry => {
          const moodName = entry.moodData.name.toLowerCase();
          moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
          moodSum += MOOD_DATA[moodName]?.value || 3;
        });
        
        let maxCount = 0;
        Object.entries(moodCounts).forEach(([mood, count]) => {
          if (count > maxCount) {
            maxCount = count;
            dominantMood = mood;
          }
        });
        
        const avgMoodValue = moodSum / dayEntries.length;
        datasets.push(avgMoodValue);
        moodColors.push(MOOD_DATA[dominantMood]?.color || '#4A9DE7');
        tooltipLabels.push(`${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}`);
      } else {
        datasets.push(null);
        moodColors.push(null);
        tooltipLabels.push('No entries');
      }
    });
    
    setChartData({
      labels,
      datasets: [{
        data: datasets,
        colors: moodColors,
        tooltipLabels: tooltipLabels,
        strokeWidth: 2
      }],
      legend: ['Mood']
    });
  };

  const setupEmptyChart = () => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const labels = daysInWeek.map(day => format(day, 'EEE')); // Short day names
    const emptyData = labels.map(() => null);
    
    setChartData({
      labels,
      datasets: [{
        data: emptyData.length > 0 ? emptyData : [0],
        color: () => 'rgba(0, 191, 165, 0.5)',
        strokeWidth: 2
      }],
      legend: ['Mood']
    });
  };

  const changeWeek = (direction) => {
    setSelectedWeek(prevWeek => direction === 1 ? addWeeks(prevWeek, 1) : subWeeks(prevWeek, 1));
  };

  const renderCurrentWeekStats = () => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    const weekEntries = moodEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });
    
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>This Week</Text>
        <Text style={styles.statsValue}>{weekEntries.length} mood entries</Text>
      </View>
    );
  };

  const getWeekRangeText = () => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`;
  };

  if (isLoading && isInitialLoad) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={styles.loadingText}>Loading your mood data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Mood Chart</Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.weekSelector}>
          <TouchableOpacity 
            style={styles.weekNavButton} 
            onPress={() => changeWeek(-1)}
          >
            <Icon name="chevron-left" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.weekText}>{getWeekRangeText()}</Text>
          <TouchableOpacity 
            style={styles.weekNavButton} 
            onPress={() => changeWeek(1)}
          >
            <Icon name="chevron-right" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        {renderCurrentWeekStats()}

        <View style={styles.legendContainer}>
          {Object.entries(MOOD_DATA).map(([mood, data]) => (
            <View key={mood} style={styles.legendItem}>
              <Icon name={data.icon} size={18} color={data.color} />
              <Text style={styles.legendText}>{mood}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.chartLoadingContainer}>
            <ActivityIndicator size="small" color="#00BFA5" />
            <Text style={styles.chartLoadingText}>Updating chart...</Text>
          </View>
        ) : chartData && chartData.datasets[0].data.some(value => value !== null) ? (
          <View style={styles.chartWrapper}>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#262626',
                backgroundGradientFrom: '#262626',
                backgroundGradientTo: '#262626',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { 
                  r: '5', 
                  strokeWidth: '2', 
                  stroke: '#262626' 
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(255, 255, 255, 0.1)'
                },
                propsForLabels: { fontSize: 12 },
              }}
              bezier
              style={styles.chart}
              getDotColor={(dataPoint, index) => {
                return chartData.datasets[0].colors[index] || '#4A9DE7';
              }}
              fromZero={false}
              segments={4}
            />
          </View>
        ) : (
          <View style={styles.emptyChartContainer}>
            <Icon name="emoticon-outline" size={50} color="#7F7F7F" />
            <Text style={styles.emptyChartText}>No mood entries this week</Text>
          </View>
        )}

        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Weekly Insights</Text>
          <MoodInsights moodEntries={moodEntries} selectedWeek={selectedWeek} moodData={MOOD_DATA} />
        </View>

        <TouchableOpacity 
          style={styles.addMoodButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="plus" size={24} color="#000" />
          <Text style={styles.addMoodButtonText}>Add New Mood</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Updated MoodInsights component for weekly data
const MoodInsights = ({ moodEntries, selectedWeek, moodData }) => {
  const [insights, setInsights] = useState({
    dominantMood: '',
    dominantMoodColor: '#7F7F7F',
    dominantMoodIcon: 'emoticon-outline',
    totalEntries: 0,
    highestDay: '',
    lowestDay: '',
    moodCounts: {}
  });

  useEffect(() => {
    calculateInsights();
  }, [moodEntries, selectedWeek]);

  const calculateInsights = () => {
    const weekStart = startOfWeek(selectedWeek);
    const weekEnd = endOfWeek(selectedWeek);
    
    const weekEntries = moodEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
    });
    
    if (weekEntries.length === 0) {
      setInsights({
        dominantMood: 'No data',
        dominantMoodColor: '#7F7F7F',
        dominantMoodIcon: 'emoticon-neutral-outline',
        totalEntries: 0,
        highestDay: 'N/A',
        lowestDay: 'N/A',
        moodCounts: {}
      });
      return;
    }
    
    const moodCounts = {};
    weekEntries.forEach(entry => {
      const mood = entry.moodData.name.toLowerCase();
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    let dominantMood = '';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = mood;
      }
    });
    
    const entriesByDay = {};
    weekEntries.forEach(entry => {
      const dayStr = format(parseISO(entry.date), 'yyyy-MM-dd');
      if (!entriesByDay[dayStr]) {
        entriesByDay[dayStr] = [];
      }
      entriesByDay[dayStr].push(entry);
    });
    
    const dayMoodAverages = {};
    Object.entries(entriesByDay).forEach(([dayStr, entries]) => {
      const totalMoodValue = entries.reduce((sum, entry) => {
        const mood = entry.moodData.name.toLowerCase();
        return sum + (moodData[mood]?.value || 3);
      }, 0);
      
      dayMoodAverages[dayStr] = totalMoodValue / entries.length;
    });
    
    let highestDay = '';
    let lowestDay = '';
    let highestValue = -Infinity;
    let lowestValue = Infinity;
    
    Object.entries(dayMoodAverages).forEach(([day, value]) => {
      if (value > highestValue) {
        highestValue = value;
        highestDay = day;
      }
      if (value < lowestValue) {
        lowestValue = value;
        lowestDay = day;
      }
    });
    
    const dominantMoodColor = moodData[dominantMood]?.color || '#7F7F7F';
    const dominantMoodIcon = moodData[dominantMood]?.icon || 'emoticon-outline';
    
    setInsights({
      dominantMood: dominantMood.charAt(0).toUpperCase() + dominantMood.slice(1),
      dominantMoodColor,
      dominantMoodIcon,
      totalEntries: weekEntries.length,
      highestDay: highestDay ? format(parseISO(highestDay), 'EEE') : 'N/A',
      lowestDay: lowestDay ? format(parseISO(lowestDay), 'EEE') : 'N/A',
      moodCounts
    });
  };

  const renderMoodDistribution = () => {
    const { moodCounts } = insights;
    const totalEntries = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    
    if (totalEntries === 0) return null;
    
    return (
      <View style={styles.moodDistribution}>
        <Text style={styles.distributionTitle}>Mood Distribution</Text>
        <View style={styles.distributionBar}>
          {Object.entries(moodData).map(([mood, data]) => {
            const count = moodCounts[mood] || 0;
            const percentage = (count / totalEntries) * 100;
            
            if (percentage === 0) return null;
            
            return (
              <View 
                key={mood}
                style={[
                  styles.distributionSegment,
                  { 
                    backgroundColor: data.color,
                    width: `${percentage}%`,
                  }
                ]}
              />
            );
          })}
        </View>
        <View style={styles.distributionLabels}>
          {Object.entries(moodData).map(([mood, data]) => {
            const count = moodCounts[mood] || 0;
            const percentage = (count / totalEntries) * 100;
            
            if (percentage === 0) return null;
            
            return (
              <View key={mood} style={styles.distributionLabel}>
                <Icon name={data.icon} size={14} color={data.color} />
                <Text style={styles.labelText}>{Math.round(percentage)}%</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.insightsList}>
      <View style={styles.insightItem}>
        <Icon name={insights.dominantMoodIcon} size={24} color={insights.dominantMoodColor} />
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightLabel}>Dominant Mood</Text>
          <Text style={[styles.insightValue, { color: insights.dominantMoodColor }]}>
            {insights.dominantMood}
          </Text>
        </View>
      </View>
      
      <View style={styles.insightItem}>
        <Icon name="calendar-check" size={24} color="#00BFA5" />
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightLabel}>Total Entries</Text>
          <Text style={styles.insightValue}>{insights.totalEntries}</Text>
        </View>
      </View>
      
      <View style={styles.insightItem}>
        <Icon name="arrow-up-circle" size={24} color="#9ACD32" />
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightLabel}>Best Day</Text>
          <Text style={styles.insightValue}>{insights.highestDay}</Text>
        </View>
      </View>
      
      <View style={styles.insightItem}>
        <Icon name="arrow-down-circle" size={24} color="#F25749" />
        <View style={styles.insightTextContainer}>
          <Text style={styles.insightLabel}>Challenging Day</Text>
          <Text style={styles.insightValue}>{insights.lowestDay}</Text>
        </View>
      </View>
      {insights.totalEntries > 0 && renderMoodDistribution()}
    </View>
  );
};

export default MoodLineChart;