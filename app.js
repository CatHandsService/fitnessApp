import React, { useState, useEffect } from 'react';
import {  SplashScreen } from 'expo-router';
import { firebase } from './services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import ThemeContext from './components/themeContext';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
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
  return null; // Or a loading screen
  };

  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme || 'light');
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme);
        }
      } catch (error) {
        console.error("Error loading theme", error);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <RootNavigation user={user}/>
    </ThemeContext.Provider>
  );
};

function RootNavigation({user}){
  const router = useRouter()

  useEffect(()=>{
    if(user){
      router.replace('(tabs)')
    } else {
      router.replace('login')
    }
  },[user])

  return null
};