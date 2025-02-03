import { useReducer, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
  OpacityDecorator,
} from 'react-native-draggable-flatlist';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TrainingModal from '../../components/TrainingModal';
import TrainingComponent from '../../components/TrainingComponent';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import TabComponent from '@/components/TabComponent';
import { Tab, WorkoutData, WorkoutItem } from '@/types/types';
import mockData from '../../data/mockTabs.json';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

const col = 'users';
const document = '9IDymBk1BGEWl6Tvpqo6';
const subCol = 'workouts';

type Action =
  | { type: 'ADD_ITEM'; payload: WorkoutItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_ITEM'; id: string; field: string; value: string | number }
  | { type: 'REORDER_ITEMS'; items: WorkoutItem[] };

const updateWorkoutItemInFirebase = async (workoutItem: WorkoutItem) => {
	try {
		const userDocRef = doc(db, col, document);
		const workoutsRef = collection(userDocRef, subCol);

		// Fetch the current workout document
		const workoutDocs = await getDocs(workoutsRef);

		if (workoutDocs.empty) {
			console.error('No workout document found');
			return;
		}

		// Assuming first document is the active workout
		const workoutDocRef = workoutDocs.docs[0].ref;

		// Get current document data
		const currentData = workoutDocs.docs[0].data();

		// Update the specific task in the tabs array
		const updatedTabs = currentData.tabs.map((tab: any) => {
			if (tab.id === workoutItem.activeTabId) {
				const updatedTasks = tab.tasks.map((task: any) =>
					task.id === workoutItem.id ? { ...task, ...workoutItem } : task
				);
				return { ...tab, tasks: updatedTasks };
			}
			return tab;
		});

		// Update the entire document with modified tabs
		await updateDoc(workoutDocRef, { tabs: updatedTabs });
	} catch (error) {
		console.error('Error updating workout item:', error);
	}
};

const deleteWorkoutItemFromFirebase = async (workoutItem: WorkoutItem) => {
	try {
		const userDocRef = doc(db, col, document);
		const workoutsRef = collection(userDocRef, subCol);

		// Fetch the current workout document
		const workoutDocs = await getDocs(workoutsRef);

		if (workoutDocs.empty) {
			console.error('No workout document found');
			return;
		}

		// Assuming first document is the active workout
		const workoutDocRef = workoutDocs.docs[0].ref;

		// Get current document data
		const currentData = workoutDocs.docs[0].data();

		// Remove the specific task from the tabs array
		const updatedTabs = currentData.tabs.map((tab: any) => {
			if (tab.id === workoutItem.activeTabId) {
				const filteredTasks = tab.tasks.filter((task: any) => task.id !== workoutItem.id);
				return { ...tab, tasks: filteredTasks };
			}
			return tab;
		});

		// Update the entire document with modified tabs
		await updateDoc(workoutDocRef, { tabs: updatedTabs });
	} catch (error) {
		console.error('Error deleting workout item:', error);
	}
};

function workoutReducer(state: WorkoutItem[], action: Action): WorkoutItem[] {
  switch (action.type) {
    case 'ADD_ITEM':
      // Trigger Firebase update for new item
      updateWorkoutItemInFirebase(action.payload);
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      // Find the item to delete
      const itemToDelete = state.find(item => item.id === action.id);
      if (itemToDelete) {
        deleteWorkoutItemFromFirebase(itemToDelete);
      }
      return state.filter((item) => item.id !== action.id);
    case 'UPDATE_ITEM':
      // Find the current item and create updated version
      const updatedState = state.map((item) =>
        item.id === action.id
          ? { ...item, [action.field]: action.value }
          : item
      );

      // Find the updated item to sync with Firebase
      const updatedItem = updatedState.find(item => item.id === action.id);
      if (updatedItem) {
        updateWorkoutItemInFirebase(updatedItem);
      }

      return updatedState;
    case 'REORDER_ITEMS':
      // For reordering, update the entire tabs structure in Firebase
      return action.items;
    default:
      return state;
  }
}

const WorkoutSetup = () => {
	const [tabs, setTabs] = useState<Tab[]>(mockData.tabs.map(tab => ({
		id: tab.id,
		title: tab.title
	})));

  const [activeTab, setActiveTab] = useState<string>(mockData.tabs[0].id);

	const [workout, dispatch] = useReducer(workoutReducer, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const animatedValue = useSharedValue(0);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const trainingIconAnimation = useSharedValue(0);
  const restIconAnimation = useSharedValue(0);
  const timerStartIconAnimation = useSharedValue(0);

	useEffect(() => {
		const fetchWorkoutData = async () => {

			try {
				const workoutsRef = collection(db, col, document, subCol);
				const querySnapshot = await getDocs(workoutsRef);
				const fetchedData = querySnapshot.docs.reduce((acc, doc) => {
					const data = doc.data();
					if (!data || !data.tabs) {
						return acc;
					};

					const tabs = data.tabs.map((tab: any) => ({
						id: tab.id,
						title: tab.title
					}));

					const workoutItems = data.tabs.flatMap((tab: any) =>
						tab.tasks.map((task: any) => ({
							id: task.id,
							type: task.type,
							label: task.label,
							sets: task.sets,
							reps: task.reps,
							interval: task.interval,
							activeTabId: tab.id
						} as WorkoutItem))
					);

					if (JSON.stringify(tabs) !== JSON.stringify(acc.tabs)) {
						acc.tabs = tabs;
					}

					acc.workoutItems = [...acc.workoutItems, ...workoutItems];

					return acc;
				}, { tabs: [], workoutItems: [] } as { tabs: Tab[], workoutItems: WorkoutItem[] });

				setTabs(fetchedData.tabs);

				if (fetchedData.tabs.length > 0 && activeTab === '') {
					setActiveTab(fetchedData.tabs[0].id);
				}

				dispatch({ type: 'REORDER_ITEMS', items: fetchedData.workoutItems });
			} catch (error) {
				console.error('Error fetching workout data:', error);
			}
		};

		fetchWorkoutData();
	}, []);

  const handleAddTraining = useCallback(() => {
    const newItem: WorkoutItem = {
      id: uuidv4(),
      type: 'training',
      label: '',
      sets: 3,
      reps: 10,
      interval: 60,
      activeTabId: activeTab,
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    animatedValue.value = withTiming(1, { duration: 300 });
    hideMenu();
  }, [activeTab, dispatch, animatedValue]);

  const filteredWorkout = workout.filter(item => item.activeTabId === activeTab);

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
              onUpdate={(field, value) => dispatch({ type: 'UPDATE_ITEM', id: item.id, field, value })}
              onRemoveItem={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
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

  const handleDragEnd = ({ data }: { data: WorkoutItem[] }) => {
    dispatch({ type: 'REORDER_ITEMS', items: data });
  };

  const handleAddInterval = useCallback(() => {
    const newItem: WorkoutItem = {
      id: uuidv4(),
      type: 'interval',
      label: 'Interval',
      sets: 1,
      reps: 1,
      interval: 60,
      activeTabId: activeTab,
    };

    dispatch({ type: 'ADD_ITEM', payload: newItem });
    animatedValue.value = withTiming(1, { duration: 300 });
    hideMenu();
  }, [activeTab, dispatch, animatedValue]);

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
    <TouchableWithoutFeedback onPress={hideMenu}>
      <View style={styles.container}>
        <TabComponent
          tabs={tabs}
          setTabs={setTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          id={''}
          title={''}
        />

        <View style={styles.listContainer}>
          <DraggableFlatList
            data={filteredWorkout}
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
            {isMenuVisible ? <ClearIcon style={styles.addButtonIcon}/> : <AddIcon style={styles.addButtonIcon}/>}
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

        <TrainingModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAddTraining={handleAddTraining}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});

export default WorkoutSetup;