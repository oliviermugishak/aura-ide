import type { NavItem } from "@/shared/types/ui.types";

export const navItems: NavItem[] = [
  {
    title: "File",
    dropdown: [
      {
        title: "Open Folder",
        action: "OPEN_DIR",
      },
      {
        title: "New File",
        action: "SAVE_FILE",
      },
      {
        title: "Open File...",
        action: "OPEN_FILES",
      },
    ],
  },
  {
    title: "Edit",
  },
];
