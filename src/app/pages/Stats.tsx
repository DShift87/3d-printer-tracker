import { useApp } from "@/app/context/AppContext";
import { Card } from "@/app/components/ui/card";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { MostUsedEmptyIcon } from "@/imports/most-used-empty-icon";
import { AllFilamentsIcon } from "@/imports/all-filaments-icon";
import { Progress } from "@/app/components/ui/progress";

type StatItem = { label: string; weight: number; colorHex?: string };

function aggregateBy(
  printedParts: { filamentId: string; weightUsed: number }[],
  filaments: { id: string; manufacturer?: string; color?: string; material?: string; colorHex?: string }[],
  getKey: (f: (typeof filaments)[0]) => string,
  getLabel: (f: (typeof filaments)[0]) => string,
  getColorHex?: (f: (typeof filaments)[0]) => string | undefined
): StatItem[] {
  const map = new Map<string, { weight: number; label: string; colorHex?: string }>();
  for (const part of printedParts) {
    const filament = filaments.find((x) => x.id === part.filamentId);
    if (!filament) continue;
    const key = getKey(filament);
    const label = getLabel(filament);
    const colorHex = getColorHex?.(filament);
    const prev = map.get(key);
    if (prev) {
      prev.weight += part.weightUsed;
    } else {
      map.set(key, { weight: part.weightUsed, label, colorHex });
    }
  }
  return Array.from(map.entries())
    .map(([, v]) => ({ label: v.label, weight: v.weight, colorHex: v.colorHex }))
    .sort((a, b) => b.weight - a.weight);
}

function StatSection({
  title,
  items,
  emptyMessage,
  useCircleIcon,
  useMaterialChip,
}: {
  title: string;
  items: StatItem[];
  emptyMessage: string;
  useCircleIcon?: boolean;
  useMaterialChip?: boolean;
}) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  const max = Math.max(...items.map((i) => i.weight), 1);

  return (
    <div>
      <h2 className="font-semibold mb-3">{title}</h2>
      <Card className="p-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={`${item.label}-${i}`} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 min-w-0">
                    {item.colorHex && useCircleIcon ? (
                      <span className="shrink-0" style={{ color: item.colorHex }}>
                        <AllFilamentsIcon className="h-4 w-4" />
                      </span>
                    ) : item.colorHex ? (
                      <span
                        className="shrink-0 w-3 h-3 rounded-full border border-border"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    ) : null}
                    {useMaterialChip ? (
                      <MaterialChip className="shrink-0">{item.label}</MaterialChip>
                    ) : (
                      <span className="text-sm font-medium truncate">{item.label}</span>
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {item.weight}g
                  </span>
                </div>
                <Progress value={(item.weight / max) * 100} className="h-1.5" indicatorClassName="bg-[#F26D00]" />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function Stats() {
  const { filaments, printedParts } = useApp();

  const mostUsedBrands = aggregateBy(
    printedParts,
    filaments,
    (f) => f.manufacturer,
    (f) => f.manufacturer
  ).slice(0, 7);

  const mostUsedColors = aggregateBy(
    printedParts,
    filaments,
    (f) => f.color,
    (f) => f.color,
    (f) => f.colorHex
  ).slice(0, 7);

  const mostUsedMaterials = aggregateBy(
    printedParts,
    filaments,
    (f) => f.material,
    (f) => f.material
  ).slice(0, 7);

  const hasAnyStats =
    mostUsedBrands.length > 0 ||
    mostUsedColors.length > 0 ||
    mostUsedMaterials.length > 0;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <div className="pt-2">
        <h1 className="text-2xl font-bold mb-1">Stats</h1>
        <p className="text-sm text-muted-foreground">
          Most used brands, colors, and materials
        </p>
      </div>

      {hasAnyStats ? (
        <div className="space-y-6">
          <StatSection
            title="Most used brands"
            items={mostUsedBrands}
            emptyMessage="No print data yet. Print parts to see brand usage."
          />
          <StatSection
            title="Most used colors"
            items={mostUsedColors}
            emptyMessage="No print data yet. Print parts to see color usage."
            useCircleIcon
          />
          <StatSection
            title="Most used materials"
            items={mostUsedMaterials}
            emptyMessage="No print data yet. Print parts to see material usage."
            useMaterialChip
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <MostUsedEmptyIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No stats yet</h3>
          <p className="text-sm text-muted-foreground">
            Print parts with your filaments to see most used brands, colors, and materials here.
          </p>
        </div>
      )}
    </div>
  );
}
