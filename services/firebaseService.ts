// firebaseService.ts
import { collection, doc, getDocs, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { Tab, WorkoutItem } from '@/types/types';

const userCol = process.env.REACT_APP_FIREBASE_USER_COLLECTION || 'users';
const userDocument = process.env.REACT_APP_FIREBASE_USER_DOCUMENT || '9IDymBk1BGEWl6Tvpqo6';
const workoutsSubCol = process.env.REACT_APP_FIREBASE_WORKOUTS_SUBCOLLECTION || 'workouts';

export const fetchWorkoutData = async (tabId: string): Promise<{ workoutItems: WorkoutItem[]; tabTitle: string }> => {
  try {
    const userDocRef = doc(db, userCol, userDocument);
    const workoutsRef = collection(userDocRef, workoutsSubCol);
    const querySnapshot = await getDocs(workoutsRef);

    if (querySnapshot.empty) {
      console.error('No workout data found');
      return { workoutItems: [], tabTitle: '' };
    }

    const workoutData = querySnapshot.docs[0].data();
    console.log(workoutData);

    const tab = workoutData.tabs.find((t: any) => t.id === tabId);
    const workoutItems = tab ? tab.tasks : [];
    const tabTitle = tab ? tab.title : '';

    return { workoutItems, tabTitle };
  } catch (error) {
    console.error('Error fetching workout data:', error);
    return { workoutItems: [], tabTitle: '' };
  }
};

export const fetchTabsData = async (): Promise<Tab[]> => {
  try {
    const userDocRef = doc(db, userCol, userDocument);
    const workoutsRef = collection(userDocRef, workoutsSubCol);
    const querySnapshot = await getDocs(workoutsRef);

    if (querySnapshot.empty) {
      console.error('No workout data found');
      return [];
    }

    const workoutData = querySnapshot.docs[0].data();
    return workoutData.tabs.map((tab: any) => ({
      id: tab.id,
      title: tab.title,
    }));
  } catch (error) {
    console.error('Error fetching tabs data:', error);
    return [];
  }
};

export const addWorkoutItemToFirebase = async (workoutItem: WorkoutItem) => {
  try {
    const userDocRef = doc(db, userCol, userDocument);
    const workoutsRef = collection(userDocRef, workoutsSubCol);
    const workoutDocs = await getDocs(workoutsRef);

    if (workoutDocs.empty) {
      console.error('No workout document found');
      return;
    }

    const workoutDocRef = workoutDocs.docs[0].ref;
    const currentData = workoutDocs.docs[0].data();

    const updatedTabs = currentData.tabs.map((tab: any) => {
      if (tab.id === workoutItem.activeTabId) {
        return {
          ...tab,
          tasks: [...tab.tasks, workoutItem],
        };
      }
      return tab;
    });

    await updateDoc(workoutDocRef, { tabs: updatedTabs });
  } catch (error) {
    console.error('Error adding workout item:', error);
  }
};

export const updateWorkoutItemInFirebase = async (workoutItem: WorkoutItem) => {
  try {
    const userDocRef = doc(db, userCol, userDocument);
    const workoutsRef = collection(userDocRef, workoutsSubCol);
    const workoutDocs = await getDocs(workoutsRef);

    if (workoutDocs.empty) {
      console.error('No workout document found');
      return;
    }

    const workoutDocRef = workoutDocs.docs[0].ref;
    const currentData = workoutDocs.docs[0].data();

    const updatedTabs = currentData.tabs.map((tab: any) => {
      if (tab.id === workoutItem.activeTabId) {
        return {
          ...tab,
          tasks: tab.tasks.map((task: any) =>
            task.id === workoutItem.id ? { ...task, ...workoutItem } : task
          ),
        };
      }
      return tab;
    });

    await updateDoc(workoutDocRef, { tabs: updatedTabs });
  } catch (error) {
    console.error('Error updating workout item:', error);
  }
};

export const deleteWorkoutItemFromFirebase = async (workoutItem: WorkoutItem) => {
  try {
    const userDocRef = doc(db, userCol, userDocument);
    const workoutsRef = collection(userDocRef, workoutsSubCol);
    const workoutDocs = await getDocs(workoutsRef);

    if (workoutDocs.empty) {
      console.error('No workout document found');
      return;
    }

    const workoutDocRef = workoutDocs.docs[0].ref;
    const currentData = workoutDocs.docs[0].data();

    const updatedTabs = currentData.tabs.map((tab: any) => {
      if (tab.id === workoutItem.activeTabId) {
        return {
          ...tab,
          tasks: tab.tasks.filter((task: any) => task.id !== workoutItem.id),
        };
      }
      return tab;
    });

    await updateDoc(workoutDocRef, { tabs: updatedTabs });
  } catch (error) {
    console.error('Error deleting workout item:', error);
  }
};