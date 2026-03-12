import { NextResponse } from "next/server";

import { generateDashboard, normalizeSeed, parseCount } from "@/lib/generator";
import { DASHBOARD_STYLES, type DashboardStyle } from "@/types/dashboard";

const isDashboardStyle = (value: string | null): value is DashboardStyle =>
  Boolean(value && DASHBOARD_STYLES.includes(value as DashboardStyle));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const style = isDashboardStyle(searchParams.get("style"))
    ? (searchParams.get("style") as DashboardStyle)
    : "corporate-parody";

  const seed = normalizeSeed(searchParams.get("seed"));
  const count = parseCount(searchParams.get("count"));

  const payload = generateDashboard({ style, seed, count });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
