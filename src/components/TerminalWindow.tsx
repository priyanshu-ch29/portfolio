import React, { useEffect, useRef, useState } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { CommandChip } from './CommandChip';
import { PROMPT_HOST, RESUME_URL, focusTerminalInput } from '../utils/terminal';
import resumeData from '../data/resume.json';

const NAV_COMMANDS = ['about', 'experience', 'projects', 'skills', 'summary', 'contact', 'help'];

const FOOTER_LINKS = [
  { label: 'Resume', href: RESUME_URL },
  { label: 'GitHub', href: resumeData.personal_info.socials.github },
  { label: 'LinkedIn', href: resumeData.personal_info.socials.linkedin },
];

const formatIST = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });

// Local time for the visitor's reference ("is it a good time to reach out?")
const useISTClock = () => {
  const [time, setTime] = useState(formatIST);
  useEffect(() => {
    const interval = setInterval(() => setTime(formatIST()), 30_000);
    return () => clearInterval(interval);
  }, []);
  return time;
};

export const TerminalWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const history = useTerminalStore((state) => state.history);
  const cwd = useTerminalStore((state) => state.cwd);
  const time = useISTClock();
  const status = resumeData.personal_info.status;

  // Auto-scroll to bottom directly, without smooth behavior for authentic terminal feel
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]); // Dep on history ensures scroll on new output

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0c] relative">
      {/* Top Bar */}
      <header className="flex items-center justify-between bg-chrome border-b border-primary/20 px-4 py-2 select-none shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <div className="size-3 rounded-full bg-[#ff5f56]"></div>
            <div className="size-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="size-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="ml-4 flex items-center gap-2 text-primary/80 min-w-0">
            <span className="font-mono text-xs font-bold" aria-hidden>&gt;_</span>
            <h2 className="text-xs font-mono tracking-tight truncate">{PROMPT_HOST}: {cwd}</h2>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-primary/40 text-xs font-mono">
          <span>bash</span>
        </div>
      </header>

      {/* Quick navigation for visitors who'd rather click than type */}
      <nav
        aria-label="Commands"
        className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2 border-b border-primary/10 bg-chrome/40 shrink-0 z-20"
      >
        {NAV_COMMANDS.map((command) => (
          <CommandChip key={command} command={command} />
        ))}
      </nav>

      {/* Terminal Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-primary custom-scrollbar text-sm md:text-base selection:bg-primary/30 selection:text-white"
        onClick={() => {
          // Don't steal focus while the visitor is selecting text to copy
          if (!window.getSelection()?.toString()) focusTerminalInput();
        }}
      >
        {children}
      </div>

      {/* Footer Info */}
      <footer className="bg-chrome border-t border-primary/10 px-4 py-1.5 flex justify-between gap-4 text-[10px] text-primary/50 font-mono uppercase tracking-widest shrink-0">
        <div className="flex gap-4 items-center min-w-0">
          {status && (
            <span className="flex items-center gap-1.5 text-primary/80 truncate">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" aria-hidden />
              {status}
            </span>
          )}
          <span className="truncate">{resumeData.personal_info.location}</span>
          <span className="hidden sm:inline">IST {time}</span>
        </div>
        <div className="flex gap-4">
          {FOOTER_LINKS.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};
