import { Package, Box, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { useApp } from "@/app/context/AppContext";
import { Badge } from "@/app/components/ui/badge";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { useNavigate } from "react-router";
import { DollarIcon } from "@/imports/dollar-icon";

export function Dashboard() {
  const { filaments, printedParts } = useApp();
  const navigate = useNavigate();

  // Calculate stats
  const totalSpools = filaments.length;
  const lowStockCount = filaments.filter(
    (f) => (f.remainingWeight / f.totalWeight) * 100 < 25
  ).length;
  const totalParts = printedParts.length;
  const totalValue = filaments.reduce((sum, f) => sum + (f.price || 0), 0);

  // Recent activity
  const recentParts = [...printedParts]
    .sort((a, b) => new Date(b.printDate).getTime() - new Date(a.printDate).getTime())
    .slice(0, 3);

  // Total print time
  const totalPrintTime = printedParts.reduce((sum, p) => sum + p.printTime, 0);
  const totalPrintHours = Math.floor(totalPrintTime / 60);

  // Most used filament
  const filamentUsage = printedParts.reduce((acc, part) => {
    acc[part.filamentId] = (acc[part.filamentId] || 0) + part.weightUsed;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedFilamentId = Object.keys(filamentUsage).reduce((a, b) =>
    filamentUsage[a] > filamentUsage[b] ? a : b
  , "");
  const mostUsedFilament = filaments.find((f) => f.id === mostUsedFilamentId);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your 3D printing overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200/50" onClick={() => navigate("/filaments")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <FilamentIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-orange-600/70 mb-0.5 font-medium">Filament Spools</p>
              <p className="text-2xl font-bold leading-none text-orange-600">{totalSpools}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 cursor-pointer hover:bg-accent/50 transition-colors bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/50" onClick={() => navigate("/parts")}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <PartsIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-600/70 mb-0.5 font-medium">Printed Parts</p>
              <p className="text-2xl font-bold leading-none text-blue-600">{totalParts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-red-600/70 mb-0.5 font-medium">Low Stock</p>
              <p className="text-2xl font-bold leading-none text-red-600">{lowStockCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 shadow-sm">
              <DollarIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600/70 mb-0.5 font-medium">Inventory Value</p>
              <p className="text-2xl font-bold leading-none text-green-600">${totalValue.toFixed(0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="font-semibold mb-3">Recent Prints</h2>
        {recentParts.length > 0 ? (
          <div className="space-y-2">
            {recentParts.map((part) => {
              const filament = filaments.find((f) => f.id === part.filamentId);
              return (
                <Card key={part.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
                      style={{ backgroundColor: filament?.colorHex || "#gray" }}
                    >
                      <PartsIcon className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{part.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(part.printDate).toLocaleDateString()} • {part.weightUsed}g
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.floor(part.printTime / 60)}h {part.printTime % 60}m
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <PartsIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No prints yet</p>
          </Card>
        )}
      </div>

      {/* Most Used Filament */}
      {mostUsedFilament && (
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Most Used</p>
              <p className="font-semibold">{mostUsedFilament.name}</p>
              <p className="text-sm text-muted-foreground">
                {filamentUsage[mostUsedFilamentId]}g used
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}