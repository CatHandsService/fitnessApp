import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

const TIMER_DURATION = 10;
const CIRCLE_LENGTH = 3000;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer = () => {
  const [time, setTime] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - (progress.value * CIRCLE_LENGTH),
  }));

  useEffect(() => {
    if (isActive && time > 0) {
      // スタート時に即座にプログレスバーを更新
      progress.value = withTiming(1 - (time / TIMER_DURATION), {
        duration: 1000,
        easing: Easing.linear,
      });

      const interval = setInterval(() => {
        setTime((prevTime) => {
          const nextTime = prevTime - 1;
          if (nextTime >= 0) {
            progress.value = withTiming(1 - (nextTime / TIMER_DURATION), {
              duration: 1000,
              easing: Easing.linear,
            });
          }

          if (nextTime <= 0) {
            setIsActive(false);
            // 時計回りのリセットアニメーション
            progress.value = withTiming(2, {
              duration: 1000,
              easing: Easing.linear,
            }, () => {
              progress.value = 0;
            });
            return 0;
          }
          return nextTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, time]);

  const toggleTimer = () => {
    if (!isActive) {
      // スタート時に現在の時間に応じたプログレス値を設定
      progress.value = 1 - (time / TIMER_DURATION);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(TIMER_DURATION);
    // 時計回りのリセットアニメーション
    progress.value = withTiming(2, {
      duration: 1000,
      easing: Easing.linear,
    }, () => {
      progress.value = 0;
    });
  };

  const nextTimer = () => {
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Svg width="250" height="250" viewBox="0 0 1000 1000">
          <Circle cx="500" cy="500" r="450" stroke="#E6E6E6" strokeWidth="80" fill="none" />
          <AnimatedCircle
            cx="500"
            cy="500"
            r="450"
            stroke="#007bff"
            strokeWidth="80"
            fill="none"
            strokeDasharray={CIRCLE_LENGTH}
            strokeLinecap="round"
            animatedProps={animatedProps}
            transform="rotate(-90 500 500)"
          />
        </Svg>
        <Text style={styles.timerText}>{formatTime(time)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetTimer} style={styles.button}>
          <Icon name="rotate-left" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleTimer}
          style={[
            styles.button,
            styles.startButton,
            isActive && styles.activeStartButton
          ]}
        >
          <Icon name={isActive ? "pause" : "play"} size={24} color={isActive ? "#fff" : "#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTimer} style={styles.button}>
          <Icon name="skip-next" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  timerContainer: {
    position: 'relative',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 30,
    marginHorizontal: 10,
  },
  startButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  activeStartButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  }
});

export default Timer;