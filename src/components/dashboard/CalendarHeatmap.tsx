"use client";

import { useMemo } from "react";
import { 
  subDays, 
  format, 
  isSameDay, 
  eachDayOfInterval, 
  startOfToday,
  isFuture
} from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapProps {
  completedDates: string[]; // ISO strings
}

export function CalendarHeatmap({ completedDates }: HeatmapProps) {
  const today = startOfToday();
  const daysToShow = 14 * 7; // 14 weeks
  const startDate = subDays(today, daysToShow - 1);

  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startDate,
      end: today,
    });
  }, [startDate, today]);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Activity Heatmap</h3>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Less</span>
            <div className="w-2 h-2 rounded-sm bg-muted" />
            <div className="w-2 h-2 rounded-sm bg-accent-primary/40" />
            <div className="w-2 h-2 rounded-sm bg-accent-primary" />
            <span>More</span>
          </div>
        </div>
        
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isCompleted = completedDates.some(d => isSameDay(new Date(d), day));
            const isToday = isSameDay(day, today);

            return (
              <Tooltip key={dateStr}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-sm transition-colors",
                      isCompleted 
                        ? "bg-accent-primary shadow-[0_0_8px_rgba(108,99,255,0.4)]" 
                        : "bg-muted hover:bg-muted/80",
                      isToday && "ring-1 ring-accent-secondary ring-offset-1 ring-offset-background"
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] p-2">
                  <p className="font-bold">{format(day, "MMM d, yyyy")}</p>
                  <p>{isCompleted ? "Session completed" : "No session logged"}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
