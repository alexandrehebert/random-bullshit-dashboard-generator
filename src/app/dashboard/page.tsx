import { Suspense } from "react";

import { DashboardApp } from "@/components/DashboardApp";

export default function DashboardPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-8">Loading dashboard...</main>}>
      <DashboardApp />
    </Suspense>
  );
}
