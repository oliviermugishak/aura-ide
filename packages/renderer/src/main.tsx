import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FileSystemProvider } from "./shared/context/FileSystemProvider.ts";

import "./index.css";
import App from "./App.tsx";
import { WorkspaceProvider } from "./shared/context/WorkspaceProvider.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileSystemProvider>
      <WorkspaceProvider>
        <App />
      </WorkspaceProvider>
    </FileSystemProvider>
  </StrictMode>
);
