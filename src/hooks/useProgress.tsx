"use client";

import { useAuth } from "./useAuth";
import { getPreviousModule, getAllModules, getPhases } from "@/lib/curriculum";

export function useProgress() {
  const { user } = useAuth();

  const isModulePassed = (moduleId: string) => {
    return user?.passedModules?.includes(moduleId) || false;
  };

  const isModuleUnlocked = (moduleId: string) => {
    // First module is always unlocked
    if (moduleId === "week-1") return true;

    // A module is unlocked if the previous module is passed
    const prevModule = getPreviousModule(moduleId);
    if (!prevModule) return true; // Should not happen for week-2+

    return isModulePassed(prevModule.id);
  };

  const getPhaseProgress = () => {
    const phases = getPhases();
    const passedModules = user?.passedModules || [];
    
    return phases.map(phase => {
      const phaseModules = phase.modules.map(m => m.id);
      const completedInPhase = phaseModules.filter(id => passedModules.includes(id)).length;
      return {
        id: phase.id,
        title: phase.title,
        completed: completedInPhase,
        total: phase.modules.length,
        percentage: phase.modules.length > 0 ? (completedInPhase / phase.modules.length) * 100 : 0
      };
    });
  };

  return {
    isModulePassed,
    isModuleUnlocked,
    getPhaseProgress,
    passedModules: user?.passedModules || [],
    userStats: {
      streak: user?.streak || 0,
      longestStreak: user?.longestStreak || 0,
      totalSessions: user?.totalSessionsCompleted || 0,
    }
  };
}
