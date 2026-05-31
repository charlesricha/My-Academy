import { Phase, Module } from "@/types";
import curriculumData from "@/data/curriculum.json";

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

export const getAllModules = (): Module[] => {
  return getPhases().flatMap(phase => phase.modules);
};

export const getNextModule = (currentModuleId: string): Module | undefined => {
  const allModules = getAllModules();
  const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
  if (currentIndex !== -1 && currentIndex < allModules.length - 1) {
    return allModules[currentIndex + 1];
  }
  return undefined;
};

export const getPreviousModule = (currentModuleId: string): Module | undefined => {
  const allModules = getAllModules();
  const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
  if (currentIndex > 0) {
    return allModules[currentIndex - 1];
  }
  return undefined;
};

export const getPhaseForModule = (moduleId: string): Phase | undefined => {
  return getPhases().find(p => p.modules.some(m => m.id === moduleId));
};
