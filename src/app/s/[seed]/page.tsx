import { SeedDashboardView } from "@/components/SeedDashboardView";

type SeedPageProps = {
  params: Promise<{ seed: string }>;
};

export default async function SeedPage({ params }: SeedPageProps) {
  const { seed } = await params;
  return <SeedDashboardView seed={seed} />;
}
