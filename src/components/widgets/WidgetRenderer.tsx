"use client";

import {
  Activity,
  BarChart3,
  ChartArea,
  ChartNoAxesColumnIncreasing,
  Gauge,
  Grid3x3,
  ListTodo,
  MessageCircle,
  PieChart as PieChartIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Fragment } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { StylePreset } from "@/lib/stylePresets";
import type { Widget } from "@/types/dashboard";

import { WidgetCard } from "./WidgetCard";

type WidgetRendererProps = {
  widget: Widget;
  preset: StylePreset;
};

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  ChartNoAxesColumnIncreasing,
  BarChart3,
  ChartArea,
  PieChart: PieChartIcon,
  Grid3x3,
  ListTodo,
  Gauge,
  MessageCircle,
  Activity,
};

const severityClass: Record<string, string> = {
  low: "border border-emerald-600/35 bg-emerald-200/70 text-emerald-900",
  mid: "border border-amber-600/35 bg-amber-200/75 text-amber-950",
  high: "border border-rose-700/35 bg-rose-200/75 text-rose-950",
};

const proSeverityClass: Record<string, string> = {
  low: "border border-slate-500/35 bg-slate-100 text-slate-800",
  mid: "border border-slate-600/35 bg-slate-200 text-slate-900",
  high: "border border-slate-700/35 bg-slate-300 text-slate-950",
};

const midnightSeverityClass: Record<string, string> = {
  low: "border border-emerald-300/35 bg-emerald-400/15 text-emerald-200",
  mid: "border border-amber-300/35 bg-amber-400/15 text-amber-200",
  high: "border border-rose-300/35 bg-rose-400/15 text-rose-200",
};

const widgetAccentClass: Record<string, string> = {
  kpi: "text-sky-600 border-sky-500/40 bg-sky-500/10",
  trend: "text-indigo-600 border-indigo-500/40 bg-indigo-500/10",
  bar: "text-fuchsia-600 border-fuchsia-500/40 bg-fuchsia-500/10",
  area: "text-cyan-600 border-cyan-500/40 bg-cyan-500/10",
  donut: "text-amber-600 border-amber-500/40 bg-amber-500/10",
  matrix: "text-emerald-600 border-emerald-500/40 bg-emerald-500/10",
  backlog: "text-rose-600 border-rose-500/40 bg-rose-500/10",
  gauge: "text-violet-600 border-violet-500/40 bg-violet-500/10",
  quote: "text-teal-600 border-teal-500/40 bg-teal-500/10",
  pulse: "text-orange-600 border-orange-500/40 bg-orange-500/10",
};

const proWidgetAccentClass: Record<string, string> = {
  kpi: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  trend: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  bar: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  area: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  donut: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  matrix: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  backlog: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  gauge: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  quote: "text-slate-700 border-slate-500/35 bg-slate-300/20",
  pulse: "text-slate-700 border-slate-500/35 bg-slate-300/20",
};

const midnightWidgetAccentClass: Record<string, string> = {
  kpi: "text-sky-200 border-sky-300/40 bg-sky-400/15",
  trend: "text-cyan-200 border-cyan-300/40 bg-cyan-400/15",
  bar: "text-indigo-200 border-indigo-300/40 bg-indigo-400/15",
  area: "text-teal-200 border-teal-300/40 bg-teal-400/15",
  donut: "text-amber-200 border-amber-300/40 bg-amber-400/15",
  matrix: "text-emerald-200 border-emerald-300/40 bg-emerald-400/15",
  backlog: "text-rose-200 border-rose-300/40 bg-rose-400/15",
  gauge: "text-violet-200 border-violet-300/40 bg-violet-400/15",
  quote: "text-fuchsia-200 border-fuchsia-300/40 bg-fuchsia-400/15",
  pulse: "text-orange-200 border-orange-300/40 bg-orange-400/15",
};

const barColors = ["#2563eb", "#db2777", "#0891b2", "#16a34a", "#d97706", "#7c3aed"];

