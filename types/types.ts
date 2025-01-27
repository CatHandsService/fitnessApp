// types.ts
export type User = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export type Todo = {
  id: string;
  text: string;
};

export type Tab = {
  id: string;
  name: string;
};

export interface WorkoutItem {
  type: 'training' | 'interval';
  id: string;
  name: string;
  sets: number;
  reps: number;
  interval: number;
  tab: string;
}

export interface TrainingComponentProps {
  id: string;
  name: string;
  sets: number;
  reps: number;
  interval: number;
  onUpdate: (field: string, value: string | number) => void;
  onRemoveItem: () => void;
  selectedField: string | null;
  onSelectedFieldChange: (field: string | null) => void;
  isDragging: boolean;
  drag: () => void;
}

export type TabComponentProps = {
  id: string;
  name: string;
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  activeTab: string;
  setActiveTab: (id: string) => void;
};
