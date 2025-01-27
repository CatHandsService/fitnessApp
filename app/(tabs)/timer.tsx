import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { useIsFocused } from '@react-navigation/native';
import { useKeepAwake } from 'expo-keep-awake';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

interface Workout {
    id: string;
    name: string;
    sets: number;
    reps: number;
    interval: number;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    progressContainer: {
       marginBottom: 20,
        position: 'relative',
   },
    progressText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -45 }, { translateY: -15 }],
        fontSize: 30,
        fontWeight: 'bold',
    },
    workoutContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
         marginBottom: 20,
         paddingHorizontal: 10
    },
    workoutItem: {
        fontSize: 16,
        padding: 10,
    },
    currentWorkout: {
       fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
     },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
   button: {
       padding: 20,
        borderRadius: 10,
       backgroundColor: 'aqua',
       alignItems: 'center',
        justifyContent: 'center',
          marginHorizontal: 20
  },
    buttonText: {
       fontSize: 20,
       color: 'white'
    },
     skipButton: {
       padding: 10,
       borderRadius: 10,
      alignItems: 'center',
       justifyContent: 'center',
         marginHorizontal: 10
    },
});

const TimerScreen = () => {
    const [currentWorkout, setCurrentWorkout] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isFocused = useIsFocused();
    const progressValue = useSharedValue(0);
    useKeepAwake(isRunning ? "timer-active" : undefined);

    const workouts:Workout[] = [
         {id: "1", name: '腕立て伏せ', sets: 3, reps: 10, interval: 60 },
         {id: "2", name: '腹筋', sets: 3, reps: 15, interval: 30 },
           {id: "3", name: 'スクワット', sets: 3, reps: 12, interval: 90 },
         {id: "4", name: 'ランジ', sets: 3, reps: 10, interval: 70 },
        {id: "5", name: 'バーピー', sets: 3, reps: 10, interval: 40 },
         ];

    const totalTime = useMemo(() => workouts[currentWorkout]?.interval || 0,[workouts,currentWorkout]);
     useEffect(() => {
       setRemainingTime(totalTime);
      },[totalTime]);


    useEffect(() => {
        if (isFocused) {
            return () => {
               setIsRunning(false);
                 if(intervalRef.current)clearInterval(intervalRef.current);
              }
        }
    }, [isFocused]);


    useEffect(() => {
        if (isRunning) {
             intervalRef.current = setInterval(() => {
                 setRemainingTime((prevTime) => {
                   if (prevTime <= 0) {
                        clearInterval(intervalRef.current as NodeJS.Timeout);
                        setIsRunning(false);
                       if(currentWorkout < workouts.length - 1){
                           setCurrentWorkout((prev) => prev + 1);
                            return totalTime
                       }
                      return 0
                    }
                    progressValue.value = withTiming((prevTime - 0.1) / totalTime, { duration: 100 });
                     return prevTime - 0.1;
                 });
            }, 100);
      } else {
           if (intervalRef.current) clearInterval(intervalRef.current);
         }
       return () => {
           if (intervalRef.current) clearInterval(intervalRef.current);
      }
   }, [isRunning, currentWorkout, workouts, totalTime, progressValue]);

    const handleToggleTimer = useCallback(() => {
        setIsRunning(!isRunning)
    },[isRunning]);

  const handleResetTimer = useCallback(() => {
        setRemainingTime(totalTime);
        setIsRunning(true);
     }, [totalTime, setIsRunning, setRemainingTime])

    const handleSkipTimer = useCallback(() => {
       if(currentWorkout < workouts.length - 1){
            setCurrentWorkout((prev) => prev + 1);
             setRemainingTime(totalTime);
            setIsRunning(true);
         }
   }, [totalTime, setCurrentWorkout,setIsRunning,currentWorkout,workouts.length, setRemainingTime]);


    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
       const minutes = Math.floor((time % 3600) / 60);
       const seconds = (time % 60).toFixed(2);
      return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(5, '0')}s`;
    };
   const animatedProgressStyle = useAnimatedStyle(() => {
         return {
             transform: [{ scale: withTiming(1, { duration: 100 }) }],
          };
      });
   const progressValueAnimated = useMemo(() => remainingTime / totalTime, [remainingTime, totalTime])

    const prevWorkout = useMemo(() => {
        if (currentWorkout > 0) {
           return workouts[currentWorkout - 1]?.name
      } else {
            return null
       }
    }, [workouts, currentWorkout]);

   const nextWorkout = useMemo(() => {
        if (currentWorkout < workouts.length - 1) {
           return workouts[currentWorkout + 1]?.name
      } else {
            return null
      }
    }, [workouts, currentWorkout]);

  return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <Progress.Circle
                     size={200}
                      progress={progressValueAnimated} // ここを修正
                    showsText
                   formatText={() => formatTime(remainingTime)}
                    borderWidth={10}
                    strokeCap="round"
                      color={progressValueAnimated < 0.33 ? 'red' : 'aqua'}
                  textStyle={styles.progressText}
               />
           </View>
           <View style={styles.workoutContainer}>
               <Text style={styles.workoutItem}>{prevWorkout}</Text>
                 <Text style={styles.currentWorkout}>{workouts[currentWorkout]?.name}</Text>
                <Text style={styles.workoutItem}>{nextWorkout}</Text>
          </View>
           <View style={styles.buttonContainer}>
                  <TouchableOpacity  style={styles.skipButton} onPress={handleResetTimer}>
                        <MaterialIcons name="replay" size={30} color="gray"/>
                   </TouchableOpacity>
               <TouchableOpacity style={styles.button} onPress={handleToggleTimer}>
                   <Text style={styles.buttonText}>{isRunning ? '一時停止' : 'スタート'}</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.skipButton} onPress={handleSkipTimer}>
                     <MaterialIcons name="skip-next" size={30} color="gray"/>
                 </TouchableOpacity>
           </View>
      </View>
  );
};
export default TimerScreen;