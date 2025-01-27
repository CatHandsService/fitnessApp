import { useReducer, useCallback, useState } from 'react';
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
import { Tab, WorkoutItem } from '@/types/types';

type Action =
  | { type: 'ADD_ITEM'; payload: WorkoutItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_ITEM'; id: string; field: string; value: string | number }
  | { type: 'REORDER_ITEMS'; items: WorkoutItem[] };

	const initialState: WorkoutItem[] = [
		{ id: uuidv4(), type: 'training', name: '腕立て伏せ', sets: 3, reps: 10, interval: 60, tab: '1' },
		{ id: uuidv4(), type: 'training', name: '腹筋', sets: 3, reps: 15, interval: 30, tab: '1' },
		{ id: uuidv4(), type: 'training', name: 'スクワット', sets: 3, reps: 12, interval: 90, tab: '1' },
	];

function workoutReducer(state: WorkoutItem[], action: Action): WorkoutItem[] {
  switch (action.type) {
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id);
    case 'UPDATE_ITEM':
      return state.map((item) => (item.id === action.id ? { ...item, [action.field]: action.value } : item));
    case 'REORDER_ITEMS':
      return action.items;
    default:
      return state;
  }
}

const WorkoutSetup = () => {
  const [workout, dispatch] = useReducer(workoutReducer, initialState);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
	const [tabs, setTabs] = useState<Tab[]>([
		{ id: '1', name: 'Tab 1' },
		{ id: '2', name: 'Tab 2' },
	]);
	const animatedValue = useSharedValue(0);
	const [selectedField, setSelectedField] = useState<string | null>(null);
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const trainingIconAnimation = useSharedValue(0); // トレーニングアイコンのY座標
	const restIconAnimation = useSharedValue(0); // 休憩アイコンのY座標
	const timerStartIconAnimation = useSharedValue(0); // タイマーアイコンのY座標

	const handleAddTraining = useCallback(() => {
		// 新しいトレーニングアイテムを追加
		const newItem: WorkoutItem = {
				id: uuidv4(),
				type: 'training',
				name: '',
				sets: 3,
				reps: 10,
				interval: 60,
				tab: activeTab,
		};

		// アイテムを追加する
		dispatch({ type: 'ADD_ITEM', payload: newItem });

		// アニメーションでアイコンが収納される
		animatedValue.value = 0;
		animatedValue.value = withTiming(1, { duration: 300 });

		// アイコンメニューを非表示にする
		hideMenu();
}, [ activeTab, dispatch, animatedValue, trainingIconAnimation, restIconAnimation]);

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<WorkoutItem>) => (
      <ScaleDecorator>
        <OpacityDecorator>
          <TouchableOpacity
            disabled={isActive}
            style={styles.dragItem}
          >
            <TrainingComponent
              id={item.id}
              name={item.name}
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

  const filteredWorkout = workout.filter((item) => item.tab === activeTab);
	// 既存のtoggleMenuを変更
	const toggleMenu = () => {
		setIsMenuVisible((prevState) => !prevState);

		if (isMenuVisible) {
				// メニューを閉じる
				trainingIconAnimation.value = withTiming(0, { duration: 300 });
				restIconAnimation.value = withTiming(0, { duration: 300 });
				timerStartIconAnimation.value = withTiming(0, { duration: 300 });
		} else {
				// メニューを開く
				trainingIconAnimation.value = withTiming(-60, { duration: 300 });
				restIconAnimation.value = withTiming(-120, { duration: 300 });
				timerStartIconAnimation.value = withTiming(-190, { duration: 300 });
		}
};

	const handleAddRest = useCallback(() => {
		console.log("Add Rest Item");
		// 休憩用アイテムを追加するロジック
		// 必要に応じて休憩用アイテムをワークアウトに追加するコードを追加

		// アイコンメニューを非表示にする
		hideMenu();
	}, [trainingIconAnimation, restIconAnimation, timerStartIconAnimation]);

	const handleRemoveItem = (id: string) => {
			dispatch({ type: 'REMOVE_ITEM', id });
	};

	const handleUpdateItem = (id: string, field: string, value: string | number) => {
			dispatch({ type: 'UPDATE_ITEM', id, field, value });
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
      <TabComponent
				tabs={tabs}
				setTabs={setTabs}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				id={''}
				name={''}
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
					activationDistance={1}  // ドラッグ開始の感度を上げる
					autoscrollSpeed={50}   // 自動スクロールの速度
					dragHitSlop={{ top: 0, bottom: 0, left: 20, right: 20 }} // ドラッグ可能な領域を広げる
        />
      </View>

			<View
				style={[
					styles.addButton,
					isMenuVisible && { height: 180 }
				]}
			>
				<TouchableOpacity
					style={[
						styles.addButtonWrapper,
						isMenuVisible && { borderTopLeftRadius: 0, borderTopRightRadius: 0 }
					]}
					onPress={toggleMenu}
				>
					{isMenuVisible
						? <ClearIcon style={styles.addButtonIcon}/>
						: <AddIcon style={styles.addButtonIcon}/>
					}
				</TouchableOpacity>
				<Animated.View style={restIconStyle}>
					<TouchableOpacity
						onPress={handleAddRest}
						style={styles.iconButton}
					>
						<AccessTimeIcon style={styles.icon} />
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={trainingIconStyle}>
					<TouchableOpacity
						onPress={handleAddTraining}
						style={styles.iconButton}
					>
						<FitnessCenterIcon style={styles.icon} />
					</TouchableOpacity>
				</Animated.View>
				<Animated.View style={timerStartIconStyle}>
					<TouchableOpacity
						onPress={handleAddTraining}
						style={styles.iconButton}
					>
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
		bottom: 0,  // AddIconと同じ位置
		right: -30,   // AddIconの右側に配置
		backgroundColor: '#007bff',
		borderRadius: 50,
		width: 60,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1, // AddIconより後ろに配置
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
