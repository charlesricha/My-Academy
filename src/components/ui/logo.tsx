import React from "react";

export function Logo({ className = "h-8 w-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-primary, #6366f1)" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="var(--accent-secondary, #3b82f6)" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Hexagon / Shield outline with subtle glow */}
      <polygon
        points="50,5 90,28 90,72 50,95 10,72 10,28"
        stroke="url(#logo-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-20"
      />
      <polygon
        points="50,5 90,28 90,72 50,95 10,72 10,28"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Graduation cap merged with microchip circuit patterns */}
      {/* Cap top */}
      <path
        d="M50 22 L82 35 L50 48 L18 35 Z"
        fill="url(#logo-grad)"
        fillOpacity="0.15"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      {/* Tassel line and dot */}
      <path
        d="M82 35 L70 50 L70 58"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="70" cy="60" r="2" fill="url(#logo-grad)" />

      {/* Cap base / pillars resembling chip connections */}
      <path
        d="M32 40.5 V52 C32 58 40 62 50 62 C60 62 68 58 68 52 V40.5"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Circuit lines radiating down from the cap base */}
      {/* Center line */}
      <path
        d="M50 62 V78"
        stroke="url(#logo-grad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="50" cy="80" r="3" fill="url(#logo-grad)" filter="url(#glow)" />
      
      {/* Left side node */}
      <path
        d="M38 56 L30 64 V70"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="72" r="2.5" fill="url(#logo-grad)" />

      {/* Right side node */}
      <path
        d="M62 56 L70 64 V70"
        stroke="url(#logo-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="70" cy="72" r="2.5" fill="url(#logo-grad)" />
    </svg>
  );
}
