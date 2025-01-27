import { firebase } from './firebase';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();

    const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await firebase.auth().signInWithCredential(googleCredential);

    const user = userCredential.user;

    const userObject = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };


      // ローカルストレージにユーザー情報を保存
      await AsyncStorage.setItem('user', JSON.stringify(userObject));

    return userObject;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};


export const signOut = async () => {
  try {
    await firebase.auth().signOut();
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};