"use client";

import { useState, use, useEffect } from "react";
import { getModule, getPhase } from "@/lib/curriculum";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Send, Code, FileText, BrainCircuit, Loader2, CheckCircle2, XCircle, Lock, History, Clock } from "lucide-react";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, arrayUnion, increment, addDoc } from "firebase/firestore";
import { format } from "date-fns";
import { getNextModule } from "@/lib/curriculum";

export default function AssignmentPage({ params }: { params: Promise<{ phaseId: string, moduleId: string }> }) {
  const { phaseId, moduleId } = use(params);
  const { user } = useAuth();
  const { isModuleUnlocked } = useProgress();
  const phase = getPhase(phaseId);
  const module = getModule(phaseId, moduleId);

  const [code, setCode] = useState("// Write your code here\n");
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    improvements: string[];
    attemptNumber?: number;
  } | null>(null);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const fetchSubmissions = async () => {
    if (!user || !moduleId) return;
    setLoadingSubmissions(true);
    try {
      const submissionsRef = collection(db, "submissions", user.uid, moduleId);
      const q = query(submissionsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [user, moduleId]);

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
          <span className="text-foreground font-medium">Week {module.week} Assignment</span>
        </div>

        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Assignment Locked</h2>
            <p className="text-muted-foreground max-w-md">
              You haven't passed the previous module's assignment yet. Complete it to unlock this task.
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

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    let createdDocRef = null;
    const attemptNumber = submissions.length + 1;

    // 1. Create the submission document BEFORE grading starts (wrapped in try-catch so it won't crash if Firestore rules are locked)
    try {
      const submissionsRef = collection(db, "submissions", user.uid, moduleId);
      createdDocRef = await addDoc(submissionsRef, {
        score: 0,
        passed: false,
        feedback: "Grading in progress...",
        improvements: [],
        attemptNumber,
        timestamp: new Date(),
        userCode: code,
        userExplanation: explanation
      });
      // Refresh submissions list to show the "Grading in progress..." attempt
      fetchSubmissions();
    } catch (dbError) {
      console.error("Failed to create initial submission document in Firestore:", dbError);
    }

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentPrompt: module.assignment.prompt,
          expectedConcepts: module.assignment.expectedConcepts,
          userCode: code,
          userExplanation: explanation,
          uid: user.uid,
          moduleId: moduleId
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Grading request failed");
      }
      
      const data = await response.json();
      setResult(data);
      
      // 2. Update the created submission document with grading results
      if (createdDocRef) {
        try {
          await updateDoc(createdDocRef, {
            score: data.score,
            passed: data.passed,
            feedback: data.feedback,
            improvements: data.improvements || []
          });
        } catch (dbError) {
          console.error("Failed to update submission document with grading results:", dbError);
        }
      }

      // 3. Update user stats in Firestore
      try {
        const userRef = doc(db, "users", user.uid);
        const updates: any = {
          totalAssignmentsAttempted: increment(1),
          lastSessionDate: new Date().toISOString(),
        };

        // If passed, update passedModules and currentModule
        if (data.passed) {
          updates.passedModules = arrayUnion(moduleId);
          updates.totalSessionsCompleted = increment(1);

          // If this was the current module, advance to next
          if (user.currentModule === moduleId) {
            const nextModule = getNextModule(moduleId);
            if (nextModule) {
              updates.currentModule = nextModule.id;
            }
          }
        }

        await updateDoc(userRef, updates);
      } catch (dbError) {
        console.error("Failed to update user stats in Firestore:", dbError);
      }
      
      // Refresh submissions history
      fetchSubmissions();
    } catch (err: any) {
      console.error("Submission failed:", err);
      const errorMessage = err.message || "Failed to submit assignment. Please verify your Gemini API key and quota limits.";
      setError(errorMessage);

      // 4. Update the created submission document with failure details
      if (createdDocRef) {
        try {
          await updateDoc(createdDocRef, {
            score: 0,
            passed: false,
            feedback: `Grading request failed: ${errorMessage}`,
            improvements: ["Check your Gemini API key and connection.", "Retry grading your submission."]
          });
        } catch (dbError) {
          console.error("Failed to update submission document with failure details:", dbError);
        }
      }

      // Refresh submissions history to show the failure
      fetchSubmissions();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/curriculum/${phaseId}/${moduleId}`} className="hover:text-accent-primary flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Lesson
          </Link>
        </div>
        <Badge variant="outline" className="border-accent-warning text-accent-warning bg-accent-warning/5">
          Assignment Task
        </Badge>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Assignment: {module.title}</h1>
        <div className="p-4 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
          <p className="font-medium text-accent-primary flex items-center gap-2">
            <BrainCircuit className="h-4 w-4" />
            Task Prompt:
          </p>
          <p className="mt-1 text-foreground/90">{module.assignment.prompt}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code className="h-5 w-5 text-accent-secondary" />
              Solution Code
            </h3>
            <Badge variant="secondary" className="text-[10px]">C / PYTHON / JS</Badge>
          </div>
          <Card className="overflow-hidden border-border/50">
            <div className="h-[500px] bg-[#1e1e1e]">
              <Editor
                height="100%"
                defaultLanguage="c"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 }
                }}
              />
            </div>
          </Card>
        </div>

        {/* Explanation & Submit Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-primary" />
              Explain Your Logic
            </h3>
            <Textarea
              placeholder="Describe how your code works and why you chose this approach..."
              className="min-h-[200px] bg-card border-border/50 focus:border-accent-primary"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          {!result ? (
            <div className="space-y-4">
              {error && (
                <div className="p-4 rounded-lg bg-accent-danger/10 border border-accent-danger/20 text-accent-danger text-sm font-medium animate-in fade-in duration-300">
                  {error}
                </div>
              )}
              <Button 
                className="w-full h-12 bg-accent-primary hover:bg-accent-primary/90 text-lg font-bold shadow-lg shadow-accent-primary/20"
                onClick={handleSubmit}
                disabled={isSubmitting || !code.trim() || !explanation.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI is Grading...
                  </>
                ) : (
                  <>
                    Submit to Gemini
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Card className={cn(
              "animate-in zoom-in-95 duration-300",
              result.passed ? "border-accent-success/50 bg-accent-success/5" : "border-accent-danger/50 bg-accent-danger/5"
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-6 w-6 text-accent-success" />
                    ) : (
                      <XCircle className="h-6 w-6 text-accent-danger" />
                    )}
                    Grading Result
                  </CardTitle>
                  <div className="text-2xl font-bold">{result.score}/100</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Feedback</p>
                  <p className="text-foreground/90 leading-relaxed">{result.feedback}</p>
                </div>
                
                {result.improvements.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Improvements</p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-foreground/80">
                      {result.improvements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  {result.passed ? (
                    <Link href="/dashboard" className="flex-grow">
                      <Button className="w-full bg-accent-success hover:bg-accent-success/90">
                        Continue to Next Module
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="flex-grow border-accent-danger text-accent-danger hover:bg-accent-danger/5"
                      onClick={() => setResult(null)}
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Submission History Section */}
      <div className="space-y-6 pt-10 border-t border-border/50">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History className="h-6 w-6 text-accent-primary" />
          Submission History
        </h3>

        {loadingSubmissions ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.map((sub) => (
              <Card key={sub.id} className="border-border/50 bg-card/50 hover:bg-card transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={sub.passed ? "outline" : "destructive"} className={cn(
                      sub.passed ? "border-accent-success text-accent-success bg-accent-success/5" : ""
                    )}>
                      {sub.passed ? "Passed" : "Failed"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {sub.timestamp ? format(sub.timestamp.toDate(), "MMM d, h:mm a") : "Just now"}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2 flex items-center justify-between">
                    <span>Attempt #{sub.attemptNumber}</span>
                    <span className="text-2xl font-bold">{sub.score}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 italic">
                    "{sub.feedback}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-muted/20 rounded-xl border border-dashed border-border/50">
            <p className="text-muted-foreground">No previous submissions found for this assignment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
