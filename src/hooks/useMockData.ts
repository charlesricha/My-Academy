import { User, Phase, Module } from "@/types";
import curriculumData from "@/data/curriculum.json";

export const mockUser: User = {
  uid: "mock-user-123",
  name: "Creative Learner",
  email: "learner@example.com",
  startDate: new Date().toISOString(),
  currentPhase: "phase-0",
  currentModule: "week-3", // Let's set it to week-3 for testing
  streak: 5,
  longestStreak: 12,
  lastSessionDate: new Date().toISOString(),
  totalSessionsCompleted: 15,
  passedModules: [],
  totalAssignmentsAttempted: 0,
};

export const getPhases = (): Phase[] => {
  return (curriculumData.phases as Phase[]);
};

export const getPhase = (phaseId: string): Phase | undefined => {
  return getPhases().find((p) => p.id === phaseId);
};

export const getModule = (phaseId: string, moduleId: string): Module | undefined => {
  const phase = getPhase(phaseId);
  return phase?.modules.find((m) => m.id === moduleId);
};

export const isModuleUnlocked = (targetModuleWeek: number): boolean => {
  // Find the current module's week number across all phases
  let currentWeek = 1;
  for (const phase of getPhases()) {
    const current = phase.modules.find(m => m.id === mockUser.currentModule);
    if (current) {
      currentWeek = current.week;
      break;
    }
  }
  return targetModuleWeek <= currentWeek;
};

