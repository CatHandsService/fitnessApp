import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import NumberPicker from './NumberPicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { TrainingComponentProps } from '@/types/types';

const TrainingComponent: React.FC<TrainingComponentProps> = ({
    id,
		type,
    label,
    sets,
    reps,
    interval,
    onUpdate,
    onRemoveItem,
    selectedField,
    onSelectedFieldChange,
    isDragging,
		drag,
	}) => {
    const handleUpdateValue = (field: string, value: number | string) => {
        const mappedField = field === 'name' ? 'label' : field;
        onUpdate(mappedField, value);
    };

    const handleCloseModal = () => {
        onSelectedFieldChange(null);
    };

    return (
			<View style={[styles.container, isDragging && styles.dragging]}>
				<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<TouchableOpacity onLongPress={drag}>
						<MaterialIcons name="swap-vert" size={24} color="gray" />
					</TouchableOpacity>

					<View style={{ marginLeft: 16, marginRight: 8, flex: 1 }}>
						<View style={styles.trainingHeader}>
							<TextInput
								style={styles.input}
								value={type === 'interval' ? 'Interval' : label}
								onChangeText={(value) => handleUpdateValue('name', value)}
								placeholder="Title"
								maxLength={18}
								editable={type !== 'interval'}
							/>

							<TouchableOpacity onPress={() => onRemoveItem()} style={styles.deleteButton}>
								<MaterialIcons name="close" size={24} color="gray" />
							</TouchableOpacity>
						</View>

						<View style={styles.trainingDetails}>
							{type === 'training' &&
								<TouchableOpacity
									onPress={() => onSelectedFieldChange(`${id}-sets`)}
									style={styles.settingWrapper}
								>
									<FontAwesome name="repeat" size={18} color="#444" />
									<NumberPicker
										value={sets}
										onChange={(value) => handleUpdateValue('sets', value)}
										label="Sets"
										min={1}
										max={20}
										step={1}
										onClose={handleCloseModal}
										isVisible={selectedField === `${id}-sets`}
									/>
								</TouchableOpacity>
							}

							{type === 'training' &&
								<TouchableOpacity
									onPress={() => onSelectedFieldChange(`${id}-reps`)}
									style={styles.settingWrapper}
								>
									<FontAwesome6 name="dumbbell" size={18} color="#444" />
									<NumberPicker
										value={reps}
										onChange={(value) => handleUpdateValue('reps', value)}
										label="Reps"
										min={1}
										max={20}
										step={1}
										onClose={handleCloseModal}
										isVisible={selectedField === `${id}-reps`}
									/>
								</TouchableOpacity>
							}

							<TouchableOpacity
								onPress={() => onSelectedFieldChange(`${id}-interval`)}
								style={styles.settingWrapper}
							>
								<Ionicons name="timer-outline" size={20} color="#444" />
								<NumberPicker
									value={interval}
									onChange={(value) => handleUpdateValue('interval', value)}
									label="Interval"
									min={10}
									max={600}
									step={10}
									onClose={handleCloseModal}
									isVisible={selectedField === `${id}-interval`}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
    );
};

export default TrainingComponent;

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		backgroundColor: '#fff',
		padding: 10,
		margin: 10,
		marginBottom: 0
	},
	dragging: {
		transform: [{ scale: .9 }],
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		elevation: 8,
	},
	trainingHeader: {
		marginBottom: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	trainingDetails: {
		marginLeft: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	input: {
		fontSize: 20,
		fontWeight: 'bold',
		// padding: 8,
		width: '80%',
	},
	deleteButton: {
		// width: 40,
		// padding: 8,
	},
	settingWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	}
});