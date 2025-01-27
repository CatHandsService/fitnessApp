import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import HistoryScreen from '../screens/HistoryScreen';
import TimerScreen from '../screens/TimerScreen';
import WorkoutSetupScreen from '../screens/WorkoutSetupScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'History') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'Timer') {
            iconName = focused ? 'timer' : 'timer';
          } else if (route.name === 'Workout Setup') {
            iconName = focused ? 'fitness-center' : 'fitness-center';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      })}
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Timer" component={TimerScreen} />
      <Tab.Screen name="Workout Setup" component={WorkoutSetupScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;