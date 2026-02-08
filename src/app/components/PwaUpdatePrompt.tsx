import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";

export function PwaUpdatePrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onNeedRefresh = () => setShow(true);
    window.addEventListener("pwa-need-refresh", onNeedRefresh);
    return () => window.removeEventListener("pwa-need-refresh", onNeedRefresh);
  }, []);

  const handleRefresh = () => {
    const update = (window as unknown as { __pwa_update?: () => void }).__pwa_update;
    if (update) update();
  };

  if (!show) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground shadow-lg safe-area-pb"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <span className="text-sm font-medium">Update available</span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => setShow(false)}
        >
          Later
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 bg-white text-primary hover:bg-gray-100"
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}
