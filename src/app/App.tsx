import { RouterProvider } from "react-router";
import { AppProvider } from "@/app/context/AppContext";
import { router } from "@/app/routes";
import { Toaster } from "@/app/components/ui/sonner";

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AppProvider>
  );
}

export default App;
