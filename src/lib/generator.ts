import seedrandom from "seedrandom";

import {
  DASHBOARD_STYLES,
  WIDGET_TYPES,
  type DashboardModel,
  type DashboardStyle,
  type Widget,
  type WidgetType,
} from "@/types/dashboard";
import { getStylePreset } from "@/lib/stylePresets";

type GeneratorOptions = {
  style: DashboardStyle;
  seed: string;
  count: number;
};

export type WidgetReplacement = {
  index: number;
  nonce: string;
};

const MIN_WIDGETS = 3;
const MAX_WIDGETS = 24;
export const DEFAULT_WIDGET_COUNT = 9;

const clampCount = (count: number): number =>
  Math.max(MIN_WIDGETS, Math.min(MAX_WIDGETS, Math.floor(count)));

const randomPick = <T>(rng: seedrandom.PRNG, list: readonly T[]): T => {
  const index = Math.floor(rng() * list.length);
  return list[index];
};

const randomInt = (rng: seedrandom.PRNG, min: number, max: number): number =>
  Math.floor(rng() * (max - min + 1)) + min;

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const makeSeries = (
  rng: seedrandom.PRNG,
  length: number,
  min: number,
  max: number,
  maxStep: number,
): number[] => {
  const points: number[] = [];
  let current = randomInt(rng, min + 10, max - 10);

  for (let i = 0; i < length; i += 1) {
    const delta = randomInt(rng, -maxStep, maxStep);
    current = clamp(current + delta, min, max);
    points.push(current);
  }

  return points;
};

const iconByType: Record<WidgetType, string> = {
  kpi: "Sparkles",
  trend: "ChartNoAxesColumnIncreasing",
  bar: "BarChart3",
  area: "ChartArea",
  donut: "PieChart",
  matrix: "Grid3x3",
  backlog: "ListTodo",
  gauge: "Gauge",
  quote: "MessageCircle",
  pulse: "Activity",
};

const widgetTitle = (rng: seedrandom.PRNG, style: DashboardStyle, type: WidgetType): string => {
  const preset = getStylePreset(style);
  const noun = randomPick(rng, preset.nouns);
  const verb = randomPick(rng, preset.verbs);
  const metric = randomPick(rng, preset.metrics);

  if (type === "kpi") return `${metric}`;
  if (type === "trend") return `${noun} ${verb} curve`;
  if (type === "bar") return `${metric} comparison`;
  if (type === "area") return `${noun} pressure map`;
  if (type === "donut") return `${noun} allocation`;
  if (type === "matrix") return `${metric} heat grid`;
  if (type === "backlog") return `${noun} backlog`;
  if (type === "gauge") return `${metric} threshold`;
  if (type === "quote") return "Executive transmission";
  return `${noun} pulse`;
};

const buildWidget = (
  rng: seedrandom.PRNG,
  style: DashboardStyle,
  type: WidgetType,
  index: number,
): Widget => {
  const preset = getStylePreset(style);
  const noun = randomPick(rng, preset.nouns);
  const verb = randomPick(rng, preset.verbs);
  const title = widgetTitle(rng, style, type);
  const subtitle = `${verb} ${noun}`;
  const id = `${type}-${index}-${Math.floor(rng() * 100000)}`;

  if (type === "kpi") {
    const value = randomInt(rng, 8, 970);
    const deltaRaw = randomInt(rng, 1, 37);
    const positive = rng() > 0.3;

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        value: `${value}`,
        delta: `${positive ? "+" : "-"}${deltaRaw}%`,
        positive,
        unitLabel: randomPick(rng, ["units", "index", "ops", "signals"]),
      },
    };
  }

  if (type === "trend") {
    const xLabels = Array.from({ length: 14 }, (_, i) => `D${i + 1}`);
    const seriesCount = randomInt(rng, 2, 3);
    const series = Array.from({ length: seriesCount }, (_, i) => ({
      id: `${id}-s-${i + 1}`,
      label: ["Actual", "Target", "Forecast"][i] ?? `Series ${i + 1}`,
      points: makeSeries(rng, xLabels.length, 12, 100, 15 - i * 2),
      smooth: rng() > 0.45,
    }));

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        series,
        xLabels,
      },
    };
  }

  if (type === "bar") {
    const bars = Array.from({ length: 10 }, (_, i) => ({
      label: `M${i + 1}`,
      value: randomInt(rng, 12, 100),
    }));

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: { bars },
    };
  }

  if (type === "area") {
    const points = makeSeries(rng, 18, 10, 100, 12);

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        points,
        xLabels: Array.from({ length: points.length }, (_, i) => `W${i + 1}`),
      },
    };
  }

  if (type === "donut") {
    const labels = ["Core", "Ops", "R&D", "Urgent"];
    const rawSegments = labels.map((label) => ({
      label,
      value: randomInt(rng, 10, 45),
    }));
    const total = rawSegments.reduce((sum, item) => sum + item.value, 0);
    const segments = rawSegments.map((segment) => ({
      ...segment,
      value: Math.max(5, Math.round((segment.value / total) * 100)),
    }));

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: { segments },
    };
  }

  if (type === "matrix") {
    const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const yLabels = ["API", "Web", "Data", "Ops", "Core", "Edge", "Batch"];
    const cells = yLabels.map(() => xLabels.map(() => randomInt(rng, 5, 100)));

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        xLabels,
        yLabels,
        cells,
      },
    };
  }

  if (type === "backlog") {
    const items = Array.from({ length: randomInt(rng, 3, 6) }, (_, i) => ({
      id: `${id}-item-${i}`,
      label: `${randomPick(rng, preset.verbs)} ${randomPick(rng, preset.nouns)}`,
      severity: randomPick(rng, ["low", "mid", "high"] as const),
    }));

    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: { items },
    };
  }

  if (type === "gauge") {
    const value = randomInt(rng, 25, 100);
    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        value,
        label: randomPick(rng, ["stable", "wobbly", "spicy", "legendary"]),
        threshold: randomInt(rng, 55, 85),
      },
    };
  }

  if (type === "quote") {
    return {
      id,
      type,
      title,
      subtitle,
      iconName: iconByType[type],
      payload: {
        quote: `${randomPick(rng, preset.quoteStarters)} we should ${randomPick(rng, preset.verbs)} ${randomPick(rng, preset.nouns)} ${randomPick(rng, preset.quoteClosers)}`,
        source: randomPick(rng, ["CFO of Vibes", "Infra Wizard", "Chief Meme Officer", "Head of Forecast Theatre"]),
      },
    };
  }

  return {
    id,
    type,
    title,
    subtitle,
    iconName: iconByType[type],
    payload: {
      chips: Array.from({ length: randomInt(rng, 3, 5) }, () =>
        `${randomPick(rng, preset.nouns)} ${randomInt(rng, 1, 99)}`,
      ),
    },
  };
};

