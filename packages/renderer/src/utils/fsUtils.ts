// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export function detectEOL(text: string): "\n" | "\r\n" {
  const idx = text.indexOf("\n");
  if (idx === -1) return "\n";
  return text[idx - 1] === "\r" ? "\r\n" : "\n";
}

export function countLines(text: string, eol: "\n" | "\r\n"): number {
  if (!text) return 1;
  // Normalize to '\n' for counting
  const normalized = eol === "\r\n" ? text.replace(/\r\n/g, "\n") : text;
  return normalized.split("\n").length;
}

export function inferLanguageId(name: string): string {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  const map: Record<string, string> = {
    txt: "plaintext",
    md: "markdown",
    js: "javascript",
    ts: "typescript",
    jsx: "javascriptreact",
    tsx: "typescriptreact",
    json: "json",
    css: "css",
    html: "html",
    vue: "vue",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    yml: "yaml",
    yaml: "yaml",
    toml: "toml",
    xml: "xml",
    sh: "shellscript",
  };
  return map[ext] ?? "plaintext";
}

export async function hasWritePermission(handle: FileSystemFileHandle) {
  const q = await handle.queryPermission({ mode: "readwrite" });
  if (q === "granted") return true;
  const r = await handle.requestPermission({ mode: "readwrite" });
  return r === "granted";
}

export async function hasReadPermission(handle: FileSystemFileHandle) {
  const q = await handle.queryPermission({ mode: "read" });
  if (q === "granted") return true;
  const r = await handle.requestPermission({ mode: "read" });
  return r === "granted";
}

export function virtualUriFromHandle(handle: FileSystemFileHandle) {
  // Browser doesn’t reveal real paths; create a stable virtual URI
  return `filehandle://${encodeURIComponent(handle.name)}`;
}
