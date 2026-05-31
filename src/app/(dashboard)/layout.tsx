"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-accent-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading Academy...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-8 bg-card/50 backdrop-blur-sm">
          <div className="flex-grow">
            {/* Breadcrumbs or search can go here */}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-accent-primary flex items-center justify-center text-white font-bold text-xs">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold leading-none">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{user.currentPhase.replace('phase-', 'Phase ')}</p>
            </div>
          </div>
        </header>
        <main className="flex-grow overflow-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
