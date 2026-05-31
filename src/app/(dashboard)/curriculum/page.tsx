"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPhases } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { ChevronRight, Lock, Unlock, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CurriculumPage() {
  const { user, loading } = useAuth();
  const phases = getPhases();
  const { isModuleUnlocked } = useProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view the curriculum.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Curriculum</h1>
        <p className="text-muted-foreground">Your 18-month journey to mastery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases.map((phase, idx) => {
          const firstModuleId = phase.modules[0]?.id;
          const isLocked = firstModuleId ? !isModuleUnlocked(firstModuleId) : false;
          
          return (
            <Link 
              key={phase.id} 
              href={isLocked ? "#" : `/curriculum/${phase.id}`}
              className={cn(
                "group block transition-all",
                isLocked ? "cursor-not-allowed opacity-60" : "hover:scale-[1.02]"
              )}
            >
              <Card className={cn(
                "h-full border-border/50 group-hover:border-accent-primary/50 transition-colors",
                !isLocked && "group-hover:shadow-[0_0_20px_rgba(108,99,255,0.1)]"
              )}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">Phase {idx}: {phase.title}</CardTitle>
                      {isLocked ? (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Unlock className="h-4 w-4 text-accent-success" />
                      )}
                    </div>
                    <CardDescription>{phase.duration}</CardDescription>
                  </div>
                  <Badge variant={isLocked ? "secondary" : "default"}>
                    {phase.modules.length} Modules
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {phase.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-accent-primary">
                      {isLocked ? "Locked" : "View Phase"}
                    </span>
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      !isLocked && "group-hover:translate-x-1"
                    )} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
