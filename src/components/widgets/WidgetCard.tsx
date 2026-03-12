import type { LucideIcon } from "lucide-react";

type WidgetCardProps = {
  title: string;
  subtitle: string;
  accentClass: string;
  panelClass: string;
  icon: LucideIcon;
  cardRadiusClass?: string;
  iconRadiusClass?: string;
  children: React.ReactNode;
};

export function WidgetCard({
  title,
  subtitle,
  accentClass,
  panelClass,
  icon: Icon,
  cardRadiusClass = "rounded-2xl",
  iconRadiusClass = "rounded-lg",
  children,
}: WidgetCardProps) {
  return (
    <article
      className={`group relative overflow-hidden border p-5 transition duration-300 hover:-translate-y-1 ${cardRadiusClass} ${panelClass}`}
    >
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <header className="relative mb-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm opacity-75">{subtitle}</p>
          <h2 className="text-lg leading-tight font-semibold">{title}</h2>
        </div>
        <span className={`${iconRadiusClass} border px-2 py-1 ${accentClass}`}>
          <Icon size={16} strokeWidth={2.25} />
        </span>
      </header>
      <div className="relative">{children}</div>
    </article>
  );
}
