import { WorkoutItem } from '@/types/types';
import { updateWorkoutItemInFirebase } from '@/services/firebaseService';

export type Action =
  | { type: 'ADD_ITEM'; payload: WorkoutItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_ITEM'; id: string; field: string; value: string | number }
  | { type: 'REORDER_ITEMS'; items: WorkoutItem[] };

export const workoutReducer = (state: WorkoutItem[], action: Action): WorkoutItem[] => {
  switch (action.type) {
    case 'ADD_ITEM':
      updateWorkoutItemInFirebase(action.payload);
      return [...state, action.payload];
    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id);
    case 'UPDATE_ITEM':
      const updatedState = state.map((item) =>
        item.id === action.id ? { ...item, [action.field]: action.value } : item
      );
      const updatedItem = updatedState.find(item => item.id === action.id);
      if (updatedItem) {
        updateWorkoutItemInFirebase(updatedItem);
      }
      return updatedState;
    case 'REORDER_ITEMS':
      return action.items;
    default:
      return state;
  }
};
