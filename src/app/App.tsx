import { RouterProvider } from "react-router";
import { AppProvider } from "@/app/context/AppContext";
import { router } from "@/app/routes";
import { Toaster } from "@/app/components/ui/sonner";
import { PwaUpdatePrompt } from "@/app/components/PwaUpdatePrompt";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
      <PwaUpdatePrompt />
    </AppProvider>
  );
}

export default App;
