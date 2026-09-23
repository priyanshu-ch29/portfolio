import React, { useEffect, useRef } from 'react';
import { useTerminalStore } from '../store/useTerminalStore';
import { complete } from '../utils/autocomplete';
import { COMMANDS, ARG_OPTIONS } from '../utils/commandRegistry';
import { PROMPT_HOST, focusTerminalInput } from '../utils/terminal';

export const Prompt: React.FC<{ onSubmit: (cmd: string) => void }> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { input, setInput, cwd, commandHistory, historyPointer, setHistoryPointer, addEntry, clearHistory } = useTerminalStore();

  useEffect(() => {
    // Keep focus on input (desktop only, see focusTerminalInput)
    document.addEventListener('click', focusTerminalInput);
    focusTerminalInput();
    return () => document.removeEventListener('click', focusTerminalInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      clearHistory();
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      // Leave Ctrl+C alone when the visitor is copying selected output
      if (window.getSelection()?.toString()) return;
      e.preventDefault();
      addEntry({ type: 'command', content: `${input}^C`, cwd });
      setInput('');
      setHistoryPointer(-1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const { value, matches } = complete(input, cwd, COMMANDS, ARG_OPTIONS);
      if (value !== input) {
        setInput(value);
      } else if (matches.length > 1) {
        // Ambiguous with nothing left to fill in: list the options like bash does
        addEntry({ type: 'command', content: input, cwd });
        addEntry({
          type: 'output',
          content: (
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {matches.map((match) => (
                <span key={match} className={match.endsWith('/') ? 'text-blue-400 font-bold' : 'text-primary'}>
                  {match}
                </span>
              ))}
            </div>
          ),
        });
      }
    } else if (e.key === 'Enter') {
      onSubmit(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyPointer < commandHistory.length - 1) {
        const newPointer = historyPointer + 1;
        setHistoryPointer(newPointer);
        setInput(commandHistory[commandHistory.length - 1 - newPointer]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer > 0) {
        const newPointer = historyPointer - 1;
        setHistoryPointer(newPointer);
        setInput(commandHistory[commandHistory.length - 1 - newPointer]);
      } else if (historyPointer === 0) {
        setHistoryPointer(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-white/50">{PROMPT_HOST}:{cwd}$</span>
      </div>
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text bg-transparent"
          autoFocus
          enterKeyHint="go"
          aria-label="Terminal command"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <div className="flex items-center whitespace-pre-wrap break-all">
          <span className="text-primary">{input}</span>
          <span className="animate-blink block w-[10px] h-[1.2rem] bg-primary ml-0.5"></span>
        </div>
      </div>
    </div>
  );
};
