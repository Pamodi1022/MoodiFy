import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome1 from './Welcome1';
import Welcome2 from './Welcome2';
import Welcome3 from './Welcome3';
import Home from './Home';
import Moods from './Moods';
import Journal from './Journal';
import Dashboard from './Dashboard';
import JournalEdit from './JournalEdit';
import Favourite from './Favourite';
import JournalView from './JournalView';
import Calendar from './Calendar';
import Chart from './Chart';
import CustomPopup from './CustomPopup';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome1" component={Welcome1} />
        <Stack.Screen name="Welcome2" component={Welcome2} />
        <Stack.Screen name="Welcome3" component={Welcome3} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Moods" component={Moods} />
        <Stack.Screen name="Journal" component={Journal} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="JournalEdit" component={JournalEdit} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="JournalView" component={JournalView} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="Chart" component={Chart} />
        <Stack.Screen name="CustomPopup" component={CustomPopup} />
      </Stack.Navigator>
  );
}
