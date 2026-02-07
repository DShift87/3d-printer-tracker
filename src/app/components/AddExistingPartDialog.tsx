import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { PrintedPart } from "@/app/context/AppContext";
import { MaterialChip } from "@/app/components/figma/MaterialChip";
import { PlusIcon } from "@/imports/plus-icon";

interface AddExistingPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parts: PrintedPart[];
  filaments: { id: string; colorHex?: string }[];
  projectId: string;
  projectName?: string;
  onAddPart: (part: PrintedPart) => void;
}

export function AddExistingPartDialog({
  open,
  onOpenChange,
  parts,
  filaments,
  projectId,
  projectName,
  onAddPart,
}: AddExistingPartDialogProps) {
  const otherParts = parts.filter((p) => p.projectId !== projectId);

  const handleSelect = (part: PrintedPart) => {
    onAddPart(part);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add existing part</DialogTitle>
          <DialogDescription>
            {projectName
              ? `Choose a part to add to "${projectName}".`
              : "Choose a part to add to this project."}
          </DialogDescription>
        </DialogHeader>
        {otherParts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            All your parts are already in this project, or you have no parts yet. Create a new part
            instead.
          </p>
        ) : (
          <ScrollArea className="flex-1 -mx-6 px-6 max-h-[50vh]">
            <ul className="space-y-2 pb-4">
              {otherParts.map((part) => {
                const filament = filaments.find((f) => f.id === part.filamentId);
                const date = new Date(part.printDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <li key={part.id}>
                    <div className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors">
                      <div
                        className="w-10 h-10 rounded-lg shrink-0 border border-[#E5E5E5] flex items-center justify-center"
                        style={{
                          backgroundColor: filament?.colorHex || "#9ca3af",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{part.name}</p>
                        <MaterialChip className="mt-0.5">{date}</MaterialChip>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shrink-0"
                        onClick={() => handleSelect(part)}
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
