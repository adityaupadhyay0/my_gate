export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISION_NEEDED';

export interface CustomTodo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface TopicState {
  id: string; // subjectId-topicSlug
  status: TopicStatus;
  confidence: number; // 0 to 5
  notes: string;
  customTodos: CustomTodo[];
  lastStudied?: string;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind color classes for custom categorizations
  topics: Topic[];
}

export interface GeneralTodo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface TrackerState {
  topicStates: Record<string, TopicState>; // keyed by topicState.id
  generalTodos: GeneralTodo[];
  streak: number;
  lastActiveDate?: string;
}
