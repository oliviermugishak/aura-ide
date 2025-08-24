import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, Code, Settings, FileText, Zap, Copy, Download } from 'lucide-react';

// Simple markdown parser for basic syntax
const parseMarkdown = (text) => {
  let html = text
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-cyan-300 mb-3 mt-6 border-l-2 border-cyan-500 pl-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-cyan-200 mb-4 mt-8 border-l-3 border-cyan-400 pl-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-6 mt-8 border-l-4 border-cyan-300 pl-4">$1</h1>')
    
    // Code blocks with syntax highlighting
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text';
      return `<div class="code-block-container my-6">
        <div class="code-header bg-gray-800/50 px-4 py-2 text-xs text-cyan-400 border-b border-cyan-500/20 font-mono">
          ${language}
        </div>
        <pre class="code-block bg-gray-900/80 p-4 rounded-b-lg border border-cyan-500/20 overflow-x-auto">
          <code class="language-${language} text-green-300 font-mono text-sm">${code.trim()}</code>
        </pre>
      </div>`;
    })
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-800/60 text-cyan-300 px-2 py-1 rounded font-mono text-sm border border-cyan-500/30">$1</code>')
    
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-white"><em class="italic">$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50 hover:decoration-cyan-400 transition-colors">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div class="my-4"><img src="$2" alt="$1" class="max-w-full h-auto rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10" /></div>')
    
    // Lists
    .replace(/^\s*\* (.+)$/gm, '<li class="text-gray-300 mb-2 pl-2">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul class="list-disc list-inside ml-4 mb-4 space-y-1">$1</ul>')
    
    // Numbered lists
    .replace(/^\s*\d+\. (.+)$/gm, '<li class="text-gray-300 mb-2 pl-2">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ol class="list-decimal list-inside ml-4 mb-4 space-y-1">$1</ol>')
    
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-gray-800/30 text-gray-300 italic">$1</blockquote>')
    
    // Tables (basic)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(cell => cell.trim()).map(cell => 
        `<td class="border border-cyan-500/30 px-3 py-2 text-gray-300">${cell.trim()}</td>`
      ).join('');
      return `<tr>${cells}</tr>`;
    })
    
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="border-cyan-500/30 my-8" />')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="text-gray-300 mb-4 leading-relaxed">')
    .replace(/^(?!<[hou])(.+)$/gm, '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>');

  return html;
};

const FuturisticMarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to the Future of Markdown

This is a **futuristic robotic-themed** Markdown editor with real-time preview capabilities.

## Features

* **Real-time preview** with glassmorphic design
* **Syntax highlighting** for code blocks
* **Resizable panels** for optimal workflow
* **Dark theme** with cyan accents

## Code Example

\`\`\`javascript
const greetUser = (name) => {
  console.log(\`Hello, \${name}! Welcome to the future.\`);
  return \`Greetings processed successfully\`;
};

greetUser("Developer");
\`\`\`

## Interactive Elements

Here's some \`inline code\` and a [link to the future](https://example.com).

> "The future belongs to those who prepare for it today." - Robotic wisdom

### Table Example

| Feature | Status | Priority |
|---------|---------|----------|
| Editor | ✅ Active | High |
| Preview | ✅ Active | High |
| Themes | 🔄 WIP | Medium |

---

*Start typing to see the magic happen...*`);

  const [panelWidth, setPanelWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setPanelWidth(Math.max(20, Math.min(80, newWidth)));
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(34,197,94,0.05),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Nexus Editor
              </h1>
              <p className="text-xs text-gray-400">Robotic Markdown Interface v2.1</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={copyToClipboard}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            </button>
            <button 
              onClick={downloadMarkdown}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
              title="Download markdown"
            >
              <Download className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 group"
            >
              <Settings className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div 
        ref={containerRef}
        className="relative z-10 flex h-[calc(100vh-80px)] overflow-hidden"
      >
        {/* Editor Panel */}
        <div 
          className="relative bg-gray-900/60 backdrop-blur-sm border-r border-cyan-500/30"
          style={{ width: `${panelWidth}%` }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800/40 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Editor</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {markdown.length} chars
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full resize-none bg-transparent text-gray-300 p-6 font-mono text-sm leading-relaxed focus:outline-none selection:bg-cyan-500/20 placeholder-gray-500"
            placeholder="# Start typing your markdown here..."
            spellCheck="false"
          />
        </div>

        {/* Resizer */}
        <div
          className="w-1 bg-cyan-500/50 hover:bg-cyan-400 cursor-col-resize transition-colors duration-200 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-8 bg-cyan-400 rounded-full"></div>
          </div>
        </div>

        {/* Preview Panel */}
        <div 
          className="relative bg-gray-900/40 backdrop-blur-sm flex-1 flex flex-col"
          style={{ width: `${100 - panelWidth}%` }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800/40 border-b border-cyan-500/20">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Preview</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              Live Rendering
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-cyan-300">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Editor Width</label>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={panelWidth}
                  onChange={(e) => setPanelWidth(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="text-xs text-gray-400 mt-1">{panelWidth}%</div>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <div className="text-xs text-gray-400">
                  Nexus Editor v2.1 • Built for the future
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuturisticMarkdownEditor;