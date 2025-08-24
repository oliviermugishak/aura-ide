/**
 *
 * Hook to handle file operations.
 *
 */
export const useFileHandler = () => {
  /**
   * Opens a directory picker and passes the selected directory handle to the provided callback function.
   * @param fn Callback function to handle the selected directory.
   */
  const openDirectoryPicker = async (
    fn: (handle: FileSystemDirectoryHandle) => void
  ) => {
    try {
      if (window) {
        // Use browser API to open the directory picker
        const newRootHandle = await window.showDirectoryPicker();
        // Call the callback function that handles the directory
        // In this app our openFolder() function is called
        await fn(newRootHandle);
      } else {
        throw new Error("No directory picker available in this environment.");
      }
    } catch (err) {
      console.error("Directory selection cancelled or failed:", err);
    }
  };

  /**
   * Opens a file picker and passes the selected file handle to the provided callback function.
   * @param fn Callback function to handle the selected file.
   */
  const openFilePicker = async (fn: (handle: FileSystemFileHandle) => void) => {
    try {
      if (window) {
        // Get all file entries
        const entries = await window.showOpenFilePicker();

        // Open a single file
        // await fn(entries[0]);

        // Open multiple files
        for await (const entry of entries) {
          await fn(entry);
        }
      } else {
        throw new Error("No file picker available in this environment.");
      }
    } catch (err) {
      console.error("File selection cancelled or failed:", err);
    }
  };

  return { openDirectoryPicker, openFilePicker };
};
