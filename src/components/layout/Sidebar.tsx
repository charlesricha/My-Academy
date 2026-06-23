"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  TrendingUp, 
  Library,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User as UserIcon
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Logo } from "@/components/ui/logo";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Timetable", icon: Calendar, href: "/timetable" },
  { label: "Curriculum", icon: BookOpen, href: "/curriculum" },
  { label: "Assignments", icon: CheckSquare, href: "/assignments" },
  { label: "Progress", icon: TrendingUp, href: "/progress" },
  { label: "Resources", icon: Library, href: "/resources" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <aside 
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              Creatives<span className="text-accent-primary">Academy</span>
            </span>
          )}
        </Link>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-muted rounded-md transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-grow py-6 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-accent-primary/10 text-accent-primary shadow-[inset_0_0_0_1px_rgba(108,99,255,0.2)]" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-accent-primary" : "group-hover:text-foreground"
              )} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        {!collapsed && user && (
          <div className="px-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary">
              <UserIcon size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">{user.name}</span>
              <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
            </div>
          </div>
        )}
        <button 
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
