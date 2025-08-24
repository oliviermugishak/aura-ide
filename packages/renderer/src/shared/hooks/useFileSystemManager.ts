// useFileSystemManager.ts
import { useState, useCallback } from "react";
import type { FileTreeEntry } from "../types/fileTree.types";
import type { FileSystemContextValue } from "../context/FileSystemProvider";
/**
 *
 * Custom hook to manage file system operations using the File System Access API.
 * Provides methods to open a folder, read/write files, create files, and delete entries.
 *
 */
export function useFileSystemManager(): FileSystemContextValue {
  // State to hold the root directory handle and file tree
  const [rootHandle, setRootHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  // The file tree structure
  const [fileTree, setFileTree] = useState<FileTreeEntry[]>([]);

  /**
   * Reads the contents of a directory handle and returns a structured file tree.
   * @param dirHandle The directory handle to read.
   * @returns A promise that resolves to an array of FileTreeEntry objects representing the directory's contents.
   */
  const readDirectory = useCallback(
    async (dirHandle: FileSystemDirectoryHandle): Promise<FileTreeEntry[]> => {
      // Array to hold the entries
      const entries: FileTreeEntry[] = [];

      // Iterate over each entry in the directory
      for await (const [name, handle] of dirHandle.entries()) {
        // Check if the handle is a file or directory and process accordingly

        if (handle.kind === "file") {
          // Add the file entry
          entries.push({
            id: crypto.randomUUID(),
            name,
            kind: "file",
            handle: handle as FileSystemFileHandle,
          });
        } else if (handle.kind === "directory") {
          // Recursively read subdirectories
          const children = await readDirectory(
            handle as FileSystemDirectoryHandle
          );
          // Add the directory entry with its children
          entries.push({
            name,
            kind: "directory",
            handle: handle as FileSystemDirectoryHandle,
            children,
          });
        }
      }
      return entries;
    },
    []
  );

  /**
   *
   * Reads through the handle and open it as folder in workspace
   * @returns A promise that resolves when the folder is opened and read.
   */

  const openFolder = async (handle: FileSystemDirectoryHandle) => {
    try {
      setRootHandle(handle);
      // Build the file tree
      // TODO: Optimize the read directory to be even faster for large dirs
      const tree = await readDirectory(handle);
      // Update the file tree state
      setFileTree(tree);
    } catch (err) {
      console.error("Folder access cancelled or failed", err);
    }
  };

  // TODO: Add documentations
  const openFiles = async (handle: FileSystemFileHandle) => {
    try {
      const content = await readFile(handle);

      // TODO: Implement the logic for opening files, in the editor
      console.log("File content:", content);
    } catch (err) {
      console.error("File access cancelled or failed:", err);
    }
  };

  const readFile = async (
    fileHandle: FileSystemFileHandle
  ): Promise<string> => {
    try {
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (err) {
      console.error("Failed to read file:", err);
      throw new Error("Failed to read file");
    }
  };

  const writeFile = async (
    fileHandle: FileSystemFileHandle,
    content: string | Blob
  ): Promise<void> => {
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    } catch (err) {
      console.error("Failed to write file:", err);
      throw new Error("Failed to write file");
    }
  };

  // TODO: Add these enteries to FileSystemManager Context
  // TODO: Uncomment these
  // const createFile = async (
  //   dirHandle: FileSystemDirectoryHandle,
  //   name: string
  // ): Promise<FileSystemFileHandle> => {
  //   try {
  //     return await dirHandle.getFileHandle(name, { create: true });
  //   } catch (err) {
  //     console.error("Failed to create file:", err);
  //     throw new Error("Failed to create file");
  //   }
  // };

  // const deleteEntry = async (
  //   dirHandle: FileSystemDirectoryHandle,
  //   name: string
  // ): Promise<void> => {
  //   try {
  //     await dirHandle.removeEntry(name, { recursive: true });
  //   } catch (err) {
  //     console.error("Failed to delete entry:", err);
  //     throw new Error("Failed to delete entry");
  //   }
  // };

  return {
    rootHandle,
    fileTree,
    openFolder,
    openFiles,
    readFile,
    writeFile,
    // createFile,
    // deleteEntry,
  };
}
