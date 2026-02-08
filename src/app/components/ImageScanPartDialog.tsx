import { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/app/components/ui/drawer";
import { useIsMobile } from "@/app/components/ui/use-mobile";
import { parseOcrText } from "@/app/lib/ocrParse";

export interface ScannedPartData {
  printTimeHours: number;
  printTimeMinutes: number;
  weightUsed: number | null;
  detectedPrice: number | null;
  notes: string;
}

interface ImageScanPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExtract: (data: ScannedPartData) => void;
}

export function ImageScanPartDialog({
  open,
  onOpenChange,
  onExtract,
}: ImageScanPartDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [parsed, setParsed] = useState<{
    printTimeMinutes: number | null;
    price: number | null;
    weightGrams: number | null;
    rawText: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    (e.target as HTMLInputElement).value = "";
    if (!file || !file.type.startsWith("image/")) return;

    setStatus("loading");
    setErrorMessage("");
    setParsed(null);
    setImagePreview(URL.createObjectURL(file));

    try {
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const result = parseOcrText(data.text);
      setParsed(result);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to read image");
    }
  };

  const handleCreatePart = () => {
    if (!parsed) return;
    const totalMins = parsed.printTimeMinutes ?? 0;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const noteParts: string[] = [];
    if (parsed.price != null) noteParts.push(`Detected cost from image: $${parsed.price.toFixed(2)}`);
    const notes = noteParts.join(". ");
    onExtract({
      printTimeHours: hours,
      printTimeMinutes: mins,
      weightUsed: parsed.weightGrams,
      detectedPrice: parsed.price,
      notes,
    });
    onOpenChange(false);
    reset();
  };

  const reset = () => {
    setStatus("idle");
    setParsed(null);
    setErrorMessage("");
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const hasTime = parsed?.printTimeMinutes != null && parsed.printTimeMinutes > 0;
  const hasPrice = parsed?.price != null;
  const hasWeight = parsed?.weightGrams != null && parsed.weightGrams > 0;

  const body = (
    <>
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          id="scan-image-input"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={status === "loading"}
          aria-hidden
        />
        <label
          htmlFor={status === "loading" ? undefined : "scan-image-input"}
          className={`flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-3 text-sm font-medium ring-offset-background transition-colors ${status === "loading" ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"}`}
        >
          {status === "loading" ? "Reading image…" : "Upload a picture"}
        </label>
      </div>

      {imagePreview && (
        <div className="rounded-lg border overflow-hidden bg-muted/50">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-40 object-contain"
          />
        </div>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}

      {status === "done" && parsed && (
        <div className="space-y-3">
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-sm font-medium">Detected:</p>
            <div className="flex flex-wrap gap-2">
              {hasTime && (
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  Time: {Math.floor((parsed.printTimeMinutes ?? 0) / 60)}h{" "}
                  {(parsed.printTimeMinutes ?? 0) % 60}m
                </span>
              )}
              {hasPrice && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Price: ${parsed.price!.toFixed(2)}
                </span>
              )}
              {hasWeight && (
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Weight: {parsed.weightGrams}g
                </span>
              )}
              {!hasTime && !hasPrice && !hasWeight && (
                <span className="text-sm text-muted-foreground">
                  No time, price or weight found. You can still create a part manually.
                </span>
              )}
            </div>
          </div>
          <Button className="w-full" onClick={handleCreatePart}>
            Create part with this info
          </Button>
        </div>
      )}
    </>
  );

  const header = (
    <>
      <DrawerTitle className="sm:text-lg">Scan image for part info</DrawerTitle>
      <DrawerDescription>
        Take a photo or pick from your library (printer display, slicer, receipt) to extract print
        time, weight and price.
      </DrawerDescription>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="space-y-1 pb-2">{header}</DrawerHeader>
          <div className="space-y-4 overflow-y-auto px-4 pb-6">{body}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Scan image for part info</DialogTitle>
          <DialogDescription>
            Take a photo or pick from your library (printer display, slicer, receipt) to extract
            print time, weight and price.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">{body}</div>
      </DialogContent>
    </Dialog>
  );
}
