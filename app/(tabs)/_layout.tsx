import { Tabs } from 'expo-router';
import HistoryIcon from '@mui/icons-material/History';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useSharedValue, useDerivedValue } from 'react-native-reanimated';
import { RouteProp, ParamListBase } from '@react-navigation/native';
import { useRef } from 'react';

type TabScreenName = 'index' | 'todo' | 'timer' | 'workout' | 'settings';

export default function TabLayout() {
  const translateX = useSharedValue(0);
  const routeRef = useRef<RouteProp<ParamListBase, TabScreenName>>({ key: 'index', name: "index" });
  const tabIndex = useDerivedValue(() => {
    switch (routeRef.current.name) {
      case 'index':
        return 0;
      case 'timer':
        return 1;
      case 'todo':
        return 5;
      case 'workout':
        return 2;
      case 'settings':
        return 3;
      default:
        return 0;
    }
  });
  return (
      <Tabs
        initialRouteName="index"
        screenOptions={({ route }) => ({
          tabBarStyle: {height: 52},
          tabBarIcon: () => {
            routeRef.current = route as RouteProp<ParamListBase, TabScreenName>;
            switch (route.name) {
              case 'index':
                return <HistoryIcon style={{}} fontSize="medium" color="inherit" />;
              case 'todo':
                return <TimerOutlinedIcon style={{}}  fontSize="medium" color="inherit" />;
              case 'timer':
                return <TimerOutlinedIcon style={{}}  fontSize="medium" color="inherit" />;
              case 'workout':
                return <FitnessCenterIcon style={{}}  fontSize="medium" color="inherit" />;
              case 'settings':
                return <SettingsOutlinedIcon style={{}}  fontSize="medium" color="inherit" />;
              default:
                return null;
            }
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'History' }} />
        <Tabs.Screen name="todo" options={{ title: 'todo' }} />
        <Tabs.Screen name="timer" options={{ title: 'Timer' }} />
        <Tabs.Screen name="workout" options={{ title: 'Setup' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      </Tabs>
  );
}