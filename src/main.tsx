import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        window.dispatchEvent(new CustomEvent("pwa-need-refresh"));
      },
      onOfflineReady() {},
    });
    (window as unknown as { __pwa_update?: () => void }).__pwa_update = updateSW;
  });
}

createRoot(document.getElementById("root")!).render(<App />);
  