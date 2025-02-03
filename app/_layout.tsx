import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { firebase } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { User } from '../types/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../components/Header'
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  });

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Firebaseの認証状態をチェック
          const currentUser = firebase.auth().currentUser;
          if(currentUser && currentUser.uid === parsedUser.uid) {
            setUser(parsedUser);
          } else {
            await AsyncStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error("Error checking auto login", error);
      } finally {
        setLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {/* <Header /> */}
          <Stack screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name='(tabs)' />
            ) : (
              <Stack.Screen name='login' />
            )}
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default RootLayout;