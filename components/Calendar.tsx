import React from 'react';
import { Calendar as RNCalendar, CalendarProps, DateData } from 'react-native-calendars';

interface CalendarPropsInterface extends CalendarProps {
  onDateSelect: (date: DateData) => void;
}

const Calendar: React.FC<CalendarPropsInterface> = ({ onDateSelect, ...props }) => {
    const [selectedDate, setSelectedDate] = React.useState('');

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
        onDateSelect(day);
    }

  return (
    <RNCalendar
      style={{borderRadius: 5, width: '90vw'}}
      {...props}
      onDayPress={handleDayPress}
      markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
      enableSwipeMonths={true}
      pagingEnabled={true}
    />
  );
};

export default Calendar;