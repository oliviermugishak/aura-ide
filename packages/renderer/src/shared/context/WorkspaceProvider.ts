import React, { createContext, useContext } from "react";
import type { FileSystemContextValue } from "./FileSystemProvider";
import { useWorkspaceManager } from "../hooks/useWorkspaceManager";
import type { TextDocument } from "../types/file.types";

interface WorkspaceProviderProps {
  children: React.ReactNode;
}

export interface WorkspaceContextValue {
  workspace: Workspace;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  openTextDocument: (doc: TextDocument) => void;
}

export interface Workspace {
  fs: FileSystemContextValue;
}

export class DefaultWorkspace implements Workspace {
  static instance: DefaultWorkspace | null = null;
  fs: FileSystemContextValue;

  constructor(fs: FileSystemContextValue) {
    this.fs = fs;
  }

  static getInstance(fs: FileSystemContextValue): Workspace {
    if (!DefaultWorkspace.instance)
      DefaultWorkspace.instance = new DefaultWorkspace(fs);

    return DefaultWorkspace.instance;
  }
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const wm = useWorkspaceManager();

  return React.createElement(
    WorkspaceContext.Provider,
    {
      value: wm,
    },
    children
  );
};

export const useWorkspace = (): WorkspaceContextValue => {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspace must be used withing a WorkspaceProvider");
  return context;
};
