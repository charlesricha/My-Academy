"use client";

import { 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Calendar as CalendarIcon,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { getModule, getPhaseForModule } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CalendarHeatmap } from "@/components/dashboard/CalendarHeatmap";
import { useMemo } from "react";
import { subDays } from "date-fns";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { passedModules } = useProgress();

  // Mock completed dates for the heatmap (ideally fetched from Firestore session logs)
  const completedDates = useMemo(() => {
    return [
      subDays(new Date(), 1).toISOString(),
      subDays(new Date(), 3).toISOString(),
      subDays(new Date(), 5).toISOString(),
      subDays(new Date(), 7).toISOString(),
      subDays(new Date(), 8).toISOString(),
    ];
  }, []);

  const currentModule = useMemo(() => {
    if (!user?.currentModule) return null;
    const module = getModule(getPhaseForModule(user.currentModule)?.id || "", user.currentModule);
    const phase = getPhaseForModule(user.currentModule);
    return { ...module, phaseTitle: phase?.title };
  }, [user?.currentModule]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Clock className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here&apos;s your progress for this week.</p>
        </div>
        <Card className="p-4 bg-muted/30 border-none shrink-0">
          <CalendarHeatmap completedDates={completedDates} />
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-accent-primary/5 border-accent-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent-warning fill-accent-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.streak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Longest: {user.longestStreak} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Phase</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.currentPhase.replace('phase-', 'Phase ')}</div>
            <p className="text-xs text-muted-foreground mt-1">Active Stage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Passed Modules</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-accent-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passedModules.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Assignments nailed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-accent-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalSessionsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Focus blocks tracked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Next Up / Current Module */}
        {currentModule && (
          <Card className="lg:col-span-2 overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Next Up</CardTitle>
                <Badge variant="outline" className="border-accent-primary text-accent-primary bg-accent-primary/5">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{currentModule.title}</h3>
                    <p className="text-muted-foreground">Week {currentModule.week} • {currentModule.phaseTitle}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-accent-primary/20" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Module Progress</span>
                    <span className="text-accent-primary">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Link 
                    href={`/curriculum/${getPhaseForModule(user.currentModule)?.id}/${user.currentModule}`}
                    className="flex-grow inline-flex items-center justify-center rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-white hover:bg-accent-primary/90 transition-all"
                  >
                    Continue Lesson
                  </Link>
                  <Link 
                    href={`/curriculum/${getPhaseForModule(user.currentModule)?.id}/${user.currentModule}/assignment`}
                    className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-muted transition-all"
                  >
                    View Assignment
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Timetable Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-accent-secondary" />
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { day: "Mon", status: "completed", title: "Theory & Research" },
                { day: "Wed", status: "active", title: "Implementation" },
                { day: "Fri", status: "scheduled", title: "Review & Refine" },
              ].map((session, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/10">
                  <div className={cn(
                    "w-2 h-10 rounded-full",
                    session.status === "completed" ? "bg-accent-success" : 
                    session.status === "active" ? "bg-accent-primary" : "bg-muted"
                  )} />
                  <div className="flex-grow">
                    <p className="text-xs font-medium text-muted-foreground uppercase">{session.day}</p>
                    <p className="text-sm font-semibold">{session.title}</p>
                  </div>
                  {session.status === "completed" && <CheckCircle2 className="h-4 w-4 text-accent-success" />}
                </div>
              ))}
            </div>
            <Link 
              href="/timetable"
              className="w-full inline-flex items-center justify-center text-sm font-medium text-accent-secondary hover:underline group"
            >
              View Full Timetable
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
