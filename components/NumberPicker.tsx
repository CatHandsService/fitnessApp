import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal } from 'react-native';

interface NumberPickerProps {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	label: string;
	isVisible: boolean;
	onClose: () => void;
}

const NumberPicker: React.FC<NumberPickerProps> = ({ value, onChange, min = 1, max = 20, step = 1, label, isVisible, onClose }) => {
	const scrollY = useRef(new Animated.Value(0)).current;
	const initialScrollPosition = useRef(0);
	const itemHeight = 0;
	const animation = new Animated.Value(0);

	useEffect(() => {
		if (isVisible) {
			Animated.timing(animation, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.timing(animation, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}).start(() => onClose());
		}
	}, [isVisible]);

	const animatedStyle = {
		opacity: animation,
		transform: [
			{
				translateY: animation.interpolate({
					inputRange: [0, 1],
					outputRange: [300, 0],
				}),
			},
		],
	};

	const items = React.useMemo(() => {
		const items = [];
		for (let i = min; i <= max; i += step) {
			items.push(i);
		}
		return items;
	}, [min, max, step]);

	const handleScroll = useCallback(
		Animated.event(
			[{ nativeEvent: { contentOffset: { y: scrollY } } }],
			{ useNativeDriver: false }
		),
		[scrollY],
	);
	useEffect(() => {
		const index = Math.max(0, Math.round((value - min) / step));
		initialScrollPosition.current = itemHeight * index - (120/ 2 - 44 / 2)
	}, [value, itemHeight, min,step]);

	useEffect(() => {
		if (isVisible) {
			scrollY.setValue(initialScrollPosition.current);
		}
	}, [isVisible, initialScrollPosition, scrollY]);

	const handleItemPress = (itemValue: number) => {
		onChange(itemValue);
		onClose();
	};

	const renderItem = (itemValue: number) => {
		const inputRange = items.map((_, index) => itemHeight * index);
		const translateY = scrollY.interpolate({
			inputRange,
			outputRange: items.map(index => {
				const offset = itemHeight * (items.indexOf(itemValue) - index);
				return offset;
			}),
		});
		const isSelected = itemValue === value;
			return (
					<Animated.View style={{ transform: [{ translateY }] }}>
							<TouchableOpacity onPress={() => handleItemPress(itemValue)}>
									<Text style={[styles.item, isSelected && { backgroundColor: 'aqua' }]}>{itemValue}</Text>
							</TouchableOpacity>
					</Animated.View>
			);
	};

	return (
		<View >
			<TouchableOpacity onPress={()=> {}}>
				<Text style={styles.label}>{value}</Text>
			</TouchableOpacity>
			{isVisible && (
				<Modal transparent visible={isVisible} animationType="none">
					<TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
						<Animated.View style={[styles.modalContainer, animatedStyle]}>
							<Text style={styles.pickerLabel}>{label}</Text>
							<ScrollView
								style={styles.drumRollPicker}
								contentContainerStyle={{paddingTop: 0, height: max/step * 44}}
								ref={ref => {
									if (ref) {
										ref.scrollTo({ y: initialScrollPosition.current, animated: false });
									}
								}}
								onScroll={handleScroll}
								scrollEventThrottle={16}
								snapToInterval={itemHeight}
								decelerationRate="fast"
							>
								{items.map(item => renderItem(item))}
							</ScrollView>
						</Animated.View>
					</TouchableOpacity>
				</Modal>
			)}
		</View>
	);
};

export default NumberPicker;



const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        marginBottom: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 16,
        display: 'flex'
    },
    pickerWrapper: {
        height: 120,
        justifyContent: 'center',
    },
    pickerLabel: {
        marginBottom: 10,
        marginInline: 20,
        paddingBlock: 10,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 2,
        fontSize: 24,
        textAlign: 'center',
    },
    drumRollPicker: {
        overflow: 'hidden',
    },
    item: {
        fontSize: 18,
        paddingVertical: 10,
        textAlign: 'center',
        borderRadius: 5
    },
});