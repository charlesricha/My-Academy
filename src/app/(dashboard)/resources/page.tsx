"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Book, 
  Code, 
  Globe, 
  Library, 
  Video, 
  Download,
  ExternalLink,
  Search,
  Cpu,
  Layers,
  Gamepad2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const resources = [
  {
    category: "Computer Science Foundations",
    icon: Cpu,
    items: [
      { title: "CS50: Introduction to Computer Science", type: "Course", provider: "Harvard / edX", link: "https://cs50.harvard.edu/x/" },
      { title: "The C Programming Language", type: "Book", provider: "Kernighan & Ritchie", link: "#" },
      { title: "Digital Logic & Computer Design", type: "Reference", provider: "Morris Mano", link: "#" },
    ]
  },
  {
    category: "Web Development",
    icon: Globe,
    items: [
      { title: "MDN Web Docs", type: "Documentation", provider: "Mozilla", link: "https://developer.mozilla.org/" },
      { title: "React Documentation", type: "Docs", provider: "Meta", link: "https://react.dev/" },
      { title: "Tailwind CSS Ref", type: "Docs", provider: "Tailwind Labs", link: "https://tailwindcss.com/" },
    ]
  },
  {
    category: "Embedded & IoT",
    icon: Layers,
    items: [
      { title: "Wokwi Online Simulator", type: "Tool", provider: "Wokwi", link: "https://wokwi.com/" },
      { title: "Arduino Language Reference", type: "Docs", provider: "Arduino", link: "https://www.arduino.cc/reference/en/" },
      { title: "ESP32 Documentation", type: "Docs", provider: "Espressif", link: "https://docs.espressif.com/" },
    ]
  },
  {
    category: "Game Development",
    icon: Gamepad2,
    items: [
      { title: "Three.js Journey", type: "Course", provider: "Bruno Simon", link: "https://threejs-journey.com/" },
      { title: "Unity Learn", type: "Platform", provider: "Unity", link: "https://learn.unity.com/" },
      { title: "Game Programming Patterns", type: "Book", provider: "Robert Nystrom", link: "https://gameprogrammingpatterns.com/" },
    ]
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-muted-foreground">Curated tools, books, and courses for your learning.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources..." 
            className="pl-10 bg-card"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredResources.map((cat) => (
          <section key={cat.category} className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <cat.icon className="h-5 w-5 text-accent-primary" />
              {cat.category}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {cat.items.map((item) => (
                <Card key={item.title} className="group border-border/50 hover:border-accent-primary/50 transition-all bg-card/50 hover:bg-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors">
                        {item.type === "Book" ? <Book size={18} /> : 
                         item.type === "Course" ? <Video size={18} /> : 
                         item.type === "Tool" ? <Code size={18} /> : 
                         <Library size={18} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.provider} • {item.type}</p>
                      </div>
                    </div>
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Recommended Tools Section */}
      <section className="pt-8 border-t border-border/50 space-y-6">
        <h2 className="text-2xl font-bold">Recommended Software</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "VS Code", desc: "Code Editor", icon: Code },
            { name: "Git", desc: "Version Control", icon: Layers },
            { name: "Docker", desc: "Containerization", icon: Cpu },
            { name: "Postman", desc: "API Testing", icon: Globe },
          ].map((tool) => (
            <Card key={tool.name} className="border-border/50 bg-card/50 text-center p-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-4">
                <tool.icon size={24} />
              </div>
              <p className="font-bold">{tool.name}</p>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
              <Button variant="ghost" size="sm" className="mt-4 text-xs h-8">
                <Download className="mr-2 h-3 w-3" />
                Download
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import { Button } from "@/components/ui/button";
