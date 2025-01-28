import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { Tab, TabComponentProps } from "@/types/types";

const TabComponent = ({
  tabs,
  setTabs,
  activeTab,
  setActiveTab,
}: TabComponentProps) => {
  const [isEditingTab, setIsEditingTab] = useState<string | null>(null);

  const addTab = () => {
    if (tabs.length >= 3) return; // タブの最大数を制限
    const newTab: Tab = {
      id: uuidv4(),
      name: `Tab ${tabs.length + 1}`,
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTab.id); // 新しいタブをアクティブにする
  };

  const deleteTab = (tabId: string) => {
    Alert.alert("Delete Tab", "Are you sure you want to delete this tab?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setTabs((prevTabs) => {
            const updatedTabs = prevTabs.filter((tab) => tab.id !== tabId);
            setActiveTab(updatedTabs[0]?.id);
            return updatedTabs;
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
          onLongPress={() => setIsEditingTab(tab.id)}
          android_ripple={{ color: "#bbdefb" }}
        >
          {isEditingTab === tab.id ? (
            <TextInput
              style={styles.tabInput}
              value={tab.name}
              onChangeText={(text) => {
                setTabs((prevTabs) =>
                  prevTabs.map((t) =>
                    t.id === tab.id ? { ...t, name: text } : t
                  )
                );
              }}
              onBlur={() => setIsEditingTab(null)}
            />
          ) : (
            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.tabText}>{tab.name}</Text>
              <Pressable
                onPress={() => deleteTab(tab.id)}
                android_ripple={{ color: "#ffcdd2" }}
              >
                <Text style={styles.deleteTabText}>×</Text>
              </Pressable>
            </View>
          )}
        </Pressable>
      ))}

      {/* タブが3つ未満の場合に "+" ボタンを表示 */}
      {tabs.length < 3 && (
        <Pressable
          style={styles.addTabButton}
          onPress={addTab}
          android_ripple={{ color: "#81c784" }}
        >
          <Text style={styles.addTabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tab: {
    width: `30%`,
    padding: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 5,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  addTabButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  addTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
  },
  tabInput: {
    width: "90%",
    height: 32,
    paddingInline: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  deleteTabText: {
    color: "white",
    fontSize: 24,
    marginLeft: 5,
  },
});

export default TabComponent;
