export const DASHBOARD_STYLES = [
  "corporate-parody",
  "midnight-ops",
  "cyberpunk-absurd",
  "retro-terminal",
  "clean-meme-minimal",
] as const;

export type DashboardStyle = (typeof DASHBOARD_STYLES)[number];

export const WIDGET_TYPES = [
  "kpi",
  "trend",
  "bar",
  "area",
  "donut",
  "matrix",
  "backlog",
  "gauge",
  "quote",
  "pulse",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export type KpiPayload = {
  value: string;
  delta: string;
  positive: boolean;
  unitLabel: string;
};

export type TrendPayload = {
  series: Array<{
    id: string;
    label: string;
    points: number[];
    smooth: boolean;
  }>;
  xLabels: string[];
};

export type BarPayload = {
  bars: Array<{
    label: string;
    value: number;
  }>;
};

export type AreaPayload = {
  points: number[];
  xLabels: string[];
};

export type DonutPayload = {
  segments: Array<{
    label: string;
    value: number;
  }>;
};

export type MatrixPayload = {
  xLabels: string[];
  yLabels: string[];
  cells: number[][];
};

export type BacklogPayload = {
  items: Array<{
    id: string;
    label: string;
    severity: "low" | "mid" | "high";
  }>;
};

export type GaugePayload = {
  value: number;
  label: string;
  threshold: number;
};

export type QuotePayload = {
  quote: string;
  source: string;
};

export type PulsePayload = {
  chips: string[];
};

export type WidgetPayloadMap = {
  kpi: KpiPayload;
  trend: TrendPayload;
  bar: BarPayload;
  area: AreaPayload;
  donut: DonutPayload;
  matrix: MatrixPayload;
  backlog: BacklogPayload;
  gauge: GaugePayload;
  quote: QuotePayload;
  pulse: PulsePayload;
};

type WidgetBase = {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
};

export type WidgetByType = {
  [K in WidgetType]: WidgetBase & {
    type: K;
    payload: WidgetPayloadMap[K];
  };
};

export type Widget = WidgetByType[WidgetType];

export type DashboardModel = {
  seed: string;
  style: DashboardStyle;
  generatedAt: string;
  widgets: Widget[];
};
