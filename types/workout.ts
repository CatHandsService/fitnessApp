export interface WorkoutItem {
  type: 'training';
  id: string;
  name: string;
  sets: number;
  reps: number;
  interval: number;
}

export type WorkoutItemField = keyof Omit<WorkoutItem, 'type' | 'id'>;