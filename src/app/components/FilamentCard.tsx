import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { FilamentIcon } from "@/imports/filament-icon";

export interface Filament {
  id: string;
  name: string;
  material: string;
  color: string;
  colorHex: string;
  totalWeight: number;
  remainingWeight: number;
  manufacturer: string;
  diameter: number;
  price?: number;
}

interface FilamentCardProps {
  filament: Filament;
  onClick?: (filament: Filament) => void;
}

export function FilamentCard({ filament, onClick }: FilamentCardProps) {
  const percentageRemaining = (filament.remainingWeight / filament.totalWeight) * 100;
  const isLow = percentageRemaining < 20;
  const isMedium = percentageRemaining >= 20 && percentageRemaining <= 49;
  const isHigh = percentageRemaining > 50;

  const getProgressColor = () => {
    if (isHigh) return "bg-green-500";
    if (isMedium) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      onClick={() => onClick?.(filament)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
            style={{ backgroundColor: filament.colorHex }}
          >
            <FilamentIcon className="w-6 h-6 text-white drop-shadow-md" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{filament.manufacturer}</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {filament.material}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {filament.diameter}mm
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className={isLow ? "text-destructive font-medium" : ""}>
            {filament.remainingWeight}g / {filament.totalWeight}g
          </span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div 
            className={`h-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentageRemaining}%` }}
          />
        </div>
      </div>
    </Card>
  );
}