import React, { useState, useCallback, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileText,
  Image,
  Music,
  Video,
  Archive,
  Code,
  Database,
  Settings,
  FileCode,
  Globe,
  Palette,
  Coffee,
  Hash,
  Layers,
  Box,
  Terminal,
  BookOpen,
  Lock,
} from "lucide-react";

// File type to icon mapping
const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();

  const iconMap = {
    // Images
    jpg: Image,
    jpeg: Image,
    png: Image,
    gif: Image,
    svg: Image,
    webp: Image,
    ico: Image,
    // Documents
    txt: FileText,
    md: BookOpen,
    pdf: FileText,
    doc: FileText,
    docx: FileText,
    // Code files
    js: FileCode,
    jsx: FileCode,
    ts: FileCode,
    tsx: FileCode,
    vue: FileCode,
    html: Globe,
    css: Palette,
    scss: Palette,
    sass: Palette,
    less: Palette,
    json: Settings,
    xml: Code,
    yaml: Settings,
    yml: Settings,
    py: Code,
    java: Coffee,
    cpp: Code,
    c: Code,
    h: Code,
    cs: Code,
    php: Code,
    rb: Code,
    go: Code,
    rs: Code,
    swift: Code,
    kt: Code,
    // Archives
    zip: Archive,
    rar: Archive,
    tar: Archive,
    gz: Archive,
    "7z": Archive,
    // Media
    mp3: Music,
    wav: Music,
    flac: Music,
    aac: Music,
    ogg: Music,
    mp4: Video,
    avi: Video,
    mkv: Video,
    mov: Video,
    wmv: Video,
    // Data
    sql: Database,
    db: Database,
    sqlite: Database,
    csv: Database,
    excel: Database,
    xls: Database,
    xlsx: Database,
    // Config
    env: Settings,
    config: Settings,
    ini: Settings,
    conf: Settings,
    // Other
    sh: Terminal,
    bat: Terminal,
    ps1: Terminal,
    package: Box,
    lock: Lock,
    gitignore: Settings,
    dockerfile: Box,
    docker: Box,
    // Markup
    tex: FileText,
    rtf: FileText,
  };

  return iconMap[ext] || File;
};

