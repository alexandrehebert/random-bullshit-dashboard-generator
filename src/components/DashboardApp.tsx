"use client";

import { RefreshCw, Share2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  applyWidgetReplacements,
  DEFAULT_WIDGET_COUNT,
  encodeShareSeed,
  generateDashboard,
  normalizeSeed,
} from "@/lib/generator";
import { getStylePreset, STYLE_PRESETS } from "@/lib/stylePresets";
import { DASHBOARD_STYLES, type DashboardStyle } from "@/types/dashboard";

import { WidgetRenderer } from "./widgets/WidgetRenderer";

const DEFAULT_COUNT = DEFAULT_WIDGET_COUNT;
const MIN_COUNT = 3;
const MAX_COUNT = 24;

const isDashboardStyle = (value: string | null): value is DashboardStyle =>
  Boolean(value && DASHBOARD_STYLES.includes(value as DashboardStyle));

const randomSeed = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const randomStyle = (current: DashboardStyle): DashboardStyle => {
  const candidates = DASHBOARD_STYLES.filter((value) => value !== current);
  if (candidates.length === 0) {
    return current;
  }

  const nextIndex = Math.floor(Math.random() * candidates.length);
  return candidates[nextIndex] as DashboardStyle;
};

const randomCount = (current: number): number => {
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * (MAX_COUNT - MIN_COUNT + 1)) + MIN_COUNT;
  }

  return next;
};

