import React from 'react';
import { processCommand } from '../utils/commandRegistry';
import { focusTerminalInput } from '../utils/terminal';

// A clickable command, so visitors who don't want to type can still navigate
export const CommandChip: React.FC<{ command: string; label?: string }> = ({ command, label }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      processCommand(command);
      focusTerminalInput();
    }}
    className="shrink-0 font-mono text-xs md:text-sm px-2.5 py-1 rounded border border-primary/30 text-primary/90 bg-primary/5 hover:bg-primary/15 hover:border-primary/60 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary transition-colors"
  >
    {label ?? command}
  </button>
);

// "What next?" suggestions shown under a command's output
export const NextSteps: React.FC<{ commands: string[] }> = ({ commands }) => (
  <div className="flex flex-wrap items-center gap-2 mt-5 text-xs text-white/40">
    <span>next →</span>
    {commands.map((command) => (
      <CommandChip key={command} command={command} />
    ))}
  </div>
);
