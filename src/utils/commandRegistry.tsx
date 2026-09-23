import { useTerminalStore } from '../store/useTerminalStore';
import { getDirectoryContents, resolvePath } from './fileSystem';
import { Skills } from '../components/commands/Skills';
import { Projects } from '../components/commands/Projects';
import { Experience } from '../components/commands/Experience';
import { About } from '../components/commands/About';
import { Summary } from '../components/commands/Summary';
import { MatrixEffect } from '../components/commands/MatrixEffect';
import { Neofetch } from '../components/commands/Neofetch';
import type { ReactNode } from 'react';
import { CommandChip, NextSteps } from '../components/CommandChip';
import resumeData from '../data/resume.json';
import { RESUME_URL } from './terminal';
import { THEME_NAMES, applyTheme, isThemeName } from './theme';

// Commands offered by tab completion (hidden easter eggs are left out on purpose)
export const COMMANDS = [
  'about', 'cat', 'cd', 'clear', 'contact', 'experience', 'help', 'ls', 'matrix',
  'neofetch', 'open', 'projects', 'reboot', 'resume', 'skills', 'summary', 'theme', 'whoami',
];

// Fixed argument lists for tab completion
export const ARG_OPTIONS: Record<string, string[]> = { theme: THEME_NAMES };

const editDistance = (a: string, b: string): number => {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return row[b.length];
};

// Closest known command for typos like "experince", or null if nothing is close
const suggestCommand = (input: string): string | null => {
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const command of COMMANDS) {
    const distance = editDistance(input, command);
    if (distance < bestDistance) {
      best = command;
      bestDistance = distance;
    }
  }
  return bestDistance <= Math.max(1, Math.floor(input.length / 3)) ? best : null;
};

// Command output followed by clickable "what next" suggestions
const withNext = (content: ReactNode, next: string[]) => (
  <>
    {content}
    <NextSteps commands={next} />
  </>
);


