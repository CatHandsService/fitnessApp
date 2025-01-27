import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

const Header: React.FC = () => {
    const segments = useSegments(); // 現在のルートパスを取得
    const currentTab = segments[segments.length - 1]; // 最後のセグメントが現在のタブ名

    // タブ名を表示用に変換
    const tabNames: { [key: string]: string } = {
        index: 'History',
        timer: 'Timer',
        workout: 'Setup',
        settings: 'Settings',
    };

    const displayName = tabNames[currentTab] || 'History'; // タブ名が存在しない場合はデフォルト

    return (
        <View style={styles.header}>
            <Text style={styles.logo}>{displayName}</Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    logo: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
