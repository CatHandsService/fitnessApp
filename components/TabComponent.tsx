import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Tab, TabComponentProps } from "@/types/types";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const MAX_TABS = 6;

const updateTabsInFirebase = async (tabs: Tab[]) => {
  try {
    const userDocRef = doc(db, 'users', "9IDymBk1BGEWl6Tvpqo6");
    const workoutsRef = collection(userDocRef, 'workouts');

    const workoutDocs = await getDocs(workoutsRef);

    if (workoutDocs.empty) {
      console.error('No workout document found');
      return;
    }

    const workoutDocRef = workoutDocs.docs[0].ref;
    const currentData = workoutDocs.docs[0].data();

    await updateDoc(workoutDocRef, {
      ...currentData,
      tabs: tabs.map(tab => ({
        id: tab.id,
        title: tab.title,
        tasks: currentData.tabs.find((t: any) => t.id === tab.id)?.tasks || []
      }))
    });
  } catch (error) {
    console.error('Error updating tabs:', error);
  }
};

const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  setTabs,
  activeTab,
  setActiveTab,
  onTabPress,
}) => {
  const [isEditingTab, setIsEditingTab] = useState<string | null>(null);

  const addTab = useCallback(() => {
    if (tabs.length >= MAX_TABS) return;

    const newTab: Tab = {
      id: uuidv4(),
      title: `New Tab`,
    };

    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTab(newTab.id);

    updateTabsInFirebase(updatedTabs);
  }, [tabs, setTabs, setActiveTab]);

  const deleteTab = useCallback((tabId: string) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(updatedTabs);
    setActiveTab(updatedTabs[0]?.id);

    updateTabsInFirebase(updatedTabs);
  }, [tabs, setTabs, setActiveTab]);

  const updateTabTitle = useCallback((tabId: string, newTitle: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, title: newTitle } : tab
    );

    setTabs(updatedTabs);

    updateTabsInFirebase(updatedTabs);
  }, [tabs, setTabs]);

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
            isEditingTab === tab.id && styles.activeInput,
          ]}
          onPress={() => {setActiveTab(tab.id); onTabPress(tab)}}
          onLongPress={() => {setIsEditingTab(tab.id); setActiveTab(tab.id);}}
          android_ripple={{ color: "#bbdefb" }}
        >
          {isEditingTab === tab.id ? (
            <View style={{flexDirection: "row", alignItems: "center", flexGrow: 1}}>
              <TextInput
                style={styles.tabInput}
                value={tab.title}
                onChangeText={(text) => updateTabTitle(tab.id, text)}
                onBlur={() => setIsEditingTab(null)}
              />
            </View>
          ) : (
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.tabText}>{tab.title}</Text>
              {activeTab === tab.id &&
                <Pressable
                  onPress={() => deleteTab(tab.id)}
                  android_ripple={{ color: "#ffcdd2" }}
                >
                  <ClearOutlinedIcon sx={{ fontSize: 16 }}/>
                </Pressable>
              }
            </View>
          )}
        </Pressable>
      ))}

      {tabs.length < MAX_TABS && (
        <View style={{ width: "48%", aspectRatio: "1 / 1", justifyContent: "center", alignItems: "center" }}>
          <Pressable
            style={styles.addTabButton}
            onPress={addTab}
            android_ripple={{ color: "#81c784" }}
          >
            <Text style={styles.addTabText}>+</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default TabComponent;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    flexWrap: "wrap",
    marginInline: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    gap: 10,
  },
  tab: {
    maxWidth: "48%",
    width: "48%",
    aspectRatio: "1 / 1",
    padding: 10,
    backgroundColor: "#e0e0e0",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  activeInput: {
    padding: 0,
  },
  addTabButton: {
    width: 40,
    aspectRatio: "1 / 1",
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  addTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabText: {
    width: "100%",
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  tabInput: {
    width: "100%",
    height: 32,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  deleteTabText: {
    color: "#444",
    fontSize: 24,
    marginLeft: 5,
  },
});