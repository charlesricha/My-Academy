"use client";

import { use, useEffect, useState } from "react";
import { getPhase } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, CheckCircle2, PlayCircle, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PhaseDetailPage({ params }: { params: Promise<{ phaseId: string }> }) {
  const { phaseId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const phase = getPhase(phaseId);
  const { isModulePassed, isModuleUnlocked } = useProgress();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view phase details.</div>;
  }

  if (!phase) {
    return <div>Phase not found</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <div className="flex items-center gap-2 text-sm text-accent-primary font-medium mb-2">
          <Link href="/curriculum" className="hover:underline">Curriculum</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{phase.title}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{phase.title}</h1>
        <p className="text-muted-foreground">{phase.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {phase.modules.map((module) => {
          const isCompleted = isModulePassed(module.id);
          const isUnlocked = isModuleUnlocked(module.id);
          const isCurrent = isUnlocked && !isCompleted;

          return (
            <Link 
              key={module.id} 
              href={isUnlocked ? `/curriculum/${phaseId}/${module.id}` : "#"}
              className={cn(
                "block group",
                !isUnlocked && "cursor-not-allowed opacity-70"
              )}
            >
              <Card className={cn(
                "border-border/50 group-hover:border-accent-primary/50 transition-all",
                isCurrent && "border-accent-primary bg-accent-primary/5",
                !isUnlocked && "bg-muted/30"
              )}>
                <CardContent className="flex items-center p-6">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border mr-6",
                    isCompleted ? "bg-accent-success/10 border-accent-success text-accent-success" : 
                    isCurrent ? "bg-accent-primary border-accent-primary text-white" : 
                    "border-border text-muted-foreground"
                  )}>
                    {isCompleted ? <CheckCircle2 size={20} /> : 
                     !isUnlocked ? <Lock size={20} /> :
                     <span className="text-sm font-bold">{module.week}</span>}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      {isCurrent && <Badge variant="default" className="text-[10px] h-4 px-1">CURRENT</Badge>}
                      {!isUnlocked && <Badge variant="secondary" className="text-[10px] h-4 px-1">LOCKED</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{module.description || "Learn the fundamentals of this week's topic."}</p>
                  </div>

                  <div className="flex items-center gap-4 ml-6">
                    {isUnlocked ? (
                      <PlayCircle className={cn(
                        "h-6 w-6 transition-colors",
                        isCurrent ? "text-accent-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
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