const FileTreeNode = ({
  entry,
  depth = 0,
  onFileClick,
  onDirectoryToggle,
  expandedDirs,
}) => {
  const isDirectory = entry.kind === "directory";
  const isExpanded = expandedDirs.has(entry.handle);
  const Icon = isDirectory
    ? isExpanded
      ? FolderOpen
      : Folder
    : getFileIcon(entry.name);

  // Create ASCII hierarchy visualization
  const createHierarchy = (depth: number) => {
    if (depth === 0) return "";

    let hierarchy = "";
    for (let i = 0; i < depth - 1; i++) {
      hierarchy += "│   ";
    }
    hierarchy += "├── ";
    return hierarchy;
  };

  const handleClick = useCallback(() => {
    if (isDirectory) {
      onDirectoryToggle(entry);
    } else {
      onFileClick(entry);
    }
  }, [isDirectory, entry, onDirectoryToggle, onFileClick]);

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150 group ${
          !isDirectory ? "hover:bg-blue-900/30" : ""
        }`}
        onClick={handleClick}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* ASCII hierarchy for visual depth */}
        <span className="text-gray-500 font-mono text-xs mr-1 select-none">
          {createHierarchy(depth)}
        </span>

        {/* Chevron for directories */}
        {isDirectory && (
          <div className="w-4 h-4 mr-1 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-400" />
            ) : (
              <ChevronRight size={14} className="text-gray-400" />
            )}
          </div>
        )}

        {/* File/Folder icon */}
        <Icon
          size={16}
          className={`mr-2 ${
            isDirectory
              ? isExpanded
                ? "text-blue-400"
                : "text-yellow-500"
              : "text-gray-300"
          }`}
        />

        {/* File/Folder name */}
        <span
          className={`text-sm truncate ${
            isDirectory
              ? "text-white font-medium"
              : "text-gray-200 group-hover:text-white"
          }`}
        >
          {entry.name}
        </span>

        {/* File count for directories */}
        {isDirectory && entry.children && (
          <span className="ml-auto text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {entry.children.length}
          </span>
        )}
      </div>

      {/* Render children if directory is expanded */}
      {isDirectory && isExpanded && entry.children && (
        <div>
          {entry.children.map((child, index) => (
            <FileTreeNode
              key={`${child.name}-${index}`}
              entry={child}
              depth={depth + 1}
              onFileClick={onFileClick}
              onDirectoryToggle={onDirectoryToggle}
              expandedDirs={expandedDirs}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTreeExplorer = () => {
  const [expandedDirs, setExpandedDirs] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock file tree data for demonstration
  const mockFileTree = useMemo(
    () => [
      {
        name: "src",
        kind: "directory",
        handle: { name: "src" },
        children: [
          {
            name: "components",
            kind: "directory",
            handle: { name: "components" },
            children: [
              { name: "App.tsx", kind: "file", handle: { name: "App.tsx" } },
              {
                name: "Header.jsx",
                kind: "file",
                handle: { name: "Header.jsx" },
              },
              {
                name: "Sidebar.vue",
                kind: "file",
                handle: { name: "Sidebar.vue" },
              },
            ],
          },
          {
            name: "assets",
            kind: "directory",
            handle: { name: "assets" },
            children: [
              { name: "logo.svg", kind: "file", handle: { name: "logo.svg" } },
              {
                name: "background.jpg",
                kind: "file",
                handle: { name: "background.jpg" },
              },
              {
                name: "styles.css",
                kind: "file",
                handle: { name: "styles.css" },
              },
            ],
          },
          { name: "index.ts", kind: "file", handle: { name: "index.ts" } },
          { name: "utils.js", kind: "file", handle: { name: "utils.js" } },
        ],
      },
      {
        name: "docs",
        kind: "directory",
        handle: { name: "docs" },
        children: [
          { name: "README.md", kind: "file", handle: { name: "README.md" } },
          {
            name: "CHANGELOG.md",
            kind: "file",
            handle: { name: "CHANGELOG.md" },
          },
          { name: "API.pdf", kind: "file", handle: { name: "API.pdf" } },
        ],
      },
      { name: "package.json", kind: "file", handle: { name: "package.json" } },
      {
        name: "tsconfig.json",
        kind: "file",
        handle: { name: "tsconfig.json" },
      },
      { name: ".gitignore", kind: "file", handle: { name: ".gitignore" } },
      {
        name: "docker-compose.yml",
        kind: "file",
        handle: { name: "docker-compose.yml" },
      },
    ],
    []
  );

  const handleDirectoryToggle = useCallback((entry) => {
    setExpandedDirs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entry.handle)) {
        newSet.delete(entry.handle);
      } else {
        newSet.add(entry.handle);
      }
      return newSet;
    });
  }, []);

  const handleFileClick = useCallback(async (entry) => {
    setSelectedFile(entry);

    try {
      // In a real implementation, you would read the file content
      // const file = await entry.handle.getFile();
      // const content = await file.text();
      console.log("Opening file:", entry.name);

      // You could emit an event or call a callback here
    } catch (error) {
      console.error("Error opening file:", error);
    }
  }, []);

  // Filter function for search
  const filterTree = (entries, searchTerm) => {
    if (!searchTerm) return entries;

    return entries
      .filter((entry) => {
        if (entry.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        if (entry.kind === "directory" && entry.children) {
          const filteredChildren = filterTree(entry.children, searchTerm);
          return filteredChildren.length > 0;
        }
        return false;
      })
      .map((entry) => {
        if (entry.kind === "directory" && entry.children) {
          return {
            ...entry,
            children: filterTree(entry.children, searchTerm),
          };
        }
        return entry;
      });
  };

  const filteredTree = useMemo(
    () => filterTree(mockFileTree, searchTerm),
    [mockFileTree, searchTerm]
  );

  const collapseAll = () => setExpandedDirs(new Set());
  const expandAll = () => {
    const allDirs = new Set();
    const collectDirs = (entries) => {
      entries.forEach((entry) => {
        if (entry.kind === "directory") {
          allDirs.add(entry.handle);
          if (entry.children) collectDirs(entry.children);
        }
      });
    };
    collectDirs(mockFileTree);
    setExpandedDirs(allDirs);
  };

  return (
    <div className="bg-gray-900 text-white h-screen w-80 flex flex-col border-r border-gray-700">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wide">
            Explorer
          </h2>
          <div className="flex gap-1">
            <button
              onClick={collapseAll}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Collapse All"
            >
              <ChevronRight size={14} className="text-gray-400" />
            </button>
            <button
              onClick={expandAll}
              className="p-1 rounded hover:bg-gray-600 transition-colors"
              title="Expand All"
            >
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
        />
      </div>

      {/* File tree */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="py-1">
          {filteredTree.map((entry, index) => (
            <FileTreeNode
              key={`${entry.name}-${index}`}
              entry={entry}
              depth={0}
              onFileClick={handleFileClick}
              onDirectoryToggle={handleDirectoryToggle}
              expandedDirs={expandedDirs}
            />
          ))}
        </div>
      </div>

      {/* Status bar */}
      {selectedFile && (
        <div className="p-2 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <File size={12} />
            <span className="truncate">{selectedFile.name}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default FileTreeExplorer;
