// Shared terminal bits used by the prompt, command echo and title bar
export const PROMPT_HOST = 'guest@priyanshu';

export const RESUME_URL = '/PriyanshuResume.pdf';

// Only auto-focus the hidden input on mouse/trackpad devices; on touch it would pop the keyboard on every tap
export const focusTerminalInput = () => {
  if (window.matchMedia('(pointer: fine)').matches) {
    document.getElementById('terminal-input')?.focus();
  }
};

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
