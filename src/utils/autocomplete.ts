import { getDirectoryContents } from './fileSystem';

export interface CompletionResult {
  // New input value (unchanged when nothing could be completed)
  value: string;
  // All candidates, so the caller can list them when the match is ambiguous
  matches: string[];
}

const commonPrefix = (words: string[]): string => {
  if (words.length === 0) return '';
  let prefix = words[0];
  for (const word of words.slice(1)) {
    while (!word.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
};

// Bash-style completion: first word completes against commands, later words against the file system
// argOptions: fixed argument lists for commands that don't take paths (e.g. theme names)
export const complete = (
  input: string,
  cwd: string,
  commands: string[],
  argOptions: Record<string, string[]> = {}
): CompletionResult => {
  const tokens = input.split(' ');
  const current = tokens[tokens.length - 1];
  const isCommand = tokens.length === 1;

  let candidates: string[];
  let base = '';
  let partial = current;

  if (isCommand) {
    candidates = commands;
  } else if (argOptions[tokens[0]]) {
    candidates = argOptions[tokens[0]];
  } else {
    // Split "projects/im" into the directory to list ("projects/") and the prefix to match ("im")
    const slash = current.lastIndexOf('/');
    base = slash >= 0 ? current.slice(0, slash + 1) : '';
    partial = current.slice(slash + 1);

    let dir = cwd;
    if (base.startsWith('/') || base.startsWith('~')) dir = base;
    else if (base) dir = `${cwd}/${base}`;

    candidates = getDirectoryContents(dir);
    if (tokens[0] === 'cd') candidates = candidates.filter((name) => name.endsWith('/'));
  }

  const matches = candidates.filter((name) => name.startsWith(partial));
  if (matches.length === 0) return { value: input, matches };

  let completed = commonPrefix(matches);
  // A unique, finished word gets a trailing space, except directories so you can keep descending
  if (matches.length === 1 && !completed.endsWith('/')) completed += ' ';

  tokens[tokens.length - 1] = base + completed;
  return { value: tokens.join(' '), matches };
};
