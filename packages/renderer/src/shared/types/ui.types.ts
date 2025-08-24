export type GlobalActions =
  | "OPEN_DIR"
  | "SAVE_FILE"
  | "NEW_FILE"
  | "OPEN_FILES";

export interface NavItem {
  title: string;
  action?: GlobalActions;
  dropdown?: NavItem[];
}
