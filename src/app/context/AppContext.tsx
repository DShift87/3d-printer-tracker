import { createContext, useContext, useState, ReactNode } from "react";

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

export interface PrintedPart {
  id: string;
  name: string;
  filamentId: string;
  weightUsed: number;
  printTime: number; // in minutes
  printDate: string;
  notes?: string;
  imageUrl?: string;
}

interface AppContextType {
  filaments: Filament[];
  addFilament: (filament: Omit<Filament, "id">) => Filament;
  updateFilament: (filament: Filament) => void;
  deleteFilament: (id: string) => void;
  printedParts: PrintedPart[];
  addPrintedPart: (part: Omit<PrintedPart, "id">) => void;
  updatePrintedPart: (part: PrintedPart) => void;
  deletePrintedPart: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [filaments, setFilaments] = useState<Filament[]>([
    {
      id: "1",
      name: "Premium Black PLA",
      material: "PLA",
      color: "Black",
      colorHex: "#000000",
      totalWeight: 1000,
      remainingWeight: 750,
      manufacturer: "Hatchbox",
      diameter: 1.75,
      price: 19.99,
    },
    {
      id: "2",
      name: "Transparent PETG",
      material: "PETG",
      color: "Clear",
      colorHex: "#E0F2FE",
      totalWeight: 1000,
      remainingWeight: 200,
      manufacturer: "eSUN",
      diameter: 1.75,
      price: 24.99,
    },
    {
      id: "3",
      name: "Sky Blue PLA+",
      material: "PLA",
      color: "Blue",
      colorHex: "#3B82F6",
      totalWeight: 1000,
      remainingWeight: 950,
      manufacturer: "Polymaker",
      diameter: 1.75,
      price: 22.99,
    },
  ]);

  const [printedParts, setPrintedParts] = useState<PrintedPart[]>([
    {
      id: "1",
      name: "Phone Stand",
      filamentId: "1",
      weightUsed: 45,
      printTime: 180,
      printDate: "2026-02-01",
      notes: "Printed at 0.2mm layer height",
    },
    {
      id: "2",
      name: "Cable Organizer",
      filamentId: "3",
      weightUsed: 28,
      printTime: 120,
      printDate: "2026-02-02",
    },
  ]);

  const addFilament = (filamentData: Omit<Filament, "id">) => {
    const newFilament: Filament = {
      ...filamentData,
      id: Date.now().toString(),
    };
    setFilaments([...filaments, newFilament]);
    return newFilament;
  };

  const updateFilament = (filament: Filament) => {
    setFilaments(filaments.map((f) => (f.id === filament.id ? filament : f)));
  };

  const deleteFilament = (id: string) => {
    setFilaments(filaments.filter((f) => f.id !== id));
  };

  const addPrintedPart = (partData: Omit<PrintedPart, "id">) => {
    const newPart: PrintedPart = {
      ...partData,
      id: Date.now().toString(),
    };
    setPrintedParts([...printedParts, newPart]);

    // Update filament weight
    const filament = filaments.find((f) => f.id === partData.filamentId);
    if (filament) {
      updateFilament({
        ...filament,
        remainingWeight: Math.max(0, filament.remainingWeight - partData.weightUsed),
      });
    }
  };

  const updatePrintedPart = (part: PrintedPart) => {
    const oldPart = printedParts.find((p) => p.id === part.id);
    setPrintedParts(printedParts.map((p) => (p.id === part.id ? part : p)));

    // Adjust filament weights if filament or weight changed
    if (oldPart) {
      if (oldPart.filamentId === part.filamentId) {
        // Same filament, just adjust the difference
        const weightDiff = part.weightUsed - oldPart.weightUsed;
        const filament = filaments.find((f) => f.id === part.filamentId);
        if (filament) {
          updateFilament({
            ...filament,
            remainingWeight: Math.max(0, filament.remainingWeight - weightDiff),
          });
        }
      } else {
        // Different filament, return weight to old and subtract from new
        const oldFilament = filaments.find((f) => f.id === oldPart.filamentId);
        const newFilament = filaments.find((f) => f.id === part.filamentId);
        if (oldFilament) {
          updateFilament({
            ...oldFilament,
            remainingWeight: oldFilament.remainingWeight + oldPart.weightUsed,
          });
        }
        if (newFilament) {
          updateFilament({
            ...newFilament,
            remainingWeight: Math.max(0, newFilament.remainingWeight - part.weightUsed),
          });
        }
      }
    }
  };

  const deletePrintedPart = (id: string) => {
    const part = printedParts.find((p) => p.id === id);
    if (part) {
      // Return weight to filament
      const filament = filaments.find((f) => f.id === part.filamentId);
      if (filament) {
        updateFilament({
          ...filament,
          remainingWeight: filament.remainingWeight + part.weightUsed,
        });
      }
    }
    setPrintedParts(printedParts.filter((p) => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        filaments,
        addFilament,
        updateFilament,
        deleteFilament,
        printedParts,
        addPrintedPart,
        updatePrintedPart,
        deletePrintedPart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}