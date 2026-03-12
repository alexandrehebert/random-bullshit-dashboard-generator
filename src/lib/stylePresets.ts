import type { DashboardStyle } from "@/types/dashboard";

export type StylePreset = {
  label: string;
  vibe: string;
  fontClass: string;
  shellClass: string;
  panelClass: string;
  accentClass: string;
  footer: string;
  nouns: string[];
  verbs: string[];
  metrics: string[];
  quoteStarters: string[];
  quoteClosers: string[];
};

export const STYLE_PRESETS: Record<DashboardStyle, StylePreset> = {
  "corporate-parody": {
    label: "Corporate Parody",
    vibe: "Boardroom theatre for made-up KPIs",
    fontClass: "theme-corporate",
    shellClass:
      "from-slate-100 via-slate-50 to-blue-50 text-slate-900 border-slate-900/10",
    panelClass: "bg-white/92 border-slate-300/80 shadow-[0_16px_44px_-28px_rgba(15,23,42,0.35)]",
    accentClass: "text-slate-700",
    footer: "Quarterly confidence remains within expected variance.",
    nouns: ["synergy", "north-star", "pipeline", "alignment", "velocity", "roadmap"],
    verbs: ["amplify", "de-risk", "monetize", "unlock", "accelerate", "productize"],
    metrics: ["Trust ROI", "Meeting Yield", "Slide Density", "Buzzword Throughput"],
    quoteStarters: ["Our strategy is simple", "The market is asking", "Stakeholders demand"],
    quoteClosers: ["before lunch.", "with confidence.", "for Q11 readiness."],
  },
  "midnight-ops": {
    label: "Midnight Ops",
    vibe: "After-hours command center with calm critical telemetry",
    fontClass: "theme-midnight",
    shellClass:
      "from-slate-950 via-slate-900 to-blue-950 text-slate-100 border-slate-600/35",
    panelClass: "bg-slate-900/88 border-slate-500/35 text-slate-100 shadow-[0_24px_70px_-34px_rgba(2,6,23,0.9)]",
    accentClass: "text-sky-300",
    footer: "Night shift operations remain inside tolerance windows.",
    nouns: ["incident queue", "edge cluster", "latency lane", "failover mesh", "audit log"],
    verbs: ["stabilize", "rebalance", "triage", "contain", "route", "sanitize"],
    metrics: ["Error Budget", "SLA Integrity", "Queue Health", "Deployment Drift"],
    quoteStarters: ["Control room confirms", "Night ops reports", "On-call summary says"],
    quoteClosers: ["before handoff.", "under protocol.", "by first light."],
  },
  "cyberpunk-absurd": {
    label: "Cyberpunk Absurd",
    vibe: "Neon control room with nonsense telemetry",
    fontClass: "theme-cyberpunk",
    shellClass:
      "from-cyan-300 via-lime-100 to-fuchsia-200 text-zinc-950 border-zinc-900/25",
    panelClass: "bg-zinc-950/90 border-cyan-300/50 text-cyan-100 shadow-[0_16px_60px_-30px_rgba(6,182,212,0.8)]",
    accentClass: "text-lime-300",
    footer: "Neural fan noise remains within spec.",
    nouns: ["drone mesh", "quantum scooter", "mood firewall", "street cloud", "pixel reactor"],
    verbs: ["overclock", "ghost", "splice", "jitter", "phase", "beam"],
    metrics: ["Neon Saturation", "Packet Aura", "Street Latency", "Chrome Integrity"],
    quoteStarters: ["Signal confirms", "Static whispers", "My visor predicts"],
    quoteClosers: ["before dawn.", "at sector 9.", "under rain protocol."],
  },
  "retro-terminal": {
    label: "Retro Terminal",
    vibe: "CRT command center for absurd operations",
    fontClass: "theme-retro",
    shellClass:
      "from-emerald-200 via-lime-100 to-emerald-300 text-emerald-950 border-emerald-900/30",
    panelClass: "bg-emerald-950/90 border-emerald-300/45 text-emerald-200 shadow-[0_12px_50px_-20px_rgba(16,185,129,0.75)]",
    accentClass: "text-lime-300",
    footer: "Press any key to continue pretending.",
    nouns: ["buffer", "tape drive", "kernel ghost", "macro", "copper bus", "daemon"],
    verbs: ["compile", "fork", "patch", "queue", "dump", "trace"],
    metrics: ["CRT Warmth", "Tape Drift", "Ping Ritual", "Prompt Confidence"],
    quoteStarters: ["SYSOP notes", "Operator log says", "Boot sequence implies"],
    quoteClosers: ["after midnight.", "without errors.", "pending coffee."],
  },
  "clean-meme-minimal": {
    label: "Clean Meme Minimal",
    vibe: "Calm dashboard with dry absurdity",
    fontClass: "theme-clean",
    shellClass:
      "from-sky-100 via-teal-50 to-cyan-100 text-zinc-900 border-zinc-900/10",
    panelClass: "bg-white/80 border-slate-300/70 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.6)]",
    accentClass: "text-cyan-700",
    footer: "Ship vibes, not certainty.",
    nouns: ["snack debt", "design token", "calendar entropy", "sprint aura", "coffee queue"],
    verbs: ["nudge", "stabilize", "serialize", "reframe", "prioritize", "vibe-check"],
    metrics: ["Calm Index", "Meme Compliance", "Snack Burn", "Inbox Pressure"],
    quoteStarters: ["Gentle reminder", "Data suggests", "Team energy says"],
    quoteClosers: ["for today.", "without panic.", "and it is fine."],
  },
};

export const getStylePreset = (style: DashboardStyle): StylePreset => STYLE_PRESETS[style];