export function DashboardApp() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [shareFeedback, setShareFeedback] = useState<"idle" | "copying" | "copied" | "manual" | "error">("idle");
  const feedbackTimeoutRef = useRef<number | null>(null);
  const [count, setCount] = useState<number>(DEFAULT_COUNT);
  const [replacementNonces, setReplacementNonces] = useState<Record<number, string>>({});

  const style = isDashboardStyle(searchParams.get("style"))
    ? (searchParams.get("style") as DashboardStyle)
    : "corporate-parody";
  const rawSeed = searchParams.get("seed");
  // Keep first render deterministic for SSR/CSR hydration; missing seeds are patched after mount.
  const seed = rawSeed ?? "seed-pending";

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let needsReplace = false;

    if (params.has("count")) {
      params.delete("count");
      needsReplace = true;
    }

    if (!params.has("style")) {
      params.set("style", style);
      needsReplace = true;
    }

    if (!rawSeed) {
      params.set("seed", normalizeSeed(null));
      needsReplace = true;
    }

    if (!needsReplace) {
      return;
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, rawSeed, router, searchParams, style]);

  useEffect(
    () => () => {
      if (feedbackTimeoutRef.current) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    },
    [],
  );

  const dashboard = useMemo(
    () =>
      generateDashboard({
        style,
        seed,
        count,
      }),
    [style, seed, count],
  );

  useEffect(() => {
    setReplacementNonces({});
  }, [style, seed, count]);

  const replacements = useMemo(
    () =>
      Object.entries(replacementNonces).map(([index, nonce]) => ({
        index: Number(index),
        nonce,
      })),
    [replacementNonces],
  );

  const widgets = useMemo(
    () =>
      applyWidgetReplacements({
        style,
        seed,
        widgets: dashboard.widgets,
        replacements,
      }),
    [dashboard.widgets, replacements, seed, style],
  );

  const preset = getStylePreset(dashboard.style);

  const updateParams = (next: { style?: DashboardStyle; seed?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    const resolvedSeed = next.seed ?? rawSeed ?? normalizeSeed(null);

    params.set("style", next.style ?? style);
    params.set("seed", resolvedSeed);
    params.delete("count");

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleRegenerate = () => {
    setCount(randomCount(count));
    updateParams({
      seed: randomSeed(),
      style: randomStyle(style),
    });
  };

  const handleCountChange = (nextCount: number) => {
    const normalizedCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, Math.floor(nextCount)));
    setCount(normalizedCount);
  };

  const scheduleShareFeedbackReset = () => {
    if (feedbackTimeoutRef.current) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    feedbackTimeoutRef.current = window.setTimeout(() => {
      setShareFeedback("idle");
      feedbackTimeoutRef.current = null;
    }, 2200);
  };

  const handleShare = async () => {
    setShareFeedback("copying");
    const shareSeed = rawSeed ?? normalizeSeed(null);
    const encodedShareSeed = encodeShareSeed(style, shareSeed, {
      count,
      replacements,
    });
    const url = `${window.location.origin}/s/${encodeURIComponent(encodedShareSeed)}`;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback("copied");
        scheduleShareFeedbackReset();
        return;
      } catch {
        // Fallback to manual copy prompt when clipboard API is blocked.
      }
    }

    const manualCopyValue = window.prompt("Copy this URL", url);
    if (manualCopyValue === null) {
      setShareFeedback("error");
      scheduleShareFeedbackReset();
      return;
    }

    setShareFeedback("manual");
    scheduleShareFeedbackReset();
  };

  const handleReplaceWidget = (index: number) => {
    setReplacementNonces((current) => ({
      ...current,
      [index]: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    }));
  };

  const shareButtonLabel =
    shareFeedback === "copying"
      ? "Copying..."
      : shareFeedback === "copied"
        ? "Copied"
        : shareFeedback === "manual"
          ? "Copied manually"
          : shareFeedback === "error"
            ? "Copy canceled"
            : "Copy Link";

  const shareButtonClass =
    shareFeedback === "copied"
      ? "border-emerald-700/40 bg-emerald-100 text-emerald-900"
      : shareFeedback === "manual"
        ? "border-sky-700/35 bg-sky-100 text-sky-900"
        : shareFeedback === "error"
          ? "border-rose-700/40 bg-rose-100 text-rose-900"
          : "border-black/20 bg-white/60 hover:bg-white";

  return (
    <main className="relative box-border overflow-x-hidden p-0">
      <section
        className={`dashboard-shell ${preset.fontClass} relative w-full border-0 bg-gradient-to-br px-4 sm:px-8 ${preset.shellClass}`}
      >
        <header className="-mx-4 mb-6 border-b border-black/15 bg-white/35 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] opacity-65">random nonsense telemetry</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">Dashboard Generator</h1>
            <p className="mt-2 max-w-xl text-sm opacity-80">{preset.vibe}</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-80">
            <label className="text-xs uppercase tracking-[0.2em] opacity-70">Dashboard style</label>
            <select
              value={style}
              onChange={(event) => updateParams({ style: event.target.value as DashboardStyle, seed: randomSeed() })}
              className="rounded-xl border border-black/20 bg-white/65 px-3 py-2 text-sm font-medium text-zinc-900 outline-none transition focus:ring-2 focus:ring-black/35"
            >
              {DASHBOARD_STYLES.map((styleValue) => (
                <option key={styleValue} value={styleValue}>
                  {STYLE_PRESETS[styleValue].label}
                </option>
              ))}
            </select>
            <div className="rounded-xl border border-black/15 bg-white/35 px-3 py-2">
              <div className="mb-1 flex items-center justify-between text-xs uppercase tracking-[0.14em] opacity-80">
                <span>Widget count</span>
                <span className="font-semibold">{count}</span>
              </div>
              <input
                type="range"
                min={MIN_COUNT}
                max={MAX_COUNT}
                step={1}
                value={count}
                onChange={(event) => handleCountChange(Number(event.target.value))}
                className="w-full cursor-pointer accent-zinc-800"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRegenerate}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/20 bg-black/10 px-3 py-2 text-sm font-semibold transition hover:bg-black/20"
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
              <button
                type="button"
                onClick={() => void handleShare()}
                disabled={shareFeedback === "copying"}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${shareButtonClass}`}
              >
                <Share2 size={16} />
                {shareButtonLabel}
              </button>
            </div>
          </div>
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] opacity-75">
          <span>style: {STYLE_PRESETS[style].label}</span>
          <span>seed: {seed}</span>
          <span>widgets: {count}</span>
        </div>

        <section className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {widgets.map((widget, index) => (
            <div key={widget.id} className="group/widget relative mb-4 break-inside-avoid">
              <button
                type="button"
                aria-label={`Replace ${widget.title}`}
                onClick={() => handleReplaceWidget(index)}
                className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-md border border-black/25 bg-white/90 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-800 opacity-0 shadow-sm transition group-hover/widget:opacity-100 hover:bg-white focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                <RefreshCw size={12} />
                Replace
              </button>
              <WidgetRenderer widget={widget} preset={preset} />
            </div>
          ))}
        </section>

        <footer className="mt-4 pb-4 text-xs uppercase tracking-[0.2em] opacity-70">{preset.footer}</footer>
      </section>
    </main>
  );
}
