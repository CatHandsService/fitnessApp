import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { CalendarList, DateData } from 'react-native-calendars';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

type TrainingRecord = {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
};

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [calendarHeight, setCalendarHeight] = useState<number>(350); // デフォルト値
  const [trainingRecords] = useState<TrainingRecord[]>([
    {id: "1", date: "2024-01-12", exercise: "ベンチプレス", sets: 3, reps: 10, weight: 60},
    {id: "2", date: "2024-01-12", exercise: "スクワット", sets: 3, reps: 10, weight: 80},
    {id: "3", date: "2024-01-13", exercise: "デッドリフト", sets: 1, reps: 5, weight: 100},
    {id: "4", date: "2024-01-15", exercise: "ショルダープレス", sets: 3, reps: 8, weight: 30},
    {id: "5", date: "2024-01-15", exercise: "アームカール", sets: 3, reps: 12, weight: 20},
  ]);

  const calculateCalendarHeight = useCallback((date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDayOfMonth = getDay(startOfMonth(date));
    const totalDays = daysInMonth + firstDayOfMonth;
    const rows = Math.ceil(totalDays / 7 + 1);

    // カレンダーの1行の高さ（ヘッダー含む）を計算
    const headerHeight = 50; // ヘッダーの高さ
    const rowHeight = 40; // 各行の高さ
    const padding = 24; // 上下のパディング

    return headerHeight + (rows * rowHeight) + padding * 1.5;
  }, []);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
  }, []);

  const handleMonthChange = useCallback((month: DateData) => {
    const newDate = new Date(month.year, month.month - 1, 1);
    setCurrentMonth(newDate);
    setCalendarHeight(calculateCalendarHeight(newDate));
  }, [calculateCalendarHeight]);

  // カレンダーの幅を画面幅から余白を引いて計算
  const calendarWidth = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 32;
    return screenWidth - horizontalPadding;
  }, []);

  const filterTrainingRecords = useCallback(() => {
    if (!selectedDate) return [];
    return trainingRecords.filter((record) => record.date === selectedDate);
  }, [selectedDate, trainingRecords]);

  // アニメーション用の値
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    opacity.value = 0;
    translateY.value = 10;

    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
  }, [selectedDate]);

  // 初期の高さを設定
  useEffect(() => {
    setCalendarHeight(calculateCalendarHeight(currentMonth));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.calendarWrapper}>
        <View
          style={[
            styles.calendarBackground,
            {
              width: calendarWidth,
              height: calendarHeight,
            }
          ]}
        />
        <CalendarList
          style={{height: calendarHeight}}
          horizontal={true}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'aqua' }
          }}
          pagingEnabled
          calendarWidth={calendarWidth}
          pastScrollRange={12}
          futureScrollRange={12}
          scrollEnabled={true}
          showScrollIndicator={false}
          theme={{
            calendarBackground: 'transparent',
            textDayFontSize: 14,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
            selectedDayBackgroundColor: 'aqua',
            selectedDayTextColor: '#fff',
            todayTextColor: 'aqua',
            textSectionTitleColor: '#666',
          }}
        />
      </View>

      <View style={styles.historyContainer}>
        <View style={styles.historyTitle}>
            <View style={styles.historyTitleContainer}>
              <Text style={styles.historyTitleText}>History</Text>
              <Animated.Text style={animatedStyle}>
                {selectedDate ? format(new Date(selectedDate), 'yyyy/MM/dd') : ''}
              </Animated.Text>
            </View>
          </View>

          {filterTrainingRecords().length === 0 ? (
            <View style={styles.historyItem}>
              <Text>There are no training records.</Text>
            </View>
          ) : (
            filterTrainingRecords().map((record) => (
              <View key={record.id} style={styles.historyItem}>
                <Text style={styles.exerciseText}>{record.exercise}</Text>
                <Text style={styles.detailsText}>
                  セット数: {record.sets}, レップ数: {record.reps}, 重量: {record.weight} kg
                </Text>
              </View>
            ))
          )}
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendarWrapper: {
    position: 'relative',
  },
  calendarBackground: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
  }
});