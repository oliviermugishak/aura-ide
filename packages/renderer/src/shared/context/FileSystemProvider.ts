import React, { createContext, useContext } from "react";
import { useFileSystemManager } from "../hooks/useFileSystemManager";
import type { FileTreeEntry } from "@/shared/types/fileTree.types";

// Define the shape of the context value (you can refine this based on your manager)
export interface FileSystemContextValue {
  // Example methods and properties—adjust to match your actual manager
  rootHandle: FileSystemDirectoryHandle | null;
  fileTree: FileTreeEntry[];
  openFolder: (handle: FileSystemDirectoryHandle) => Promise<void>;
  openFiles: (handle: FileSystemFileHandle) => Promise<void>;
  readFile: (handle: FileSystemFileHandle) => Promise<string>;
  writeFile: (handle: FileSystemFileHandle, content: string) => Promise<void>;
}

// Create the context
const FileSystemContext = createContext<FileSystemContextValue | null>(null);

// Props interface for the provider
interface FileSystemProviderProps {
  children: React.ReactNode;
}

// Provider component
export const FileSystemProvider = ({ children }: FileSystemProviderProps) => {
  const fs = useFileSystemManager();

  return React.createElement(
    FileSystemContext.Provider,
    { value: fs },
    children
  );
};

// Custom hook to consume the context
export const useFileSystem = (): FileSystemContextValue => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within a FileSystemProvider");
  }
  return context;
};
