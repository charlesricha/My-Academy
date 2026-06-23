import Link from "next/link";
import { ArrowRight, Code, Cpu, Gamepad2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center">
        {/* Brand Logo Header */}
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-3xl bg-card border border-border shadow-[0_0_50px_rgba(99,102,241,0.15)] hover:scale-105 transition-transform duration-300">
            <Logo className="h-16 w-16" />
          </div>
        </div>

        {/* Sleek Top Accent Header (replacing AI pill bubble) */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-accent-primary/60" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-accent-secondary">
            The 18-Month Engineering Journey
          </span>
          <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-accent-primary/60" />
        </div>
        
        <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight">
          Creatives <span className="text-accent-primary">Academy</span>
        </h1>
        
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          A structured, self-paced software engineering curriculum designed to take you from
          intermediate to a full-stack, IoT, and game development engineer.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-accent-primary px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-accent-primary/90 transition-all hover:scale-105"
          >
            Start Learning
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/curriculum"
            className="inline-flex items-center justify-center rounded-md bg-secondary/10 px-8 py-3 text-base font-semibold text-accent-secondary ring-1 ring-inset ring-accent-secondary/20 hover:bg-secondary/20 transition-all"
          >
            View Curriculum
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl">
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
            <Cpu className="h-10 w-10 text-accent-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Systems & IoT</h3>
            <p className="text-sm text-muted-foreground">From binary and C to cloud-connected ESP32 hardware systems.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
            <Code className="h-10 w-10 text-accent-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fullstack Web</h3>
            <p className="text-sm text-muted-foreground">Master modern web apps with React, Node.js, and Three.js.</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border">
            <Gamepad2 className="h-10 w-10 text-accent-success mb-4" />
            <h3 className="text-xl font-semibold mb-2">Game Dev</h3>
            <p className="text-sm text-muted-foreground">Build interactive 2D and 3D games from first principles.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Creatives Academy. Built for single learners with big goals.</p>
      </footer>
    </div>
  );
}
