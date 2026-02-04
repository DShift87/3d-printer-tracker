import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { PrintedPart } from "@/app/context/AppContext";
import { useApp } from "@/app/context/AppContext";

interface PrintedPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (part: Omit<PrintedPart, "id"> | PrintedPart) => void;
  editPart?: PrintedPart | null;
}

export function PrintedPartDialog({
  open,
  onOpenChange,
  onSave,
  editPart,
}: PrintedPartDialogProps) {
  const { filaments } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    filamentId: "",
    weightUsed: "",
    printTimeHours: "",
    printTimeMinutes: "",
    printDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (editPart) {
      const hours = Math.floor(editPart.printTime / 60);
      const minutes = editPart.printTime % 60;
      setFormData({
        name: editPart.name,
        filamentId: editPart.filamentId,
        weightUsed: editPart.weightUsed.toString(),
        printTimeHours: hours.toString(),
        printTimeMinutes: minutes.toString(),
        printDate: editPart.printDate,
        notes: editPart.notes || "",
      });
    } else {
      setFormData({
        name: "",
        filamentId: filaments[0]?.id || "",
        weightUsed: "",
        printTimeHours: "",
        printTimeMinutes: "",
        printDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [editPart, open, filaments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const printTime =
      (parseInt(formData.printTimeHours) || 0) * 60 +
      (parseInt(formData.printTimeMinutes) || 0);

    const partData: Omit<PrintedPart, "id"> = {
      name: formData.name,
      filamentId: formData.filamentId,
      weightUsed: parseInt(formData.weightUsed),
      printTime,
      printDate: formData.printDate,
      notes: formData.notes || undefined,
    };

    if (editPart) {
      onSave({ ...partData, id: editPart.id });
    } else {
      onSave(partData);
    }

    onOpenChange(false);
  };

  // Calculate estimated cost
  const selectedFilament = filaments.find((f) => f.id === formData.filamentId);
  const estimatedCost = selectedFilament?.price && formData.weightUsed
    ? (selectedFilament.price / selectedFilament.totalWeight) * parseInt(formData.weightUsed)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto" bottomSheet>
        <DialogHeader>
          <DialogTitle>
            {editPart ? "Edit Printed Part" : "Add Printed Part"}
          </DialogTitle>
          <DialogDescription>
            {editPart
              ? "Update the details of your printed part."
              : "Record a new 3D printed part."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Part Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Phone Stand"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filament">Filament Used</Label>
              <Select
                value={formData.filamentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, filamentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filaments.map((filament) => (
                    <SelectItem key={filament.id} value={filament.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: filament.colorHex }}
                        />
                        {filament.manufacturer} - {filament.material} {filament.color}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weightUsed">Weight Used (g)</Label>
                <Input
                  id="weightUsed"
                  type="number"
                  value={formData.weightUsed}
                  onChange={(e) =>
                    setFormData({ ...formData, weightUsed: e.target.value })
                  }
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="printDate">Print Date</Label>
                <Input
                  id="printDate"
                  type="date"
                  value={formData.printDate}
                  onChange={(e) =>
                    setFormData({ ...formData, printDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Print Time</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    value={formData.printTimeHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printTimeHours: e.target.value,
                      })
                    }
                    placeholder="Hours"
                    min="0"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={formData.printTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        printTimeMinutes: e.target.value,
                      })
                    }
                    placeholder="Minutes"
                    min="0"
                    max="59"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes about the print..."
                rows={3}
              />
            </div>

            {/* Estimated Cost Display */}
            {estimatedCost !== null && !isNaN(estimatedCost) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated Cost
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on filament price: ${selectedFilament?.price?.toFixed(2)} for {selectedFilament?.totalWeight}g
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editPart ? "Update" : "Add"} Part</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}