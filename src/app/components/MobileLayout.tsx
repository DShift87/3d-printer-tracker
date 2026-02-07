import { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { DashboardIcon } from "@/imports/dashboard-icon";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { useAddAction } from "@/app/context/AddActionContext";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const location = useLocation();
  const { triggerAdd } = useAddAction();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DashboardIcon },
    { path: "/filaments", label: "Filaments", icon: FilamentIcon },
    { path: "/parts", label: "Parts", icon: PartsIcon },
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

      {/* Bottom Navigation - nav pill + FAB as siblings, FAB outside next to nav */}
      <nav
        className="fixed left-0 right-0 flex justify-center items-end px-4"
        style={{
          bottom: 0,
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="content-stretch flex gap-[9px] items-center p-[16px]">
          {/* Nav pill - 3 items only */}
          <div className="bg-white content-stretch flex gap-[8px] items-center p-[4px] rounded-[999px] shrink-0 w-[293px] shadow-[0_-4px_20px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.08)]">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/filaments" && location.pathname.startsWith("/filaments"));
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-2 px-1 rounded-full transition-colors ${
                    isActive
                      ? "bg-orange-100 text-[#F26D00]"
                      : "text-[#7A7A7A] hover:text-gray-900"
                  }`}
                >
                  <Icon active={isActive} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* FAB - orange bg, white icon */}
          <button
            type="button"
            onClick={triggerAdd}
            aria-label="Add"
            className="bg-orange-500 content-stretch flex flex-col items-center justify-center p-[4px] rounded-[9999px] shrink-0 size-[64px] hover:bg-orange-600 transition-colors shadow-[0_4px_16px_rgba(249,115,22,0.4),0_2px_8px_rgba(0,0,0,0.12)] active:scale-95 text-white"
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
      </nav>
    </div>
  );
}