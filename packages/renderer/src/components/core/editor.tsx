import MonacoEditor from "react-monaco-editor";

export default function Editor() {
  return (
    <MonacoEditor
      width="100%"
      height="100%"
      language="javascript"
      theme="vs-dark"
      value="// Start coding..."
      options={{
        selectOnLineNumbers: true,
      }}
      className={".main-monaco-editor"}
    />
  );
}
