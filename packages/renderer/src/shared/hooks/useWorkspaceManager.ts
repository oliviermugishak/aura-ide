import { useState } from "react";
import { useFileSystem } from "../context/FileSystemProvider";
import { DefaultWorkspace } from "../context/WorkspaceProvider";
import type { WorkspaceContextValue } from "../context/WorkspaceProvider";
import type { TextDocument } from "../types/file.types";

export function useWorkspaceManager(): WorkspaceContextValue {
  const [isLoading, setIsLoading] = useState(false);

  const workspace = DefaultWorkspace.getInstance(useFileSystem());

  const openTextDocument = (doc: TextDocument) => {
    // TODO: Implement document opening and display its content inside the editor
    console.log(doc.content);
  };

  return {
    workspace,
    isLoading,
    setIsLoading,
    openTextDocument,
  };
}
