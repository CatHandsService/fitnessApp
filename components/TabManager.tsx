import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

const TabManager = () => {
    const [tabs, setTabs] = useState([{ id: uuidv4(), name: 'Tab 1' }]);

    // 新しいタブを追加
    const handleAddTab = () => {
        const newTab = { id: uuidv4(), name: `Tab ${tabs.length + 1}` };
        setTabs((prevTabs) => [...prevTabs, newTab]);
    };

    // タブを削除
    const handleRemoveTab = (id: string) => {
        setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tabScroll}>
                {tabs.map((tab) => (
                    <View key={tab.id} style={styles.tab}>
                        <Text style={styles.tabText}>{tab.name}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => handleRemoveTab(tab.id)}
                        >
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                {/* 新しいタブを追加する + ボタン */}
                <TouchableOpacity style={styles.addButton} onPress={handleAddTab}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 80,
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    tabScroll: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc'
    },
    tab: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    tabText: {
        color: '#444',
        fontSize: 16,
        marginRight: 8,
    },
    closeButton: {
        backgroundColor: 'transparent',
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#28a745',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
    },
});

export default TabManager;
