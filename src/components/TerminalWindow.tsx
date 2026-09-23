import React, { useEffect, useRef } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';

export const TerminalWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const history = useTerminalStore((state) => state.history);

  // Auto-scroll to bottom directly, without smooth behavior for authentic terminal feel
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]); // Dep on history ensures scroll on new output

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0c] relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-[#1a2e20] border-b border-primary/20 px-4 py-2 select-none shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-[#ff5f56]"></div>
            <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="size-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="ml-4 flex items-center gap-2 text-primary/80">
            <span className="material-symbols-outlined text-sm font-mono">terminal</span>
            <h2 className="text-xs font-mono tracking-tight">guest@portfolio:~</h2>
          </div>
        </div>
        <div className="flex items-center gap-4 text-primary/40 text-xs font-mono">
            <span>bash</span>
            <span>80x24</span>
        </div>
      </header>

      {/* Terminal Content */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-primary custom-scrollbar text-sm md:text-base selection:bg-primary/30 selection:text-white"
        onClick={() => document.getElementById('terminal-input')?.focus()}
      >
        {children}
      </div>

      {/* Footer Info */}
      <footer className="bg-[#1a2e20] border-t border-primary/10 px-4 py-1.5 flex justify-between text-[10px] text-primary/40 font-mono uppercase tracking-widest shrink-0">
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>Online</span>
        </div>
        <div className="flex gap-4">
          <span>React v19</span>
          <span>Vite</span>
        </div>
      </footer>
    </div>
  );
};