const normalizeStyle = (rawStyle: string | null | undefined): DashboardStyle => {
  if (rawStyle && DASHBOARD_STYLES.includes(rawStyle as DashboardStyle)) {
    return rawStyle as DashboardStyle;
  }
  return "corporate-parody";
};

export const parseCount = (rawCount: string | null | undefined): number => {
  const parsed = Number(rawCount);
  if (Number.isFinite(parsed)) {
    return clampCount(parsed);
  }
  return DEFAULT_WIDGET_COUNT;
};

export const normalizeSeed = (seed: string | null | undefined): string => {
  if (seed && seed.trim().length > 0) {
    return seed;
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const hashSeed = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

export const styleFromSeed = (seed: string): DashboardStyle => {
  const index = hashSeed(seed) % DASHBOARD_STYLES.length;
  return DASHBOARD_STYLES[index];
};

const SHARE_SEED_PREFIX = "v1-";
const SHARE_SEED_PREFIX_V2 = "v2-";
const SHARE_SEED_SEPARATOR = "--";
const SHARE_REPLACEMENT_SEPARATOR = "~";
const SHARE_REPLACEMENT_PAIR_SEPARATOR = ".";

const isDashboardStyle = (value: string): value is DashboardStyle =>
  DASHBOARD_STYLES.includes(value as DashboardStyle);

const pickWidgetType = (
  rng: seedrandom.PRNG,
  existingWidgets: Widget[],
  replacingIndex?: number,
): WidgetType => {
  const matrixCountExcludingReplacement = existingWidgets.reduce((count, widget, index) => {
    if (index === replacingIndex) {
      return count;
    }

    return widget.type === "matrix" ? count + 1 : count;
  }, 0);

  const allowedTypes =
    matrixCountExcludingReplacement >= 1
      ? WIDGET_TYPES.filter((type) => type !== "matrix")
      : WIDGET_TYPES;

  return randomPick(rng, allowedTypes);
};

const serializeReplacements = (replacements: WidgetReplacement[]): string => {
  if (replacements.length === 0) {
    return "_";
  }

  return replacements
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((replacement) => `${replacement.index}${SHARE_REPLACEMENT_PAIR_SEPARATOR}${replacement.nonce}`)
    .join(SHARE_REPLACEMENT_SEPARATOR);
};

const deserializeReplacements = (raw: string | undefined): WidgetReplacement[] => {
  if (!raw || raw === "_") {
    return [];
  }

  return raw
    .split(SHARE_REPLACEMENT_SEPARATOR)
    .map((entry) => {
      const splitIndex = entry.indexOf(SHARE_REPLACEMENT_PAIR_SEPARATOR);
      if (splitIndex === -1) {
        return null;
      }

      const index = Number(entry.slice(0, splitIndex));
      const nonce = entry.slice(splitIndex + SHARE_REPLACEMENT_PAIR_SEPARATOR.length);
      if (!Number.isFinite(index) || index < 0 || nonce.trim().length === 0) {
        return null;
      }

      return {
        index,
        nonce,
      } satisfies WidgetReplacement;
    })
    .filter((replacement): replacement is WidgetReplacement => replacement !== null);
};

export const encodeShareSeed = (
  style: DashboardStyle,
  seed: string,
  options?: {
    count?: number;
    replacements?: WidgetReplacement[];
  },
): string => {
  const count = clampCount(options?.count ?? DEFAULT_WIDGET_COUNT);
  const replacements = options?.replacements ?? [];

  return `${SHARE_SEED_PREFIX_V2}${style}${SHARE_SEED_SEPARATOR}${seed}${SHARE_SEED_SEPARATOR}${count}${SHARE_SEED_SEPARATOR}${serializeReplacements(replacements)}`;
};

export const decodeShareSeed = (
  shareSeed: string,
): {
  style: DashboardStyle;
  seed: string;
  count: number;
  replacements: WidgetReplacement[];
} => {
  const normalized = normalizeSeed(shareSeed);

  if (normalized.startsWith(SHARE_SEED_PREFIX_V2)) {
    const payload = normalized.slice(SHARE_SEED_PREFIX_V2.length);
    const parts = payload.split(SHARE_SEED_SEPARATOR);
    const styleCandidate = parts[0] ?? "";
    const seedCandidate = parts[1] ?? "";
    const countCandidate = Number(parts[2] ?? DEFAULT_WIDGET_COUNT);
    const replacementsCandidate = deserializeReplacements(parts[3]);

    if (!isDashboardStyle(styleCandidate) || seedCandidate.trim().length === 0) {
      return {
        style: styleFromSeed(normalized),
        seed: normalized,
        count: DEFAULT_WIDGET_COUNT,
        replacements: [],
      };
    }

    return {
      style: styleCandidate,
      seed: seedCandidate,
      count: clampCount(countCandidate),
      replacements: replacementsCandidate,
    };
  }

  if (!normalized.startsWith(SHARE_SEED_PREFIX)) {
    return {
      style: styleFromSeed(normalized),
      seed: normalized,
      count: DEFAULT_WIDGET_COUNT,
      replacements: [],
    };
  }

  const payload = normalized.slice(SHARE_SEED_PREFIX.length);
  const splitIndex = payload.indexOf(SHARE_SEED_SEPARATOR);

  if (splitIndex === -1) {
    return {
      style: styleFromSeed(normalized),
      seed: normalized,
      count: DEFAULT_WIDGET_COUNT,
      replacements: [],
    };
  }

  const styleCandidate = payload.slice(0, splitIndex);
  const seedCandidate = payload.slice(splitIndex + SHARE_SEED_SEPARATOR.length);

  if (!isDashboardStyle(styleCandidate) || seedCandidate.trim().length === 0) {
    return {
      style: styleFromSeed(normalized),
      seed: normalized,
      count: DEFAULT_WIDGET_COUNT,
      replacements: [],
    };
  }

  return {
    style: styleCandidate,
    seed: seedCandidate,
    count: DEFAULT_WIDGET_COUNT,
    replacements: [],
  };
};

export const generateDashboard = ({ style, seed, count }: GeneratorOptions): DashboardModel => {
  const normalizedStyle = normalizeStyle(style);
  const normalizedCount = clampCount(count);
  const rng = seedrandom(`${normalizedStyle}:${seed}`);

  const widgets: Widget[] = [];
  for (let index = 0; index < normalizedCount; index += 1) {
    const type = pickWidgetType(rng, widgets);
    widgets.push(buildWidget(rng, normalizedStyle, type, index));
  }

  if (!widgets.some((widget) => widget.type === "bar")) {
    const replaceIndex = randomInt(rng, 0, Math.max(0, widgets.length - 1));
    widgets[replaceIndex] = buildWidget(rng, normalizedStyle, "bar", replaceIndex);
  }

  return {
    seed,
    style: normalizedStyle,
    generatedAt: new Date().toISOString(),
    widgets,
  };
};

export const replaceDashboardWidget = ({
  style,
  seed,
  widgets,
  index,
  nonce,
}: {
  style: DashboardStyle;
  seed: string;
  widgets: Widget[];
  index: number;
  nonce: string;
}): Widget => {
  const normalizedStyle = normalizeStyle(style);
  const safeIndex = clamp(index, 0, Math.max(0, widgets.length - 1));
  const rng = seedrandom(`${normalizedStyle}:${seed}:replace:${safeIndex}:${nonce}`);
  const nextType = pickWidgetType(rng, widgets, safeIndex);
  return buildWidget(rng, normalizedStyle, nextType, safeIndex);
};

export const applyWidgetReplacements = ({
  style,
  seed,
  widgets,
  replacements,
}: {
  style: DashboardStyle;
  seed: string;
  widgets: Widget[];
  replacements: WidgetReplacement[];
}): Widget[] => {
  if (replacements.length === 0) {
    return widgets;
  }

  const nextWidgets = [...widgets];
  for (const replacement of replacements) {
    if (replacement.index < 0 || replacement.index >= nextWidgets.length) {
      continue;
    }

    nextWidgets[replacement.index] = replaceDashboardWidget({
      style,
      seed,
      widgets: nextWidgets,
      index: replacement.index,
      nonce: replacement.nonce,
    });
  }

  return nextWidgets;
};
