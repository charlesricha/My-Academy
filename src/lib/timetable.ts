import { addDays, startOfWeek, format, isSameDay, parseISO } from "date-fns";
import { Phase, Module } from "@/types";
import curriculumData from "@/data/curriculum.json";

export interface ScheduledSession {
  date: string; // ISO string
  phaseId: string;
  moduleId: string;
  moduleTitle: string;
  status: "completed" | "scheduled" | "missed";
}

/**
 * Generates a weekly timetable based on a start date.
 * Assumes 3 sessions per week (Mon, Wed, Fri by default).
 */
export const generateTimetable = (startDateISO: string): ScheduledSession[] => {
  const startDate = parseISO(startDateISO);
  const sessions: ScheduledSession[] = [];
  
  // Flatten all modules from all phases in order
  const allModules: { phaseId: string; module: Module }[] = [];
  curriculumData.phases.forEach((phase) => {
    phase.modules.forEach((module) => {
      allModules.push({ phaseId: phase.id, module: module as Module });
    });
  });

  // Calculate sessions: 3 per week (Mon=1, Wed=3, Fri=5)
  allModules.forEach((item, index) => {
    const weekIndex = Math.floor(index / 1); // For now, 1 module per week as per brief
    const sessionInWeek = index % 3; // But brief says 3 sessions per week
    
    // Actually, let's map: 1 module = 1 week = 3 sessions for that module
    for (let s = 0; s < 3; s++) {
      const dayOffset = [1, 3, 5][s]; // Mon, Wed, Fri
      const sessionDate = addDays(startOfWeek(addDays(startDate, weekIndex * 7)), dayOffset);
      
      // Determine status (mock logic: past is completed, future is scheduled)
      const now = new Date();
      let status: "completed" | "scheduled" | "missed" = "scheduled";
      if (sessionDate < now) {
        status = "completed";
      }

      sessions.push({
        date: sessionDate.toISOString(),
        phaseId: item.phaseId,
        moduleId: item.module.id,
        moduleTitle: item.module.title,
        status
      });
    }
  });

  return sessions;
};

/**
 * Gets sessions for a specific week
 */
export const getSessionsForWeek = (sessions: ScheduledSession[], targetDate: Date) => {
  const start = startOfWeek(targetDate);
  const end = addDays(start, 6);
  
  return sessions.filter(s => {
    const d = parseISO(s.date);
    return d >= start && d <= end;
  });
};
