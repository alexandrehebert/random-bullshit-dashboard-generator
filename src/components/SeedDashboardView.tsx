import {
  Bell,
  Building2,
  CalendarDays,
  LayoutGrid,
  Menu,
  Funnel,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";

import { getStylePreset } from "@/lib/stylePresets";
import {
  applyWidgetReplacements,
  DEFAULT_WIDGET_COUNT,
  decodeShareSeed,
  generateDashboard,
} from "@/lib/generator";

import { WidgetRenderer } from "./widgets/WidgetRenderer";

type SeedDashboardViewProps = {
  seed: string;
};

const ORGS = [
  "Northstar Dynamics",
  "CloudOps Unlimited",
  "OmniSynergy Group",
  "Velocity Holdings",
  "Apex Alignment Labs",
];

const TAB_MENU = [
  { label: "Executive", icon: LayoutGrid },
  { label: "Revenue", icon: Users },
  { label: "Risk", icon: ShieldAlert },
  { label: "Operations", icon: SlidersHorizontal },
  { label: "Forecast", icon: CalendarDays },
] as const;
const REGIONS = ["North America", "EMEA", "APAC", "LATAM"];
const SEGMENTS = ["Enterprise", "SMB", "Public Sector", "Strategic Accounts"];
const SCENARIOS = ["Base Case", "Conservative", "Stretch", "Board Narrative"];

const hashValue = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export function SeedDashboardView({ seed }: SeedDashboardViewProps) {
  const decoded = decodeShareSeed(seed);
  const normalizedSeed = decoded.seed;
  const style = decoded.style;
  const count = decoded.count ?? DEFAULT_WIDGET_COUNT;
  const dashboard = generateDashboard({
    style,
    seed: normalizedSeed,
    count,
  });
  const widgets = applyWidgetReplacements({
    style,
    seed: normalizedSeed,
    widgets: dashboard.widgets,
    replacements: decoded.replacements,
  });
  const preset = getStylePreset(dashboard.style);
  const isCorporate = dashboard.style === "corporate-parody";
  const isMidnight = dashboard.style === "midnight-ops";
  const hash = hashValue(normalizedSeed);
  const orgName = ORGS[hash % ORGS.length];
  const activeTab = TAB_MENU[hash % TAB_MENU.length].label;
  const syncMinutesAgo = (hash % 19) + 1;
  const activeRegion = REGIONS[hash % REGIONS.length];
  const selectedScenario = SCENARIOS[(hash >> 2) % SCENARIOS.length];
  const selectedSegments = SEGMENTS.filter((_, index) => ((hash >> (index + 3)) & 1) === 1);
  const atLeastOneSegment = selectedSegments.length > 0 ? selectedSegments : [SEGMENTS[hash % SEGMENTS.length]];
  const toggleFilters = [
    { label: "Include pipeline anomalies", enabled: (hash & 1) === 1 },
    { label: "Show redline commitments", enabled: ((hash >> 1) & 1) === 1 },
    { label: "Apply board-ready smoothing", enabled: ((hash >> 2) & 1) === 1 },
  ];

  return (
    <main className="relative box-border overflow-x-hidden p-0">
      <section
        className={`dashboard-shell ${preset.fontClass} relative w-full border-0 bg-gradient-to-br px-4 sm:px-8 ${preset.shellClass}`}
      >
        <header
          className={`-mx-4 mb-6 border-b px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 ${
            isCorporate
              ? "border-slate-700/20 bg-slate-100/80"
              : isMidnight
                ? "border-slate-500/35 bg-slate-950/65"
                : "border-black/15 bg-white/35"
          }`}
        >
          <div className="flex items-center justify-between gap-3 sm:hidden">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border ${
                  isCorporate
                    ? "rounded-md border-slate-700/30 bg-slate-200/90"
                    : isMidnight
                      ? "rounded-md border-slate-400/35 bg-slate-800/70"
                      : "rounded-xl border-black/20 bg-black/10"
                }`}
              >
                <Building2 size={16} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] uppercase tracking-[0.18em] opacity-70">
                  {isCorporate ? "Enterprise Performance" : "Executive Suite"}
                </p>
                <h1 className="truncate text-base font-semibold tracking-tight">{orgName}</h1>
              </div>
            </div>

            <details className="group relative shrink-0 sm:hidden">
              <summary
                className={`flex cursor-pointer list-none items-center gap-1 border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isCorporate
                    ? "rounded-sm border-slate-700/25 bg-slate-200/85 text-slate-900"
                    : isMidnight
                      ? "rounded-sm border-slate-400/35 bg-slate-800/80 text-slate-100"
                      : "rounded-full border-black/20 bg-white/65"
                }`}
              >
                <Menu size={14} />
                Menu
              </summary>

              <div
                className={`absolute top-full right-0 z-20 mt-2 w-[min(84vw,320px)] border p-3 shadow-xl ${
                  isCorporate
                    ? "rounded-md border-slate-700/25 bg-slate-100/95 text-slate-900"
                    : isMidnight
                      ? "rounded-md border-slate-500/35 bg-slate-900/96 text-slate-100"
                      : "rounded-2xl border-black/15 bg-white/95"
                }`}
              >
                <div className="mb-2 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.14em]">
                  <span
                    className={`inline-flex items-center gap-1 border px-2 py-1 ${
                      isCorporate
                        ? "rounded-sm border-slate-700/25 bg-slate-200/80"
                        : isMidnight
                          ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                          : "rounded-full border-black/20 bg-black/10"
                    }`}
                  >
                    <ShieldCheck size={12} />
                    {isCorporate ? "SOX" : "Audit"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 border px-2 py-1 ${
                      isCorporate
                        ? "rounded-sm border-slate-700/25 bg-slate-200/80"
                        : isMidnight
                          ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                          : "rounded-full border-black/20 bg-black/10"
                    }`}
                  >
                    <Bell size={12} />
                    3 Alerts
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {TAB_MENU.map((tabItem) => {
                    const TabIcon = tabItem.icon;
                    return (
                    <div
                      key={`m-${tabItem.label}`}
                      className={`flex items-center justify-between border px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                        isCorporate ? "rounded-sm" : "rounded-xl"
                      } ${
                        tabItem.label === activeTab
                          ? isCorporate
                            ? "border-slate-700/35 bg-slate-300/70"
                            : isMidnight
                              ? "border-sky-300/40 bg-slate-800/90"
                            : "border-black/30 bg-black/15"
                          : isCorporate
                            ? "border-slate-700/20 bg-slate-100/75"
                            : isMidnight
                              ? "border-slate-500/30 bg-slate-900/65"
                            : "border-black/15 bg-white/45"
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <TabIcon size={13} />
                        {tabItem.label}
                      </span>
                      {tabItem.label === activeTab && <span className="text-[10px] opacity-75">active</span>}
                    </div>
                    );
                  })}
                </div>
              </div>
            </details>
          </div>

          <div className="hidden flex-col gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center border ${
                  isCorporate
                    ? "rounded-md border-slate-700/30 bg-slate-200/90"
                    : isMidnight
                      ? "rounded-md border-slate-400/35 bg-slate-800/70"
                      : "rounded-xl border-black/20 bg-black/10"
                }`}
              >
                <Building2 size={18} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] opacity-70">
                  {isCorporate ? "Enterprise Performance Office" : "Executive Intelligence Suite"}
                </p>
                <h1 className={`text-xl tracking-tight sm:text-2xl ${isCorporate ? "font-semibold" : "font-black"}`}>
                  {orgName} {isCorporate ? "Executive Reporting Deck" : "Board Dashboard"}
                </h1>
                {isCorporate && (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">
                    FY26 Q2 | Board Distribution | Confidential
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-80">
              <span
                className={`inline-flex items-center gap-1 border px-3 py-1 ${
                  isCorporate
                    ? "rounded-sm border-slate-700/25 bg-slate-200/80"
                    : isMidnight
                      ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                      : "rounded-full border-black/20 bg-black/10"
                }`}
              >
                <ShieldCheck size={13} />
                {isCorporate ? "SOX Ready" : "Audit Safe"}
              </span>
              <span
                className={`inline-flex items-center gap-1 border px-3 py-1 ${
                  isCorporate
                    ? "rounded-sm border-slate-700/25 bg-slate-200/80"
                    : isMidnight
                      ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                      : "rounded-full border-black/20 bg-black/10"
                }`}
              >
                <Bell size={13} />
                {isCorporate ? "3 Action Items" : "3 Alerts"}
              </span>
              <span
                className={`inline-flex items-center gap-1 border px-3 py-1 ${
                  isCorporate
                    ? "rounded-sm border-slate-700/25 bg-slate-200/80"
                    : isMidnight
                      ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                      : "rounded-full border-black/20 bg-black/10"
                }`}
              >
                <CalendarDays size={13} />
                Sync {syncMinutesAgo}m ago
              </span>
            </div>
          </div>

          <nav className="mt-4 hidden flex-wrap gap-2 sm:flex">
            {TAB_MENU.map((tabItem) => {
              const TabIcon = tabItem.icon;
              return (
              <span
                key={tabItem.label}
                className={`inline-flex items-center gap-1.5 border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                  isCorporate ? "rounded-sm" : "rounded-full"
                } ${
                  tabItem.label === activeTab
                    ? isCorporate
                      ? "border-slate-700/35 bg-slate-300/70"
                      : isMidnight
                        ? "border-sky-300/40 bg-slate-800/85"
                      : "border-black/30 bg-black/15"
                    : isCorporate
                      ? "border-slate-700/20 bg-slate-100/75"
                      : isMidnight
                        ? "border-slate-500/30 bg-slate-900/65"
                      : "border-black/15 bg-white/40"
                }`}
              >
                <TabIcon size={13} />
                {tabItem.label}
              </span>
              );
            })}
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[272px_minmax(0,1fr)]">
          <aside
            className={`h-fit border p-4 text-sm ${
              isCorporate
                ? "rounded-md border-slate-700/30 bg-slate-100/85 text-slate-800"
                : isMidnight
                  ? "rounded-md border-slate-500/35 bg-slate-900/75 text-slate-100"
                  : "rounded-2xl border-black/15 bg-white/50"
            }`}
          >
            <details className="group xl:hidden">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.2em] group-open:mb-1 group-open:pb-3 ${
                  isMidnight ? "group-open:border-b group-open:border-slate-500/35" : "group-open:border-b group-open:border-black/15"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Funnel size={14} />
                  Filter Context
                </span>
                <span className="text-[10px] opacity-70">Tap to expand</span>
              </summary>

              <div className="mt-3 space-y-4">
                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Region</p>
                  <div
                    className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${
                      isCorporate
                        ? "rounded-sm border-slate-700/30 bg-slate-200/80"
                        : isMidnight
                          ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                          : "rounded-full border-black/20 bg-black/10"
                    }`}
                  >
                    <Users size={13} />
                    {activeRegion}
                  </div>
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Scenario</p>
                  <div
                    className={`border px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] ${
                      isCorporate
                        ? "rounded-sm border-slate-700/30 bg-slate-50"
                        : isMidnight
                          ? "rounded-sm border-slate-500/35 bg-slate-900/70"
                          : "rounded-xl border-black/15 bg-white/55"
                    }`}
                  >
                    {selectedScenario}
                  </div>
                </section>

                <section>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Segment Focus</p>
                  <div className="flex flex-wrap gap-2">
                    {SEGMENTS.map((segment) => {
                      const isSelected = atLeastOneSegment.includes(segment);
                      return (
                        <span
                          key={`m-${segment}`}
                          className={`border px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                            isCorporate ? "rounded-sm" : "rounded-full"
                          } ${
                            isSelected
                              ? isCorporate
                                ? "border-slate-700/35 bg-slate-300/70"
                                : isMidnight
                                  ? "border-slate-400/35 bg-slate-800/80"
                                : "border-black/25 bg-black/15"
                              : isCorporate
                                ? "border-slate-700/20 bg-slate-100/60 opacity-75"
                                : isMidnight
                                  ? "border-slate-500/30 bg-slate-900/65 opacity-80"
                                : "border-black/15 bg-white/35 opacity-75"
                          }`}
                        >
                          {segment}
                        </span>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
                    <SlidersHorizontal size={13} />
                    Display Toggles
                  </div>
                  <ul className="space-y-2">
                    {toggleFilters.map((toggle) => (
                      <li
                        key={`m-${toggle.label}`}
                        className={`flex items-center justify-between gap-3 border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] ${
                          isCorporate
                            ? "rounded-sm border-slate-700/20 bg-slate-50/80"
                            : isMidnight
                              ? "rounded-sm border-slate-500/30 bg-slate-900/65"
                              : "rounded-lg border-black/15 bg-white/40"
                        }`}
                      >
                        <span className="opacity-85">{toggle.label}</span>
                        <span
                          className={`border px-2 py-0.5 text-[10px] font-semibold ${
                            isCorporate ? "rounded-sm" : "rounded-full"
                          } ${
                            toggle.enabled
                              ? isCorporate
                                ? "border-slate-700/35 bg-slate-300/70"
                                : isMidnight
                                  ? "border-sky-300/35 bg-slate-800/80 text-sky-200"
                                : "border-emerald-700/40 bg-emerald-100 text-emerald-900"
                              : isCorporate
                                ? "border-slate-700/20 bg-slate-100"
                                : isMidnight
                                  ? "border-slate-500/30 bg-slate-900/60 text-slate-300"
                                : "border-zinc-500/30 bg-zinc-200/70 text-zinc-700"
                          }`}
                        >
                          {toggle.enabled ? "On" : "Off"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </details>

            <div className="hidden space-y-4 xl:block">
              <div
                className={`mb-4 flex items-center gap-2 border-b pb-3 text-xs font-semibold uppercase tracking-[0.2em] ${
                  isMidnight ? "border-slate-500/35" : "border-black/15"
                }`}
              >
                <Funnel size={14} />
                Filter Context
              </div>

              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Region</p>
                <div
                  className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${
                    isCorporate
                      ? "rounded-sm border-slate-700/30 bg-slate-200/80"
                      : isMidnight
                        ? "rounded-sm border-slate-400/35 bg-slate-800/75"
                        : "rounded-full border-black/20 bg-black/10"
                  }`}
                >
                  <Users size={13} />
                  {activeRegion}
                </div>
              </section>

              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Scenario</p>
                <div
                  className={`border px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] ${
                    isCorporate
                      ? "rounded-sm border-slate-700/30 bg-slate-50"
                      : isMidnight
                        ? "rounded-sm border-slate-500/35 bg-slate-900/70"
                        : "rounded-xl border-black/15 bg-white/55"
                  }`}
                >
                  {selectedScenario}
                </div>
              </section>

              <section>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">Segment Focus</p>
                <div className="flex flex-wrap gap-2">
                  {SEGMENTS.map((segment) => {
                    const isSelected = atLeastOneSegment.includes(segment);
                    return (
                      <span
                        key={segment}
                        className={`border px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                          isCorporate ? "rounded-sm" : "rounded-full"
                        } ${
                          isSelected
                            ? isCorporate
                              ? "border-slate-700/35 bg-slate-300/70"
                              : isMidnight
                                ? "border-slate-400/35 bg-slate-800/80"
                              : "border-black/25 bg-black/15"
                            : isCorporate
                              ? "border-slate-700/20 bg-slate-100/60 opacity-75"
                              : isMidnight
                                ? "border-slate-500/30 bg-slate-900/65 opacity-80"
                              : "border-black/15 bg-white/35 opacity-75"
                        }`}
                      >
                        {segment}
                      </span>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">
                  <SlidersHorizontal size={13} />
                  Display Toggles
                </div>
                <ul className="space-y-2">
                  {toggleFilters.map((toggle) => (
                    <li
                      key={toggle.label}
                      className={`flex items-center justify-between gap-3 border px-2.5 py-1.5 text-[11px] uppercase tracking-[0.12em] ${
                        isCorporate
                          ? "rounded-sm border-slate-700/20 bg-slate-50/80"
                          : isMidnight
                            ? "rounded-sm border-slate-500/30 bg-slate-900/65"
                            : "rounded-lg border-black/15 bg-white/40"
                      }`}
                    >
                      <span className="opacity-85">{toggle.label}</span>
                      <span
                        className={`border px-2 py-0.5 text-[10px] font-semibold ${
                          isCorporate ? "rounded-sm" : "rounded-full"
                        } ${
                          toggle.enabled
                            ? isCorporate
                              ? "border-slate-700/35 bg-slate-300/70"
                              : isMidnight
                                ? "border-sky-300/35 bg-slate-800/80 text-sky-200"
                              : "border-emerald-700/40 bg-emerald-100 text-emerald-900"
                            : isCorporate
                              ? "border-slate-700/20 bg-slate-100"
                              : isMidnight
                                ? "border-slate-500/30 bg-slate-900/60 text-slate-300"
                              : "border-zinc-500/30 bg-zinc-200/70 text-zinc-700"
                        }`}
                      >
                        {toggle.enabled ? "On" : "Off"}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </aside>

          <section className="columns-1 gap-4 md:columns-2 xl:columns-3">
            {widgets.map((widget) => (
              <div key={widget.id} className="mb-4 break-inside-avoid">
                <WidgetRenderer widget={widget} preset={preset} />
              </div>
            ))}
          </section>
        </div>

        <footer className="mt-4 pb-4 text-xs uppercase tracking-[0.2em] opacity-70">{preset.footer}</footer>
      </section>
    </main>
  );
}
