import { Card } from "@/app/components/ui/card";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { Project } from "@/app/context/AppContext";
import { ProjectsTabIcon } from "@/imports/projects-tab-icon";

interface ProjectCardProps {
  project: Project;
  partCount: number;
  totalCost: number | null;
  onClick?: (project: Project) => void;
}

export function ProjectCard({
  project,
  partCount,
  totalCost,
  onClick,
}: ProjectCardProps) {
  return (
    <Card
      className="!p-[16px] gap-0 w-full max-w-none hover:shadow-lg transition-all active:scale-95 cursor-pointer"
      onClick={() => onClick?.(project)}
    >
      <div className="flex items-center w-full gap-4">
        <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-neutral-300">
          <ProjectsTabIcon active className="w-6 h-6 text-white drop-shadow-md" />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <h3 className="font-semibold truncate">{project.name}</h3>
          <div className="flex flex-wrap gap-2 mt-1 w-full">
            <MaterialChip>
              {partCount} part{partCount !== 1 ? "s" : ""}
            </MaterialChip>
          </div>
        </div>
      </div>

      <div className="space-y-2 w-full mt-3">
        <div className="flex justify-between items-baseline gap-3 text-sm">
          <span className="text-muted-foreground shrink-0">Parts</span>
          <span className="font-medium tabular-nums text-right w-16 shrink-0">
            {partCount}
          </span>
        </div>
        <div className="flex justify-between items-baseline gap-3 text-sm">
          <span className="text-muted-foreground shrink-0">Cost</span>
          <span
            className={`font-medium tabular-nums text-right w-16 shrink-0 ${totalCost !== null ? "text-green-600" : "text-foreground"}`}
          >
            {totalCost !== null ? `$${totalCost.toFixed(2)}` : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}
