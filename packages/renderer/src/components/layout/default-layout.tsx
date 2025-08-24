import { useFileSystem } from "@/shared/context/FileSystemProvider";
import Editor from "../core/editor";
import { FileTreeExplorer } from "../core/tree-explorer";

export default function DefaultEditorLayout() {
  const { fileTree } = useFileSystem();
  return (
    <div className="flex flex-row h-screen w-full overflow-hidden">
      {/* Editor */}
      <div className="w-full ">
        <Editor />
      </div>
      {/* File Tree Explorer */}
      <div className="max-w-md w-full text-white overflow-y-auto">
        <div className="p-2 border-b border-indigo-900">
          <h3 className="text-neutral-400">EXPLORER</h3>
        </div>
        <FileTreeExplorer fileTree={fileTree} />
      </div>
    </div>
  );
}
