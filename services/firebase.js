
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4Qt3Oz9p-owUg5ABKK6da0C15MJNeVSg",
  authDomain: "fitness-app-6f591.firebaseapp.com",
  projectId: "fitness-app-6f591",
  storageBucket: "fitness-app-6f591.firebasestorage.app",
  messagingSenderId: "623858903862",
  appId: "1:623858903862:web:b621267f582621d277e197",
  measurementId: "G-RM0WQNJDSC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };