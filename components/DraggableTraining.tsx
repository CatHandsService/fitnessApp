import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const CARD_HEIGHT = 107;

interface DraggableTrainingProps {
  children: React.ReactNode;
  index: number;
  positions: SharedValue<number[]>;
  onReorder: (from: number, to: number) => void;
  itemCount: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DraggableTraining: React.FC<DraggableTrainingProps> = ({
  children,
  index,
  positions,
  onReorder,
  itemCount,
  onDragStart,
  onDragEnd,
}) => {
  const translateY = useSharedValue(0);
  const currentIndex = useSharedValue(index);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
      onDragStart && runOnJS(onDragStart)();
    },
    onActive: (event, context) => {
      translateY.value = context.startY + event.translationY;
      const newIndex = Math.round((translateY.value + currentIndex.value * CARD_HEIGHT) / CARD_HEIGHT);

      if (newIndex >= 0 && newIndex < itemCount && newIndex !== currentIndex.value) {
        runOnJS(onReorder)(currentIndex.value, newIndex);
        currentIndex.value = newIndex;
      }
    },
    onEnd: () => {
      translateY.value = withSpring(0);
      onDragEnd && runOnJS(onDragEnd)();
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const position = positions.value[index];
    return {
      top: position * CARD_HEIGHT,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.draggable, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  draggable: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 4,
  },
});

export default DraggableTraining;