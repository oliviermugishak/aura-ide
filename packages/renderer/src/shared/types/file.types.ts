export type EndOfLine = "\n" | "\r\n";

export interface TextDocument {
  // Identity
  id: string; // Stable in-memory id
  uri: string; // Virtual URI (no true path in browser)
  name: string; // fileHandle.name
  languageId: string; // derived from extension
  handle: FileSystemFileHandle; // original handle

  // Content + meta
  content: string;
  eol: EndOfLine;
  lineCount: number;
  encoding: "utf-8";

  // Versioning + state
  version: number; // increments on content changes
  isDirty: boolean;
  isReadOnly: boolean;

  // File stats
  size: number; // bytes
  lastModified: number; // epoch ms (File.lastModified)

  // Optional editor/UI state
  selection?: { start: number; end: number };
}
