import { useFileSystem } from "../context/FileSystemProvider";
import { useFileHandler } from "./useFileHandler";
import type { GlobalActions } from "../types/ui.types";

// interface action mapper and the key
export type ActionMapper = {
  [K in GlobalActions]: () => void;
};

/**
 * Custom hook to map global action strings to their corresponding handler functions.
 * @returns {ActionMapper}
 */
export const useActionMapper = () => {
  const { openDirectoryPicker, openFilePicker } = useFileHandler();
  const { openFolder, openFiles } = useFileSystem();

  // TODO: Implement all the mapper functions
  const actionMapper: ActionMapper = {
    OPEN_DIR: () => openDirectoryPicker(openFolder),
    SAVE_FILE: () => {}, //saveFile(fn),
    NEW_FILE: () => {}, // createNewFile(fn),
    OPEN_FILES: () => openFilePicker(openFiles),
  };

  return actionMapper;
};
