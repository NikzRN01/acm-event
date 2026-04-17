"use client";

import { Activity } from "lucide-react";

import { FlickeringGrid } from "@/components/ui/flickering-grid-hero";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1600&q=80";

const GRID_CONFIG = {
  background: {
    color: "#0ea5e9",
    maxOpacity: 0.14,
    flickerChance: 0.12,
    squareSize: 4,
    gridGap: 4,
  },
  accent: {
    color: "#0d9488",
    maxOpacity: 0.4,
    flickerChance: 0.16,
    squareSize: 3,
    gridGap: 6,
  },
} as const;

const FlickeringGridDemo = () => {
  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-sky-200/50 dark:border-sky-900/50">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-slate-950/55 dark:bg-slate-950/70" />

      <FlickeringGrid
        className="absolute inset-0 z-10 [mask-image:radial-gradient(620px_circle_at_center,white,transparent)]"
        {...GRID_CONFIG.background}
      />

      <div className="absolute inset-0 z-20 translate-y-[1.5vh]">
        <FlickeringGrid {...GRID_CONFIG.accent} />
      </div>

      <div className="relative z-30 flex h-full w-full items-center justify-center">
        <div className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white backdrop-blur">
          <Activity className="h-5 w-5" />
          <span className="text-sm font-medium">ECG Monitoring Background</span>
        </div>
      </div>
    </div>
  );
};

export { FlickeringGridDemo };
