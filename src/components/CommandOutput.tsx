import React from 'react';
import type { CommandEntry } from '../store/useTerminalStore';
import { Typewriter } from './Typewriter';
import { PROMPT_HOST } from '../utils/terminal';

export const CommandOutput: React.FC<{ entry: CommandEntry }> = ({ entry }) => {
  if (entry.type === 'command') {
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-white/50 shrink-0">{PROMPT_HOST}:{entry.cwd || '~'}$</span>
        <span className="text-primary break-all">{entry.content}</span>
      </div>
    );
  }

  return (
    <div className="mb-6 pl-0 md:pl-4 w-full overflow-hidden">
      {typeof entry.content === 'string' ? (
         // Use Typewriter for string content
        <div className="text-primary/90">
             <Typewriter 
                text={entry.content} 
                speed={entry.content.length > 100 ? 5 : 20} 
             />
        </div>
      ) : (
        // Render detailed component output (React Node)
        entry.content
      )}
    </div>
  );
};
