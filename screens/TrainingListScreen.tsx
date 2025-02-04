// TrainingListScreen.tsx
import React, { useState, useCallback, useReducer, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WorkoutItem } from '@/types/types';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
  OpacityDecorator,
} from 'react-native-draggable-flatlist';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TrainingComponent from '@/components/TrainingComponent';
import { Action, workoutReducer } from '@/reducers/workoutReducer';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigationTypes';
import { fetchWorkoutData } from '@/services/firebaseService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type TrainingListScreenRouteProp = RouteProp<RootStackParamList, 'TrainingList'>;

interface TrainingListScreenProps {
  route: TrainingListScreenRouteProp;
}

const TrainingListScreen: React.FC<TrainingListScreenProps> = ({ route }) => {
  const { tabId } = route.params || {};
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [workout, dispatch] = useReducer(workoutReducer, []);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const animatedValue = useSharedValue(0);
  const trainingIconAnimation = useSharedValue(0);
  const restIconAnimation = useSharedValue(0);
  const timerStartIconAnimation = useSharedValue(0);
  const dragRef = useRef(null);
  const navigation = useNavigation();

	const goBack = () => {
    console.log(navigation)
		navigation.goBack();
	};

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        if (!tabId) {
          console.error("Tab ID is not defined");
          return;
        }
        const workoutItems = await fetchWorkoutData(tabId);
        dispatch({ type: 'REORDER_ITEMS', items: workoutItems });
      } catch (error) {
        console.error('Error fetching workout data:', error);
      }
    };
    fetchWorkout();
  }, [tabId, dispatch]);

  // Function to add new workout item
  const handleAddTraining = useCallback(() => {
    if (!tabId) {
      console.error("Tab ID is not defined");
      return;
    }

    const newItem: WorkoutItem = {
      id: uuidv4(),
      type: 'training',
      label: '',
      sets: 3,
      reps: 10,
      interval: 60,
      activeTabId: tabId as string,
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    animatedValue.value = withTiming(1, { duration: 300 });
    hideMenu();
  }, [tabId, dispatch, animatedValue]);

  // Function to add new interval item
  const handleAddInterval = useCallback(() => {
    const newItem: WorkoutItem = {
      id: uuidv4(),
      type: 'interval',
      label: 'Interval',
      sets: 1,
      reps: 1,
      interval: 60,
      activeTabId: tabId as string,
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    animatedValue.value = withTiming(1, { duration: 300 });
    hideMenu();
  }, [tabId, dispatch, animatedValue]);

  // Function to handle item removal
  const handleRemoveItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  }, [dispatch]);

  // Function to handle item updates
  const handleUpdateItem = useCallback((id: string, field: string, value: string | number) => {
    dispatch({ type: 'UPDATE_ITEM', id, field, value });
  }, [dispatch]);

  // Function to handle item reordering
  const handleDragEnd = useCallback(({ data }: { data: WorkoutItem[] }) => {
    dispatch({ type: 'REORDER_ITEMS', items: data });
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<WorkoutItem>) => (
      <ScaleDecorator>
        <OpacityDecorator>
          <TouchableOpacity
            disabled={isActive}
            style={styles.dragItem}
          >
            <TrainingComponent
              id={item.id}
              type={item.type}
              label={item.label}
              sets={item.sets}
              reps={item.reps}
              interval={item.interval}
              onUpdate={(field, value) => handleUpdateItem(item.id, field, value)}
              onRemoveItem={() => handleRemoveItem(item.id)}
              isDragging={isActive}
              selectedField={selectedField}
              onSelectedFieldChange={(field) => setSelectedField(field)}
              drag={drag}
            />
          </TouchableOpacity>
        </OpacityDecorator>
      </ScaleDecorator>
    ),
    [dispatch, selectedField]
  );

  const toggleMenu = () => {
    setIsMenuVisible((prevState) => !prevState);

    if (isMenuVisible) {
      trainingIconAnimation.value = withTiming(0, { duration: 300 });
      restIconAnimation.value = withTiming(0, { duration: 300 });
      timerStartIconAnimation.value = withTiming(0, { duration: 300 });
    } else {
      trainingIconAnimation.value = withTiming(-60, { duration: 300 });
      restIconAnimation.value = withTiming(-120, { duration: 300 });
      timerStartIconAnimation.value = withTiming(-190, { duration: 300 });
    }
  };

  const hideMenu = () => {
    setIsMenuVisible(false);
    trainingIconAnimation.value = withTiming(0, { duration: 300 });
    restIconAnimation.value = withTiming(0, { duration: 300 });
    timerStartIconAnimation.value = withTiming(0, { duration: 300 });
  };

  const trainingIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: trainingIconAnimation.value }],
  }));

  const restIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: restIconAnimation.value }],
  }));

  const timerStartIconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: timerStartIconAnimation.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tabId}</Text>
			</View>

      <View style={styles.backButtonContainer}>
				<TouchableOpacity onPress={goBack} style={styles.backButton}>
					<ArrowBackIcon style={styles.backButtonIcon} />
				</TouchableOpacity>
			</View>
      {tabId ? (
        <>
          <View style={styles.listContainer}>
            <DraggableFlatList
              data={workout}
              ref={dragRef}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              onDragEnd={handleDragEnd}
              containerStyle={styles.dragList}
              ListFooterComponent={<View style={styles.listFooter} />}
              dragItemOverflow={true}
              activationDistance={1}
              autoscrollSpeed={50}
              dragHitSlop={{ top: 0, bottom: 0, left: 20, right: 20 }}
            />
          </View>
          <View style={[styles.addButton, isMenuVisible && { height: 180 }]}>
            <TouchableOpacity
              style={[styles.addButtonWrapper, isMenuVisible && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}
              onPress={toggleMenu}
            >
              {isMenuVisible ? <ClearIcon style={styles.addButtonIcon} /> : <AddIcon style={styles.addButtonIcon} />}
            </TouchableOpacity>
            <Animated.View style={restIconStyle}>
              <TouchableOpacity onPress={handleAddInterval} style={styles.iconButton}>
                <AccessTimeIcon style={styles.icon} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={trainingIconStyle}>
              <TouchableOpacity onPress={handleAddTraining} style={styles.iconButton}>
                <FitnessCenterIcon style={styles.icon} />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={timerStartIconStyle}>
              <TouchableOpacity onPress={handleAddTraining} style={styles.iconButton}>
                <TimerOutlinedIcon style={styles.icon} />
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      ) : (
        <Text>No tab selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
		alignItems: 'center',
    justifyContent: 'center',
		paddingHorizontal: 10,
		backgroundColor: '#f0f0f0',
	},
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButtonContainer: {
		flexDirection: 'row',
    justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		width: 60,
		height: 60,
		backgroundColor: '#007bff',
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    position: 'absolute',
    bottom: 20,
    left: 20,
    zIndex: 100
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	backButtonIcon: {
		fontSize: 30,
		color: '#fff',
	},

  listContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  dragList: {
    flex: 1,
  },
  dragItem: {
    width: '100%',
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 3,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    position: 'absolute',
    bottom: 20,
    right: 20,
    color: '#fff',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    transitionDuration: '.1s',
    zIndex: 100
  },
  addButtonWrapper: {
    position: 'relative',
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 50,
    zIndex: 5,
  },
  addButtonIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    fontSize: 30,
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: -30,
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  icon: {
    color: '#fff',
  },
  listFooter: {
    height: 107,
  },
});

export default TrainingListScreen;