import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { DashboardIcon } from "@/imports/dashboard-icon";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { StatsIcon } from "@/imports/stats-icon";
import { AddActionSheet } from "@/app/components/AddActionSheet";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/filaments", label: "Filaments", icon: FilamentIcon },
    { path: "/parts", label: "Parts", icon: PartsIcon },
    { path: "/stats", label: "Stats", icon: StatsIcon },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content - top padding keeps title below status bar */}
      <main
        className="flex-1 overflow-y-auto pb-20"
        style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
      >
        {children}
      </main>

      {/* Bottom Navigation - matches content width (max-w-md mx-auto p-4) */}
      <nav
        className="fixed left-0 right-0 z-50 flex justify-center items-end w-full"
        style={{
          bottom: "max(12px, env(safe-area-inset-bottom))",
        }}
      >
        <div className="content-stretch flex gap-[9px] items-center pt-[16px] pb-0 w-full max-w-md mx-auto px-4 min-w-0">
          {/* Nav pill - 4 items, fills available space */}
          <div className="bg-white flex gap-[8px] items-center p-[4px] rounded-xl flex-1 min-w-0 h-[64px] min-h-[64px] shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] relative">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/filaments" && location.pathname.startsWith("/filaments")) ||
                (item.path === "/stats" && location.pathname.startsWith("/stats"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 h-full min-h-0 py-0 px-1 rounded-xl transition-colors ${
                    isActive
                      ? "text-[#F26D00]"
                      : "text-[#7A7A7A] hover:text-gray-900"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-[10px] z-0 bg-orange-100"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-[1] flex flex-col items-center gap-1">
                    <Icon active={isActive} />
                    <span className="sr-only">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          {/* FAB → opens add-action bottom sheet on every screen */}
          <div className="relative shrink-0">
            <AddActionSheet open={addSheetOpen} onOpenChange={setAddSheetOpen} />
            <button
              type="button"
              onClick={() => setAddSheetOpen(true)}
              aria-label="Add"
              className="flex flex-col items-center justify-center p-[4px] rounded-xl shrink-0 h-[64px] w-[64px] min-h-[64px] min-w-[64px] bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)] active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z" />
                <path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}