// screens/TabListScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Tab } from '@/types/types';
import { RootStackParamList } from '@/types/navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchTabsData } from '@/services/firebaseService';
import TabComponent from '@/components/TabComponent';

type TabListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TabList'>;
};

const TabListScreen: React.FC<TabListScreenProps> = ({ navigation }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const tabsData = await fetchTabsData();
        setTabs(tabsData);
        if (tabsData.length > 0) {
          setActiveTab(tabsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching tabs:', error);
      }
    };
    fetchTabs();
  }, []);

  const handleTabPress = useCallback((tab: Tab) => {
    navigation.navigate('TrainingList', { tabId: tab.id });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TabComponent
        tabs={tabs}
        setTabs={setTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTabPress={handleTabPress}
        id={''}
        title={''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tabButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabListScreen;