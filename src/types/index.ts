export interface User {
  uid: string;
  name: string;
  email: string;
  startDate: string; // ISO string
  currentPhase: string;
  currentModule: string;
  passedModules: string[]; // Array of module IDs
  streak: number;
  longestStreak: number;
  lastSessionDate: string;
  totalSessionsCompleted: number;
  totalAssignmentsAttempted: number;
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: Module[];
}

export interface Module {
  id: string;
  week: number;
  title: string;
  description?: string;
  lessonContent?: string;
  youtubeLinks?: string[];
  wokwiLink?: string;
  assignment: Assignment;
}

export interface Assignment {
  prompt: string;
  expectedConcepts?: string[];
  maxScore?: number;
}

export interface Submission {
  id: string;
  uid: string;
  moduleId: string;
  code: string;
  explanation: string;
  score: number;
  passed: boolean;
  feedback: string;
  submittedAt: string;
  attempts: number;
}
