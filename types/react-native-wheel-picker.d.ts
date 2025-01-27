declare module 'react-native-wheel-picker' {
  import React from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

export interface ScrollPickerProps {
  dataSource: string[];
  selectedIndex: number;
  itemHeight?: number;
  wrapperHeight?: number;
  renderItem?: (data: any, index: number, isSelected: boolean) => React.ReactNode;
  onValueChange: (data: string, selectedIndex: number) => void;
}

  const ScrollPicker: React.FC<ScrollPickerProps>;
  export { ScrollPicker };
}