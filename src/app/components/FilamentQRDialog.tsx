import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Filament } from "./FilamentCard";
import { Download, Printer } from "lucide-react";

interface FilamentQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filament: Filament | null;
}

export function FilamentQRDialog({
  open,
  onOpenChange,
  filament,
}: FilamentQRDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!filament) return null;

  // Create a JSON string with all filament data
  const filamentData = JSON.stringify({
    id: filament.id,
    name: filament.name,
    material: filament.material,
    color: filament.color,
    colorHex: filament.colorHex,
    totalWeight: filament.totalWeight,
    remainingWeight: filament.remainingWeight,
    manufacturer: filament.manufacturer,
    diameter: filament.diameter,
    price: filament.price,
  });

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    // Convert SVG to blob
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${filament.manufacturer}-${filament.material}-QR.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print QR Code - ${filament.manufacturer} ${filament.material}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .details {
              margin: 20px 0;
              font-size: 14px;
            }
            .details div {
              margin: 5px 0;
            }
            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>${filament.manufacturer} - ${filament.material}</h1>
            <div class="details">
              <div><strong>Color:</strong> ${filament.color}</div>
              <div><strong>Diameter:</strong> ${filament.diameter}mm</div>
              <div><strong>Weight:</strong> ${filament.totalWeight}g</div>
              ${filament.price ? `<div><strong>Price:</strong> $${filament.price.toFixed(2)}</div>` : ""}
            </div>
            ${svgData}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto" bottomSheet>
        <DialogHeader>
          <DialogTitle>Filament QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code to quickly identify this filament spool.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 flex flex-col items-center gap-4">
          <div
            ref={qrRef}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <QRCodeSVG
              value={filamentData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">
              {filament.manufacturer} - {filament.material}
            </p>
            <div className="flex items-center justify-center gap-2">
              <div
                className="w-4 h-4 rounded border border-[#E5E5E5]"
                style={{ backgroundColor: filament.colorHex }}
              />
              <p className="text-sm text-muted-foreground">
                {filament.color} • {filament.diameter}mm
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {filament.totalWeight}g
              {filament.price && ` • $${filament.price.toFixed(2)}`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}