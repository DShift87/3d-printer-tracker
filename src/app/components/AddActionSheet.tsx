import { useNavigate } from "react-router";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/app/components/ui/drawer";
import { FilamentIcon } from "@/imports/filament-icon";
import { PartsIcon } from "@/imports/parts-icon";
import { ProjectsTabIcon } from "@/imports/projects-tab-icon";

interface AddActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const options = [
  {
    id: "filament",
    title: "Add filament",
    subtitle: "Add a new filament spool to your inventory",
    icon: FilamentIcon,
    iconBg: "bg-[#F26D00]",
    iconColor: "text-white",
    action: (navigate: (to: string, opts?: { state?: object }) => void) => {
      navigate("/filaments", { state: { openAdd: true } });
    },
  },
  {
    id: "part",
    title: "Add part",
    subtitle: "Log a new printed part",
    icon: PartsIcon,
    iconBg: "bg-[#3B82F6]",
    iconColor: "text-white",
    action: (navigate: (to: string, opts?: { state?: object }) => void) => {
      navigate("/parts", { state: { openAdd: true } });
    },
  },
  {
    id: "project",
    title: "Add project",
    subtitle: "Create a project to group printed parts",
    icon: ProjectsTabIcon,
    iconBg: "bg-[#8B5CF6]",
    iconColor: "text-white",
    action: (navigate: (to: string, opts?: { state?: object }) => void) => {
      navigate("/parts", { state: { openProjectDialog: true } });
    },
  },
];

export function AddActionSheet({ open, onOpenChange }: AddActionSheetProps) {
  const navigate = useNavigate();

  const handleSelect = (action: (navigate: (to: string, opts?: { state?: object }) => void) => void) => {
    onOpenChange(false);
    action(navigate);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[70vh] rounded-t-2xl border-t border-[#F26D00]/20 bg-white [&>div:first-child]:!h-1.5 [&>div:first-child]:!w-9 [&>div:first-child]:!mt-3 [&>div:first-child]:!min-h-0">
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-lg text-gray-900">Add new</DrawerTitle>
          <DrawerDescription className="text-sm text-gray-500">
            Choose what you want to add
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-6">
          <ul className="space-y-1">
            {options.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.action)}
                    className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                    >
                      <Icon className={`h-6 w-6 ${item.iconColor}`} active />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
