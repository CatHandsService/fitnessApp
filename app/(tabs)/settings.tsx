import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
        <View style={[styles.container, {backgroundColor: theme === 'dark' ? '#000' : '#fff'}]}>
          <View style={styles.darkMode}>
            <Text>Dark mode</Text>
            <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
          </View>
        </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  darkMode: {
    marginBlock: 8,
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});