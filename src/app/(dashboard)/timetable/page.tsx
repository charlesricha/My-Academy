"use client";

import { useState, useMemo } from "react";
import { format, addWeeks, subWeeks, startOfWeek, isSameDay, parseISO } from "date-fns";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateTimetable, getSessionsForWeek } from "@/lib/timetable";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function TimetablePage() {
  const { user, loading } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));

  const allSessions = useMemo(() => {
    if (!user) return [];
    return generateTimetable(user.startDate);
  }, [user?.startDate]);

  const weekSessions = useMemo(() => {
    return getSessionsForWeek(allSessions, currentWeekStart);
  }, [allSessions, currentWeekStart]);

  const handlePreviousWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  const handleNextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  const handleToday = () => setCurrentWeekStart(startOfWeek(new Date()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Please log in to view your timetable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Your scheduled learning sessions and deadlines.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card p-1 rounded-lg border border-border">
          <Button variant="ghost" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleToday} className="px-4">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/20">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-accent-primary" />
            {format(currentWeekStart, "MMMM d")} – {format(addWeeks(currentWeekStart, 0), "MMMM d, yyyy")} {/* Fix end date display */}
          </CardTitle>
          <Badge variant="outline" className="border-accent-secondary text-accent-secondary">
            3 Sessions / Week
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-border">
            {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
              const currentDay = new Date(currentWeekStart);
              currentDay.setDate(currentWeekStart.getDate() + dayOffset);
              
              const daySessions = weekSessions.filter(s => isSameDay(parseISO(s.date), currentDay));
              const isToday = isSameDay(currentDay, new Date());

              return (
                <div key={dayOffset} className={cn(
                  "min-h-[250px] p-4 space-y-4 transition-colors",
                  isToday ? "bg-accent-primary/5" : "bg-transparent"
                )}>
                  <div className="flex flex-col items-center justify-center pb-2 border-b border-border/50">
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {format(currentDay, "EEE")}
                    </span>
                    <span className={cn(
                      "text-xl font-bold mt-1 h-8 w-8 flex items-center justify-center rounded-full",
                      isToday ? "bg-accent-primary text-white" : "text-foreground"
                    )}>
                      {format(currentDay, "d")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {daySessions.length > 0 ? (
                      daySessions.map((session, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "p-3 rounded-lg border text-[10px] space-y-2 relative overflow-hidden group hover:scale-[1.02] transition-transform",
                            session.status === "completed" ? "border-accent-success/30 bg-accent-success/5" :
                            session.status === "missed" ? "border-accent-danger/30 bg-accent-danger/5" :
                            "border-accent-primary/30 bg-accent-primary/5"
                          )}
                        >
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1",
                            session.status === "completed" ? "bg-accent-success" :
                            session.status === "missed" ? "bg-accent-danger" :
                            "bg-accent-primary"
                          )} />
                          
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-accent-primary truncate pr-2">{session.moduleTitle}</span>
                            {session.status === "completed" ? (
                              <CheckCircle2 className="h-3 w-3 text-accent-success" />
                            ) : session.status === "missed" ? (
                              <AlertCircle className="h-3 w-3 text-accent-danger" />
                            ) : (
                              <Clock className="h-3 w-3 text-accent-primary" />
                            )}
                          </div>
                          
                          <p className="text-muted-foreground line-clamp-2">Study & complete assignment.</p>
                          
                          <div className="pt-1">
                            <Badge variant="outline" className="text-[8px] h-3.5 px-1 uppercase border-muted-foreground/30">
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-20 flex items-center justify-center border border-dashed border-border rounded-lg opacity-20">
                        <Circle className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-accent-primary/5 border-accent-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent-success" />
              Completed This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekSessions.filter(s => s.status === "completed").length} / {weekSessions.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-accent-warning/5 border-accent-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent-warning" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekSessions.filter(s => s.status === "scheduled").length}</div>
          </CardContent>
        </Card>

        <Card className="bg-accent-danger/5 border-accent-danger/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-accent-danger" />
              Missed Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weekSessions.filter(s => s.status === "missed").length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
