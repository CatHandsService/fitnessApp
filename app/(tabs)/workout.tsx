import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import TabListScreen from '@/screens/TabListScreen';
import TrainingListScreen from '@/screens/TrainingListScreen';
import { RootStackParamList } from '@/types/navigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

const workout = () => {
  return (
    <Stack.Navigator initialRouteName="TabList">
      <Stack.Screen
        name="TabList"
        component={TabListScreen}
        options={{
          title: 'Select a Tab',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="TrainingList"
        component={TrainingListScreen}
        options={({ route }) => ({
          title: 'Training List',
          tabId: route.params?.tabId,
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default workout;