const proBarColors = ["#334155", "#475569", "#64748b", "#1e3a8a", "#1d4ed8", "#0f172a"];

const linePalette = ["#4f46e5", "#0ea5e9", "#22c55e", "#d946ef"];
const piePalette = ["#16a34a", "#0284c7", "#f59e0b", "#dc2626", "#8b5cf6"];
const proLinePalette = ["#1d4ed8", "#334155", "#0f766e", "#4b5563"];
const proPiePalette = ["#1d4ed8", "#334155", "#64748b", "#0f172a", "#0f766e"];

export function WidgetRenderer({ widget, preset }: WidgetRendererProps) {
  const Icon = iconMap[widget.iconName] ?? Sparkles;
  const isCorporateTheme = preset.fontClass === "theme-corporate";
  const isMidnightTheme = preset.fontClass === "theme-midnight";
  const isProTheme = isCorporateTheme || isMidnightTheme;
  const accentMap = isMidnightTheme
    ? midnightWidgetAccentClass
    : isCorporateTheme
      ? proWidgetAccentClass
      : widgetAccentClass;
  const accentTone = accentMap[widget.type] ?? "";
  const activeSeverityClass = isMidnightTheme
    ? midnightSeverityClass
    : isCorporateTheme
      ? proSeverityClass
      : severityClass;
  const activeBarColors = isProTheme ? proBarColors : barColors;
  const activeLinePalette = isProTheme ? proLinePalette : linePalette;
  const activePiePalette = isProTheme ? proPiePalette : piePalette;
  const cardRadiusClass = isProTheme ? "rounded-md" : "rounded-2xl";
  const iconRadiusClass = isProTheme ? "rounded-sm" : "rounded-lg";

  return (
    <WidgetCard
      title={widget.title}
      subtitle={widget.subtitle}
      accentClass={`${preset.accentClass} ${accentTone}`}
      panelClass={preset.panelClass}
      cardRadiusClass={cardRadiusClass}
      iconRadiusClass={iconRadiusClass}
      icon={Icon}
    >
      {widget.type === "kpi" && (
        <div className="space-y-1">
          <p className="text-4xl font-black tracking-tight">{widget.payload.value}</p>
          <p className="text-sm opacity-70">{widget.payload.unitLabel}</p>
          <p className={`text-sm font-semibold ${widget.payload.positive ? "text-emerald-300" : "text-rose-300"}`}>
            {widget.payload.delta}
          </p>
        </div>
      )}

      {widget.type === "trend" && (
        <div className="space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={widget.payload.xLabels.map((label, index) => {
                  const row: Record<string, number | string> = { label };
                  widget.payload.series.forEach((series) => {
                    row[series.id] = series.points[index] ?? 0;
                  });
                  return row;
                })}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.25} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} width={30} domain={[0, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                {widget.payload.series.map((series, seriesIndex) => (
                  <Line
                    key={series.id}
                    type={series.smooth ? "monotone" : "linear"}
                    dataKey={series.id}
                    name={`${series.label}${series.smooth ? " (eased)" : ""}`}
                    stroke={activeLinePalette[seriesIndex % activeLinePalette.length]}
                    strokeWidth={seriesIndex === 0 ? 2.8 : 2}
                    dot={{ r: seriesIndex === 0 ? 2 : 1.5 }}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {widget.type === "bar" && (
        <div className="w-full space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={widget.payload.bars} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={28} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {widget.payload.bars.map((bar, index) => (
                    <Cell
                      key={`${widget.id}-${bar.label}`}
                      fill={activeBarColors[index % activeBarColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {widget.type === "area" && (
        <div className="w-full space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={widget.payload.xLabels.map((label, index) => ({
                  label,
                  value: widget.payload.points[index] ?? 0,
                }))}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`area-${widget.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} width={28} domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0891b2"
                  strokeWidth={2.4}
                  fillOpacity={1}
                  fill={`url(#area-${widget.id})`}
                  dot={{ r: 1.8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {widget.type === "donut" && (
        <div className="grid w-full grid-cols-[170px_1fr] items-center gap-4">
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={widget.payload.segments}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={45}
                  outerRadius={64}
                  paddingAngle={2}
                >
                  {widget.payload.segments.map((segment, index) => (
                    <Cell key={`${widget.id}-${segment.label}`} fill={activePiePalette[index % activePiePalette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 text-sm">
            {widget.payload.segments.map((segment) => (
              <div key={`${widget.id}-${segment.label}`} className="flex items-center justify-between gap-3">
                <span className="opacity-80">{segment.label}</span>
                <span className="font-semibold">{segment.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {widget.type === "matrix" && (
        <div className="w-full space-y-2">
          <div
            className="grid w-full gap-1 text-[10px]"
            style={{ gridTemplateColumns: `minmax(56px, 0.9fr) repeat(${widget.payload.xLabels.length}, minmax(0, 1fr))` }}
          >
            <span />
            {widget.payload.xLabels.map((xLabel, index) => (
              <span key={`${widget.id}-x-${index}`} className="text-center opacity-65">
                {xLabel}
              </span>
            ))}
            {widget.payload.yLabels.map((yLabel, rowIndex) => (
              <Fragment key={`${widget.id}-row-${rowIndex}`}>
                <span key={`${widget.id}-y-${rowIndex}`} className="self-center opacity-65">
                  {yLabel}
                </span>
                {widget.payload.cells[rowIndex].map((value, colIndex) => (
                  <span
                    key={`${widget.id}-c-${rowIndex}-${colIndex}`}
                    className={`${isProTheme ? "h-4 rounded-[2px]" : "h-4 rounded-sm"}`}
                    style={{
                      backgroundColor: isProTheme
                        ? `hsl(215, 20%, ${18 + value * 0.45}%)`
                        : `hsl(${200 - value * 1.1}, 85%, ${35 + value * 0.35}%)`,
                    }}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      )}

      {widget.type === "backlog" && (
        <ul className="space-y-2 text-sm">
          {widget.payload.items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center justify-between gap-3 bg-black/10 px-3 py-2 ${isProTheme ? "rounded-sm" : "rounded-lg"}`}
            >
              <span className="truncate">{item.label}</span>
              <span className={`${isProTheme ? "rounded-sm" : "rounded-full"} px-2 py-0.5 text-xs ${activeSeverityClass[item.severity]}`}>
                {item.severity}
              </span>
            </li>
          ))}
        </ul>
      )}

      {widget.type === "gauge" && (
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-black/15">
            <div
              className={`${isProTheme ? "h-full rounded-[2px] bg-gradient-to-r from-slate-700 via-slate-600 to-blue-700 transition-all duration-700" : "h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 transition-all duration-700"}`}
              style={{ width: `${widget.payload.value}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm opacity-85">
            <span>{widget.payload.label}</span>
            <span>
              {widget.payload.value}% / {widget.payload.threshold}%
            </span>
          </div>
        </div>
      )}

      {widget.type === "quote" && (
        <blockquote className="space-y-2 text-sm leading-relaxed">
          <p className="text-base">&quot;{widget.payload.quote}&quot;</p>
          <footer className="opacity-70">- {widget.payload.source}</footer>
        </blockquote>
      )}

      {widget.type === "pulse" && (
        <div className="flex flex-wrap gap-2">
          {widget.payload.chips.map((chip, index) => (
            <span
              key={`${widget.id}-${chip}`}
              className={`${isProTheme ? "rounded-sm" : "rounded-full"} px-3 py-1 text-sm`}
              style={{
                backgroundColor: isProTheme
                  ? ["#e2e8f0", "#cbd5e1", "#dbeafe", "#e5e7eb", "#f1f5f9"][index % 5]
                  : ["#dbeafe", "#fce7f3", "#dcfce7", "#fef3c7", "#e0e7ff"][index % 5],
                color: isProTheme ? "#0f172a" : "#1f2937",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
