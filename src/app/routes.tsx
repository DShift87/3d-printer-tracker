import { createBrowserRouter } from "react-router";
import { MobileLayout } from "@/app/components/MobileLayout";
import { Dashboard } from "@/app/pages/Dashboard";
import { Filaments } from "@/app/pages/Filaments";
import { FilamentDetail } from "@/app/pages/FilamentDetail";
import { PrintedParts } from "@/app/pages/PrintedParts";
import { PrintedPartDetail } from "@/app/pages/PrintedPartDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: () => (
      <MobileLayout>
        <Dashboard />
      </MobileLayout>
    ),
  },
  {
    path: "/filaments",
    Component: () => (
      <MobileLayout>
        <Filaments />
      </MobileLayout>
    ),
  },
  {
    path: "/filaments/:id",
    Component: () => <FilamentDetail />,
  },
  {
    path: "/parts",
    Component: () => (
      <MobileLayout>
        <PrintedParts />
      </MobileLayout>
    ),
  },
  {
    path: "/parts/:id",
    Component: () => <PrintedPartDetail />,
  },
]);