"use client";

import { use } from "react";
import { getModule, getPhase } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, ExternalLink, Video as VideoIcon, FileText, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

export default function ModuleViewerPage({ params }: { params: Promise<{ phaseId: string, moduleId: string }> }) {
  const { phaseId, moduleId } = use(params);
  const { isModuleUnlocked } = useProgress();
  const phase = getPhase(phaseId);
  const module = getModule(phaseId, moduleId);
  
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch(`/api/lessons/${phaseId}/${moduleId}`);
        const data = await res.json();
        setContent(data.content);
      } catch (error) {
        console.error("Failed to load lesson content", error);
      } finally {
        setLoading(false);
      }
    }
    if (module && isModuleUnlocked(moduleId)) {
      loadContent();
    } else {
      setLoading(false);
    }
  }, [phaseId, moduleId, module, isModuleUnlocked]);

  if (!module || !phase) {
    return <div>Module not found</div>;
  }

  const unlocked = isModuleUnlocked(moduleId);

  if (!unlocked) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/curriculum/${phaseId}`} className="hover:text-accent-primary flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {phase.title}
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">Week {module.week}</span>
        </div>

        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Module Locked</h2>
            <p className="text-muted-foreground max-w-md">
              You haven't passed the previous module's assignment yet. Complete it to unlock this content.
            </p>
            <Link href={`/curriculum/${phaseId}`}>
              <Button variant="outline" className="mt-4">
                Back to Curriculum
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* ... navigation breadcrumbs ... */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/curriculum/${phaseId}`} className="hover:text-accent-primary flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {phase.title}
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-medium">Week {module.week}</span>
        </div>
        
        <Link href={`/curriculum/${phaseId}/${moduleId}/assignment`}>
          <Button className="bg-accent-primary hover:bg-accent-primary/90">
            Go to Assignment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full bg-accent-secondary/10 px-3 py-1 text-xs font-medium text-accent-secondary ring-1 ring-inset ring-accent-secondary/20">
          Week {module.week}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{module.title}</h1>
        <p className="text-xl text-muted-foreground">{module.description}</p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8">
        {/* Lesson Video (Placeholder if exists) */}
        {module.youtubeLinks && module.youtubeLinks.length > 0 && (
          <Card className="overflow-hidden border-border/50">
            <div className="aspect-video bg-muted flex items-center justify-center relative group">
              <VideoIcon className="h-16 w-16 text-red-600 opacity-80 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm font-medium">Watch Lesson Video</span>
                <Button size="sm" variant="secondary" className="h-8">Play now</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Written Content */}
        <Card className="border-border/50">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <div className="flex items-center gap-2 text-accent-primary mb-6">
              <FileText className="h-5 w-5" />
              <h2 className="text-xl font-bold m-0">Lesson Notes</h2>
            </div>
            <div className="text-foreground/90 leading-relaxed min-h-[200px] flex flex-col">
              {loading ? (
                <div className="flex-grow flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-accent-primary" />
                </div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown>
                    {content || "# Notes Coming Soon\n\nWe are currently finalizing the notes for this module. In the meantime, please refer to the external resources and the assignment prompt."}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resources & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {module.wokwiLink && (
            <Card className="border-border/50 hover:border-accent-secondary/50 transition-colors">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-accent-secondary/10 text-accent-secondary">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Wokwi Simulator</p>
                    <p className="text-xs text-muted-foreground">Interact with the circuit</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-accent-secondary">Open</Button>
              </CardContent>
            </Card>
          )}
          
          <Card className="border-border/50 hover:border-accent-primary/50 transition-colors col-span-1">
             <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-accent-primary/10 text-accent-primary">
                    <VideoIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Supplemental Video</p>
                    <p className="text-xs text-muted-foreground">CS50 Reference</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-accent-primary">Watch</Button>
              </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-border/50">
        <Button variant="ghost" className="text-muted-foreground" disabled>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Week
        </Button>
        <Link href={`/curriculum/${phaseId}/${moduleId}/assignment`}>
          <Button variant="outline" className="border-accent-primary text-accent-primary hover:bg-accent-primary/5">
            Start Assignment
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
