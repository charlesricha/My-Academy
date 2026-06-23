"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { getPhases } from "@/lib/curriculum";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Award, 
  Flame, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  ChevronRight,
  BrainCircuit,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function ProgressPage() {
  const { user, loading } = useAuth();
  const { passedModules, getPhaseProgress } = useProgress();
  const phases = getPhases();

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
        <p className="text-muted-foreground">Please log in to view your progress.</p>
      </div>
    );
  }

  // Calculate stats
  const totalModules = phases.reduce((acc, phase) => acc + phase.modules.length, 0);
  const completedCount = passedModules.length;
  const overallProgress = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  
  const passRate = user.totalAssignmentsAttempted > 0 
    ? (completedCount / user.totalAssignmentsAttempted) * 100 
    : 0;

  const phaseProgress = getPhaseProgress();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
        <p className="text-muted-foreground">Track your journey to becoming a creative engineer.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-accent-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.streak || 0} Days</div>
            <p className="text-xs text-muted-foreground">Best: {user.longestStreak || 0} days</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Assignment Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-accent-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(passRate)}%</div>
            <p className="text-xs text-muted-foreground">{completedCount} passes out of {user.totalAssignmentsAttempted || 0} tries</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BrainCircuit className="h-4 w-4 text-accent-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalSessionsCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">Focus sessions tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Est. Completion</CardTitle>
            <Clock className="h-4 w-4 text-accent-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 Months</div>
            <p className="text-xs text-muted-foreground">Course duration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Phase Completion Bars */}
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent-primary" />
              Phase Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {phaseProgress && phaseProgress.length > 0 ? phaseProgress.map((phase) => (
              <div key={phase.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{phase.title}</span>
                  <span className="text-muted-foreground">{phase.completed} / {phase.total}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={phase.percentage} className="h-2" />
                  <span className="text-xs font-bold w-8 text-right">{Math.round(phase.percentage)}%</span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No phase progress data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements / Milestones */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent-warning" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "p-4 rounded-lg border flex items-start gap-3",
              completedCount >= 8 ? "bg-accent-success/5 border-accent-success/20" : "bg-muted/10 border-border/50 opacity-60"
            )}>
              <CheckCircle2 className={cn("h-5 w-5 mt-0.5", completedCount >= 8 ? "text-accent-success" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-bold">Phase 0 Foundations</p>
                <p className="text-xs text-muted-foreground">Understand binary and logic gates</p>
              </div>
            </div>

            <div className={cn(
              "p-4 rounded-lg border flex items-start gap-3",
              completedCount >= 20 ? "bg-accent-success/5 border-accent-success/20" : "bg-muted/10 border-border/50 opacity-60"
            )}>
              <CheckCircle2 className={cn("h-5 w-5 mt-0.5", completedCount >= 20 ? "text-accent-success" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-bold">Phase 1 Polyglot</p>
                <p className="text-xs text-muted-foreground">Master C++, Python, and JS</p>
              </div>
            </div>

            <div className={cn(
              "p-4 rounded-lg border flex items-start gap-3",
              completedCount >= 44 ? "bg-accent-success/5 border-accent-success/20" : "bg-muted/10 border-border/50 opacity-60"
            )}>
              <CheckCircle2 className={cn("h-5 w-5 mt-0.5", completedCount >= 44 ? "text-accent-success" : "text-muted-foreground")} />
              <div>
                <p className="text-sm font-bold">Phase 2 Fullstack</p>
                <p className="text-xs text-muted-foreground">Build production-grade web apps</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action CTA */}
      <Card className="bg-accent-primary/5 border-accent-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold">Ready to push further?</h3>
            <p className="text-muted-foreground">Continue where you left off and keep your streak alive.</p>
          </div>
          <Link href={`/curriculum`}>
            <Button className="bg-accent-primary hover:bg-accent-primary/90 h-12 px-8 font-bold">
              Resume Learning
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
