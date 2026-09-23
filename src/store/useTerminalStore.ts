import { create } from 'zustand';

export type CommandType = 'command' | 'output' | 'error';

export interface CommandEntry {
  id: string;
  type: CommandType;
  content: React.ReactNode | string;
  command?: string; // The command string that produced this output
  cwd?: string;
}

interface TerminalState {
  history: CommandEntry[];
  input: string;
  cwd: string;
  historyPointer: number; // For up/down arrow navigation
  commandHistory: string[]; // Just the typed commands
  
  // Actions
  setInput: (val: string) => void;
  addEntry: (entry: Omit<CommandEntry, 'id'>) => void;
  clearHistory: () => void;
  addToCommandHistory: (cmd: string) => void;
  setHistoryPointer: (ptr: number) => void;
  setCwd: (path: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  history: [],
  input: '',
  cwd: '~',
  historyPointer: -1,
  commandHistory: [],

  setInput: (val) => set({ input: val }),
  
  addEntry: (entry) => set((state) => ({
    history: [...state.history, { ...entry, id: Math.random().toString(36).substr(2, 9) }]
  })),

  clearHistory: () => set({ history: [] }),

  addToCommandHistory: (cmd) => set((state) => ({
    commandHistory: [...state.commandHistory, cmd],
    historyPointer: -1 // Reset pointer after new command
  })),

  setHistoryPointer: (ptr) => set({ historyPointer: ptr }),
  
  setCwd: (path) => set({ cwd: path }),
}));
