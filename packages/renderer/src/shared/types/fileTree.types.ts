export interface FileEntry {
  id: string; // to be added just a generated id
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
