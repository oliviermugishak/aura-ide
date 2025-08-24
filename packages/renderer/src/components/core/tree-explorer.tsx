import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Code,
  FileText,
  Image,
  Settings,
  Package,
  FileCode,
  Globe,
  Palette,
  Star,
  Zap,
} from "lucide-react";

// Types
export interface FileEntry {
  id: string;
  name: string;
  kind: "file";
  handle: FileSystemFileHandle;
}

export interface DirectoryEntry {
  name: string;
  kind: "directory";
  handle: FileSystemDirectoryHandle;
  children: FileTreeEntry[];
}

export type FileTreeEntry = FileEntry | DirectoryEntry;

interface FileTreeProps {
  fileTree: FileTreeEntry[];
}

interface TreeItemProps {
  entry: FileTreeEntry;
  level: number;
  onOpenFile: (entry: FileEntry) => void;
  currentFileId?: string;
}

// Icon mapping function with more specific icons
const getFileIcon = (
  fileName: string
): React.ComponentType<{ className?: string; size?: number }> => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const name = fileName.toLowerCase();

  // Special files
  if (name === "package.json" || name === "package-lock.json") return Package;
  if (name === "angular.json") return Zap;
  if (name === "tsconfig.json") return Settings;
  if (name === "favicon.ico") return Star;
  if (name.includes("index.html")) return Globe;
  if (name.includes("main.ts")) return Zap;
  if (name.includes("polyfill")) return Code;
  if (name.includes("styles.css")) return Palette;

  // Extensions
  switch (extension) {
    case "ts":
      return Code;
    case "js":
      return Code;
    case "html":
      return Globe;
    case "css":
      return Palette;
    case "json":
      return Settings;
    case "md":
      return FileText;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return Image;
    case "spec":
      return FileCode;
    default:
      return File;
  }
};

// Futuristic color scheme with neon accents
const getFileIconColor = (
  fileName: string,
  isActive: boolean = false
): string => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const name = fileName.toLowerCase();

  if (isActive)
    return "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]";

  // Special files with neon colors
  if (name === "package.json" || name === "package-lock.json")
    return "text-emerald-400";
  if (name === "angular.json")
    return "text-red-400 drop-shadow-[0_0_4px_rgba(248,113,113,0.5)]";
  if (name === "tsconfig.json")
    return "text-blue-400 drop-shadow-[0_0_4px_rgba(96,165,250,0.3)]";
  if (name === "favicon.ico")
    return "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]";
  if (name.includes("index.html"))
    return "text-orange-400 drop-shadow-[0_0_4px_rgba(251,146,60,0.4)]";
  if (name.includes("main.ts"))
    return "text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.4)]";
  if (name.includes("polyfill")) return "text-indigo-400";
  if (name.includes("styles.css"))
    return "text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.3)]";

  // Extensions
  switch (extension) {
    case "ts":
      return "text-blue-400 drop-shadow-[0_0_3px_rgba(96,165,250,0.3)]";
    case "js":
      return "text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.3)]";
    case "html":
      return "text-orange-400 drop-shadow-[0_0_3px_rgba(251,146,60,0.3)]";
    case "css":
      return "text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.3)]";
    case "json":
      return "text-amber-400";
    case "md":
      return "text-slate-400";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return "text-pink-400 drop-shadow-[0_0_3px_rgba(244,114,182,0.3)]";
    case "spec":
      return "text-teal-400";
    default:
      return "text-slate-300";
  }
};

// Tree item component with futuristic styling
const TreeItem: React.FC<TreeItemProps> = ({
  entry,
  level,
  onOpenFile,
  currentFileId,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const paddingLeft = `${level * 20 + 12}px`;
  const isActive = entry.kind === "file" && entry.id === currentFileId;

  const handleClick = (): void => {
    if (entry.kind === "directory") {
      setIsExpanded(!isExpanded);
    } else {
      onOpenFile(entry);
    }
  };

  const IconComponent = useMemo(() => {
    if (entry.kind === "directory") {
      return isExpanded ? FolderOpen : Folder;
    }
    return getFileIcon(entry.name);
  }, [entry.kind, entry.name, isExpanded]);

  const iconColor = useMemo(() => {
    if (entry.kind === "directory") {
      if (isHovered)
        return "text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]";
      return isExpanded ? "text-blue-300" : "text-slate-400";
    }
    return getFileIconColor(entry.name, isActive);
  }, [entry.kind, entry.name, isExpanded, isActive, isHovered]);

  return (
    <>
      <div
        className={`
          relative flex items-center py-1.5 cursor-pointer text-sm transition-all duration-200 ease-out
          ${
            isActive
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-100 shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]"
              : isHovered
              ? "bg-gradient-to-r from-slate-700/50 to-slate-600/30 text-slate-100"
              : "text-slate-300"
          }
          ${
            entry.kind === "directory"
              ? "hover:text-cyan-200"
              : "hover:text-slate-100"
          }
        `}
        style={{ paddingLeft }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Active file indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
        )}

        {/* Hover glow effect */}
        {isHovered && !isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-400/50 to-slate-500/30" />
        )}

        {entry.kind === "directory" && (
          <span
            className={`mr-2 transition-all duration-200 ${
              isHovered ? "text-cyan-400" : "text-slate-400"
            }`}
          >
            {isExpanded ? (
              <ChevronDown size={14} className="drop-shadow-sm" />
            ) : (
              <ChevronRight size={14} className="drop-shadow-sm" />
            )}
          </span>
        )}
        {entry.kind === "file" && <span className="mr-2 w-3.5" />}

        <IconComponent
          size={16}
          className={`mr-3 transition-all duration-200 ${iconColor}`}
        />

        <span
          className={`
          truncate font-medium transition-all duration-200
          ${isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""}
          ${isHovered && !isActive ? "drop-shadow-sm" : ""}
        `}
        >
          {entry.name}
        </span>

        {/* Subtle scan line effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
        )}
      </div>

      {entry.kind === "directory" && isExpanded && (
        <div className="relative">
          {/* Connecting lines for nested structure */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-slate-600/50 to-transparent"
            style={{ left: `${level * 20 + 24}px` }}
          />
          {entry.children.map((child: FileTreeEntry, index: number) => (
            <TreeItem
              key={`${child.name}-${index}`}
              entry={child}
              level={level + 1}
              onOpenFile={onOpenFile}
              currentFileId={currentFileId}
            />
          ))}
        </div>
      )}
    </>
  );
};

// File tree explorer component
export const FileTreeExplorer: React.FC<FileTreeProps> = ({ fileTree }) => {
  const [currentFileId, setCurrentFileId] = useState<string>("4"); // Demo: app.component.ts is selected

  const handleOpenFile = (entry: FileEntry): void => {
    setCurrentFileId(entry.id);
    // Placeholder function - implement your file opening logic here
    console.log("Opening file:", entry.name);
  };

  return (
    <div className="text-slate-200 font-mono text-sm min-h-screen border-r border-slate-800/50 relative overflow-hidden">
      {/* Background ambient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-blue-950/10 pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 py-3">
        {fileTree.map((entry: FileTreeEntry, index: number) => (
          <TreeItem
            key={`${entry.name}-${index}`}
            entry={entry}
            level={0}
            onOpenFile={handleOpenFile}
            currentFileId={currentFileId}
          />
        ))}
      </div>

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />
    </div>
  );
};
