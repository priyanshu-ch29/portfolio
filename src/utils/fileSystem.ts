import resumeData from '../data/resume.json';

// Simple in-memory file system structure
// We will flatten the resume data into files/directories

export interface FileSystemNode {
  type: 'file' | 'directory' | 'link';
  content?: string | any;
  children?: Record<string, FileSystemNode>;
}

const createFileSystem = (): FileSystemNode => {
  const root: FileSystemNode = {
    type: 'directory',
    children: {
      'home': {
        type: 'directory',
        children: {
          'user': {
            type: 'directory',
            children: {
              'projects': {
                type: 'directory',
                children: resumeData.projects.reduce((acc, proj) => {
                  const safeName = proj.name.toLowerCase().replace(/\s+/g, '-');
                  acc[safeName] = {
                    type: 'file',
                    content: `Project: ${proj.name}\n\n${proj.description}\n`
                  };
                  return acc;
                }, {} as Record<string, FileSystemNode>)
              },
              'skills.txt': {
                type: 'file',
                content: JSON.stringify(resumeData.skills, null, 2)
              },
              'about.txt': {
                type: 'file',
                content: resumeData.personal_info.summary
              },
              'experience.log': {
                type: 'file',
                content: JSON.stringify(resumeData.work_experience, null, 2)
              },
              'contact.md': {
                type: 'file',
                content: `Name: ${resumeData.personal_info.name}\nEmail: ${resumeData.personal_info.email}\nPhone: ${resumeData.personal_info.phone}\nLocation: ${resumeData.personal_info.location}\n`
              },
              'resume.pdf': {
                type: 'link',
                content: '/PriyanshuResume.pdf'
              },
              'education.txt': {
                type: 'file',
                content: JSON.stringify(resumeData.education, null, 2)
              }
            }
          }
        }
      }
    }
  };
  return root;
};

export const fileSystem = createFileSystem();

export const resolvePath = (cwd: string, target: string): FileSystemNode | null => {
  // Normalize path
  if (target === '~') target = '/home/user';
  if (target.startsWith('~/')) target = '/home/user' + target.substring(1);
  
  let currentPath = target.startsWith('/') ? target : `${cwd}/${target}`;
  // Remove trailing internal slashes and resolve ..
  const parts = currentPath.split('/').filter(Boolean);
  
  // Navigate from root
  let current: FileSystemNode = fileSystem;
  
  for (const part of parts) {
    if (current.type !== 'directory' || !current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }
  
  return current;
};

export const getDirectoryContents = (cwd: string): string[] => {
    // Resolve cwd to a node
    // Note: cwd should be absolute-ish, e.g. /home/user or ~
    let path = cwd;
    if (path === '~') path = '/home/user';
    
    // Quick hack for this simple FS: navigate manually
    // In a real FS we'd just use resolvePath
    // But resolvePath returns the node.
    
    const node = resolvePath('/', path);
    if (node && node.type === 'directory' && node.children) {
        return Object.keys(node.children).map(key => {
            const child = node.children![key];
            return child.type === 'directory' ? key + '/' : key;
        });
    }
    return [];
};
