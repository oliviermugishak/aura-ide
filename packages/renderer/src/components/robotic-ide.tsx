import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Settings, Play, Save, Search, Terminal, GitBranch, Bell, Menu, X, Maximize2, Minimize2, Minus } from 'lucide-react';

const RoboticIDE = () => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [activeFile, setActiveFile] = useState('main.js');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState({
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    accent: '#2d4356',
    glass: 'rgba(45, 67, 86, 0.1)',
    text: '#e0e6ed',
    textSecondary: '#a0a6ad'
  });

  const editorRef = useRef(null);
  const resizeRef = useRef(null);

  // Simulated file structure
  const [fileTree, setFileTree] = useState({
    'src': {
      type: 'folder',
      expanded: true,
      children: {
        'main.js': { type: 'file', content: '// Welcome to the Robotic IDE\nconsole.log("Initializing robotic systems...");' },
        'components': {
          type: 'folder',
          expanded: false,
          children: {
            'Robot.js': { type: 'file', content: 'class Robot {\n  constructor() {\n    this.status = "online";\n  }\n}' },
            'AI.ts': { type: 'file', content: 'interface AISystem {\n  learn(): void;\n  process(data: any): any;\n}' }
          }
        },
        'utils.py': { type: 'file', content: 'def initialize_robot():\n    """Initialize robot systems"""\n    pass' }
      }
    },
    'config': {
      type: 'folder',
      expanded: false,
      children: {
        'theme.json': { type: 'file', content: JSON.stringify(theme, null, 2) }
      }
    }
  });

  const [openFiles, setOpenFiles] = useState(['main.js']);
  const [fileContents, setFileContents] = useState({
    'main.js': '// Welcome to the Robotic IDE\n// Advanced AI-powered development environment\n\nclass RoboticSystem {\n  constructor() {\n    this.status = "initializing";\n    this.modules = [];\n  }\n\n  async initialize() {\n    console.log("🤖 Robotic IDE starting up...");\n    await this.loadModules();\n    this.status = "online";\n    return this;\n  }\n\n  loadModules() {\n    return new Promise(resolve => {\n      setTimeout(() => {\n        this.modules = ["AI", "Vision", "Motion", "Learning"];\n        console.log("✅ All modules loaded successfully");\n        resolve();\n      }, 1000);\n    });\n  }\n\n  execute(command) {\n    if (this.status !== "online") {\n      throw new Error("System not initialized");\n    }\n    console.log(`Executing: ${command}`);\n  }\n}\n\n// Initialize the robotic system\nconst robot = new RoboticSystem();\nrobot.initialize().then(() => {\n  robot.execute("Hello, World!");\n});'
  });

  // Mock Monaco Editor component since we can't import it directly
  const MonacoEditor = ({ value, onChange, language }) => (
    <div className="h-full bg-black/20 backdrop-blur-sm border border-white/5 rounded-lg overflow-hidden">
      <div className="h-8 bg-black/30 border-b border-white/10 flex items-center px-4">
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <div className="ml-auto flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
        </div>
      </div>
      <textarea
        className="w-full h-full bg-transparent text-gray-200 font-mono text-sm p-4 outline-none resize-none"
        style={{ minHeight: '400px' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop();
    switch (ext) {
      case 'js': return '🟨';
      case 'ts': return '🟦';
      case 'py': return '🐍';
      case 'java': return '☕';
      case 'json': return '📋';
      default: return '📄';
    }
  };

  const renderFileTree = (tree, path = '') => {
    return Object.entries(tree).map(([name, node]) => {
      const fullPath = path ? `${path}/${name}` : name;
      
      if (node.type === 'folder') {
        return (
          <div key={fullPath} className="select-none">
            <div 
              className="flex items-center py-1 px-2 hover:bg-white/5 cursor-pointer transition-all duration-200 group"
              onClick={() => {
                setFileTree(prev => ({
                  ...prev,
                  [name]: { ...node, expanded: !node.expanded }
                }));
              }}
            >
              {node.expanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500 mr-1 group-hover:text-blue-400 transition-colors" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500 mr-1 group-hover:text-blue-400 transition-colors" />
              }
              <Folder className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{name}</span>
            </div>
            {node.expanded && (
              <div className="ml-4 border-l border-white/10 pl-2">
                {renderFileTree(node.children, fullPath)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <div 
            key={fullPath}
            className={`flex items-center py-1 px-2 hover:bg-white/5 cursor-pointer transition-all duration-200 group ${
              activeFile === name ? 'bg-blue-500/20 border-r-2 border-blue-400' : ''
            }`}
            onClick={() => {
              setActiveFile(name);
              if (!openFiles.includes(name)) {
                setOpenFiles(prev => [...prev, name]);
              }
            }}
          >
            <span className="mr-2 text-sm">{getFileIcon(name)}</span>
            <span className={`text-sm transition-colors ${
              activeFile === name ? 'text-blue-200' : 'text-gray-300 group-hover:text-white'
            }`}>{name}</span>
          </div>
        );
      }
    });
  };

  const handleResize = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(200, Math.min(600, startWidth + (e.clientX - startX)));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Title Bar */}
      <div className="h-12 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <span className="font-semibold text-gray-200">Robotic IDE</span>
          </div>
          <div className="flex items-center space-x-1">
            {['File', 'Edit', 'View', 'Run', 'Terminal', 'Help'].map(item => (
              <button key={item} className="px-3 py-1 hover:bg-white/10 rounded transition-colors text-sm text-gray-300">
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
            <Minus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-red-500/20 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activity Bar */}
      <div className="flex h-full">
        <div className="w-12 bg-black/60 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-4 space-y-4">
          {[
            { icon: File, active: true },
            { icon: Search, active: false },
            { icon: GitBranch, active: false },
            { icon: Play, active: false },
            { icon: Terminal, active: false },
            { icon: Settings, active: false }
          ].map(({ icon: Icon, active }, i) => (
            <button 
              key={i}
              className={`p-2 rounded-lg transition-all duration-200 ${
                active 
                  ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Sidebar */}
        <div 
          className={`bg-black/40 backdrop-blur-md border-r border-white/10 transition-all duration-300 ${
            sidebarCollapsed ? 'w-0' : ''
          }`}
          style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
        >
          <div className="h-full overflow-hidden">
            <div className="h-10 bg-black/20 border-b border-white/10 flex items-center justify-between px-4">
              <span className="text-sm font-medium text-gray-300">EXPLORER</span>
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto h-full">
              {renderFileTree(fileTree)}
            </div>
          </div>
        </div>

        {/* Resize Handle */}
        {!sidebarCollapsed && (
          <div 
            ref={resizeRef}
            className="w-1 bg-transparent hover:bg-blue-500/50 cursor-col-resize transition-colors"
            onMouseDown={handleResize}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-10 bg-black/30 backdrop-blur-sm border-b border-white/10 flex items-center px-2">
            {openFiles.map(fileName => (
              <div 
                key={fileName}
                className={`flex items-center px-4 py-2 cursor-pointer transition-all duration-200 border-b-2 ${
                  activeFile === fileName 
                    ? 'bg-black/40 border-blue-400 text-blue-200' 
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
                onClick={() => setActiveFile(fileName)}
              >
                <span className="mr-2 text-sm">{getFileIcon(fileName)}</span>
                <span className="text-sm">{fileName}</span>
                <button 
                  className="ml-2 p-0.5 hover:bg-white/20 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFiles(prev => prev.filter(f => f !== fileName));
                    if (activeFile === fileName && openFiles.length > 1) {
                      setActiveFile(openFiles.find(f => f !== fileName));
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="flex-1 p-4">
            <MonacoEditor 
              value={fileContents[activeFile] || ''}
              onChange={(value) => setFileContents(prev => ({...prev, [activeFile]: value}))}
              language="javascript"
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-black/60 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-4 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>JavaScript</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Robotic Systems Online
          </span>
          <span>⚡ AI Assistant Ready</span>
        </div>
      </div>
    </div>
  );
};

export default RoboticIDE;