// Simple command processor
export const processCommand = (input: string) => {
  const { addEntry, setCwd, cwd, addToCommandHistory, clearHistory } = useTerminalStore.getState();
  
  const trimmed = input.trim();
  if (!trimmed) {
    addEntry({ type: 'command', content: '', cwd });
    return;
  }

  addToCommandHistory(trimmed);
  addEntry({ type: 'command', content: trimmed, cwd });

  const [cmd, ...args] = trimmed.split(/\s+/);
  
  // Basic commands
  switch (cmd.toLowerCase()) {
    case 'help':
        addEntry({
            type: 'output',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="col-span-1 md:col-span-2 text-white/70 mb-2">Available commands:</div>
                    <div><span className="text-primary font-bold w-24 inline-block">about</span> <span className="text-white/60">Who am I?</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">experience</span> <span className="text-white/60">Work history</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">skills</span> <span className="text-white/60">Technical capabilities</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">projects</span> <span className="text-white/60">My built works</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">summary</span> <span className="text-white/60">Resume view</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">contact</span> <span className="text-white/60">Get in touch</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">resume</span> <span className="text-white/60">Open resume PDF</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">neofetch</span> <span className="text-white/60">System info, but it's me</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">theme [name]</span> <span className="text-white/60">{THEME_NAMES.join(' | ')}</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">matrix</span> <span className="text-white/60">Enter the Matrix</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">ls</span> <span className="text-white/60">List directory contents</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">cd [dir]</span> <span className="text-white/60">Change directory</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">cat [file]</span> <span className="text-white/60">View file content</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">clear</span> <span className="text-white/60">Clear screen (Ctrl+L)</span></div>
                    <div className="col-span-1 md:col-span-2 text-white/40 mt-2">Tab completes · ↑/↓ history · Ctrl+C cancels the line</div>
                </div>
            )
        });
        break;
        
    case 'clear':
        clearHistory();
        break;
        
    case 'whoami':
        addEntry({
            type: 'output',
            content: `You're guest. I'm ${resumeData.personal_info.name}: ${resumeData.personal_info.headline}.`
        });
        break;

    case 'neofetch':
        addEntry({ type: 'output', content: withNext(<Neofetch />, ['experience', 'projects']) });
        break;

    case 'theme':
        if (!args[0]) {
            addEntry({ type: 'output', content: `Usage: theme <${THEME_NAMES.join('|')}>` });
        } else if (isThemeName(args[0])) {
            applyTheme(args[0]);
            addEntry({ type: 'output', content: `Theme set to ${args[0]}.` });
        } else {
            addEntry({ type: 'output', content: `theme: unknown theme '${args[0]}'. Try: ${THEME_NAMES.join(', ')}` });
        }
        break;

    case 'about':
        addEntry({ type: 'output', content: withNext(<About />, ['experience', 'projects', 'resume']) });
        break;
        
    case 'skills':
        addEntry({ type: 'output', content: withNext(<Skills />, ['projects', 'contact']) });
        break;
        
    case 'projects':
        addEntry({ type: 'output', content: withNext(<Projects />, ['skills', 'contact']) });
        break;
        
    case 'experience':
        addEntry({ type: 'output', content: withNext(<Experience />, ['projects', 'skills']) });
        break;

    case 'summary':
        addEntry({ type: 'output', content: withNext(<Summary />, ['resume', 'contact']) });
        break;

        
    case 'contact':
        addEntry({ 
            type: 'output', 
            content: withNext(
                <div className="text-white/90">
                    <p>You can reach me at:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                       <li>Email: <a href={`mailto:${resumeData.personal_info.email}`} className="text-primary hover:underline">{resumeData.personal_info.email}</a></li>
                       <li>Phone: {resumeData.personal_info.phone}</li>
                       {resumeData.personal_info.socials && Object.entries(resumeData.personal_info.socials).map(([platform, url]) => (
                           <li key={platform} className="capitalize">{platform}: <a href={url as string} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url as string}</a></li>
                       ))}
                    </ul>
                </div>,
                ['resume', 'about']
            )
        });
        break;
        
    case 'resume':
    case 'open':
        // Check if arg is resume or resume.pdf
        if (!args[0] || args[0].includes('resume')) {
             window.open(RESUME_URL, '_blank');
             addEntry({ type: 'output', content: 'Opening resume...' });
        } else {
             addEntry({ type: 'output', content: `open: ${args[0]}: not found` });
        }
        break;

    case 'ls':
        const targetPath = args[0] || cwd;
        const contents = getDirectoryContents(targetPath);
        if (contents.length > 0) {
            addEntry({
                type: 'output',
                content: (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {contents.map(item => (
                            <span key={item} className={item.endsWith('/') ? 'text-blue-400 font-bold' : 'text-primary'}>
                                {item}
                            </span>
                        ))}
                    </div>
                )
            });
        } else {
             // Check if it's a valid empty dir or file not found
            const node = resolvePath(cwd, targetPath);
            if (!node) {
                 addEntry({ type: 'output', content: `ls: cannot access '${targetPath}': No such file or directory` });
            }
        }
        break;

    case 'cd':
        const dest = args[0] || '~';
        const node = resolvePath(cwd, dest);
        if (node && node.type === 'directory') {
            // Simplify path for UI (this is a hacky way to normalize)
            let newPath = '';
            if (dest.startsWith('/')) newPath = dest;
            else if (dest === '~') newPath = '~';
            else if (dest === '..') {
                 // Parent dir logic: hacky
                 if (cwd === '~' || cwd === '/home/user') newPath = '/home'; // restricted
                 else newPath = cwd.split('/').slice(0, -1).join('/') || '/';
                 // Force keep user in home
                 if (newPath === '/home') newPath = '/home/user';
                 // Actually let's just keep it simple: can't go above home
                 newPath = '~';
            } else {
                newPath = cwd === '~' ? `~/${dest}` : `${cwd}/${dest}`;
            }
            // Fix double slashes and stuff
            newPath = newPath.replace(/\/+/g, '/').replace(/\/$/, '');
            if (newPath.startsWith('/home/user')) newPath = newPath.replace('/home/user', '~');
            
            setCwd(newPath);
        } else {
             addEntry({ type: 'output', content: `cd: ${dest}: No such file or directory` });
        }
        break;
        
    case 'cat':
        if (!args[0]) {
             addEntry({ type: 'output', content: 'cat: missing file operand' });
             break;
        }
        const fileNode = resolvePath(cwd, args[0]);
        if (!fileNode) {
             addEntry({ type: 'output', content: `cat: ${args[0]}: No such file or directory` });
        } else if (fileNode.type === 'directory') {
             addEntry({ type: 'output', content: `cat: ${args[0]}: Is a directory` });
        } else if (fileNode.type === 'link') {
             window.open(fileNode.content, '_blank');
             addEntry({ type: 'output', content: `Opening ${args[0]}...` });
        } else {
             // Detect JSON content and pretty print? Or raw text.
             // For skills.txt etc. which might be JSON strings
             let displayContent = fileNode.content;
             try {
                 const parsed = JSON.parse(displayContent);
                 displayContent = JSON.stringify(parsed, null, 2);
             } catch (e) {
                 // plain text
             }
             addEntry({ type: 'output', content: displayContent });
        }
        break;

    case 'reboot':
        window.location.reload();
        break;

    case 'sudo':
        addEntry({ type: 'output', content: 'Permission denied: You are not Priyanshu. (And even if you were, I wouldn\'t let you.)' });
        break;

    case 'matrix':
        addEntry({ type: 'output', content: <MatrixEffect /> });
        break;

    case 'rm':
        if (args[0] === '-rf' && args[1] === '/') {
            addEntry({ type: 'output', content: <div className="text-red-500 font-bold">I'm sorry, Dave. I'm afraid I can't do that.</div> });
        } else {
            addEntry({ type: 'output', content: 'Nice try, but I like these files where they are.' });
        }
        break;

    case 'vi':
    case 'vim':
    case 'nvim':
    case 'emacs':
    case 'nano':
        addEntry({ type: 'output', content: 'Why use text editors when you have VS Code? (Just kidding, but you can\'t open them here.)' });
        break;

    default: {
        const suggestion = suggestCommand(cmd.toLowerCase());
        addEntry({
            type: 'output',
            content: suggestion ? (
                <div className="flex flex-wrap items-center gap-2">
                    <span>{cmd}: command not found. Did you mean</span>
                    <CommandChip command={suggestion} />
                    <span>?</span>
                </div>
            ) : `${cmd}: command not found. Type 'help' for available commands.`
        });
    }
  }
};
