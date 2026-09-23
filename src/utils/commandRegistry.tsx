import { useTerminalStore } from '../store/useTerminalStore';
import { getDirectoryContents, resolvePath } from './fileSystem';
import { Skills } from '../components/commands/Skills';
import { Projects } from '../components/commands/Projects';
import { Experience } from '../components/commands/Experience';
import { About } from '../components/commands/About';
import { Summary } from '../components/commands/Summary';
import { MatrixEffect } from '../components/commands/MatrixEffect';
import resumeData from '../data/resume.json';

// Commands offered by tab completion (hidden easter eggs are left out on purpose)
export const COMMANDS = [
  'about', 'cat', 'cd', 'clear', 'contact', 'experience', 'help', 'ls',
  'matrix', 'open', 'projects', 'reboot', 'resume', 'skills', 'summary', 'whoami',
];


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
                    <div><span className="text-primary font-bold w-24 inline-block">matrix</span> <span className="text-white/60">Enter the Matrix</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">ls</span> <span className="text-white/60">List directory contents</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">cd [dir]</span> <span className="text-white/60">Change directory</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">cat [file]</span> <span className="text-white/60">View file content</span></div>
                    <div><span className="text-primary font-bold w-24 inline-block">clear</span> <span className="text-white/60">Clear screen</span></div>
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
            content: 'guest'
        });
        break;

    case 'about':
        addEntry({ type: 'output', content: <About /> });
        break;
        
    case 'skills':
        addEntry({ type: 'output', content: <Skills /> });
        break;
        
    case 'projects':
        addEntry({ type: 'output', content: <Projects /> });
        break;
        
    case 'experience':
        addEntry({ type: 'output', content: <Experience /> });
        break;

    case 'summary':
        addEntry({ type: 'output', content: <Summary /> });
        break;

        
    case 'contact':
        addEntry({ 
            type: 'output', 
            content: (
                <div className="text-white/90">
                    <p>You can reach me at:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                       <li>Email: <a href={`mailto:${resumeData.personal_info.email}`} className="text-primary hover:underline">{resumeData.personal_info.email}</a></li>
                       <li>Phone: {resumeData.personal_info.phone}</li>
                       {resumeData.personal_info.socials && Object.entries(resumeData.personal_info.socials).map(([platform, url]) => (
                           <li key={platform} className="capitalize">{platform}: <a href={url as string} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url as string}</a></li>
                       ))}
                    </ul>
                </div>
            ) 
        });
        break;
        
    case 'resume':
    case 'open':
        // Check if arg is resume or resume.pdf
        if (!args[0] || args[0].includes('resume')) {
             window.open('/PriyanshuResume.pdf', '_blank');
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

    default:
        addEntry({ type: 'output', content: `${cmd}: command not found. Type 'help' for available commands.` });
  }
};
