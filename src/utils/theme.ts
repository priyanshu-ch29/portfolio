// Terminal color themes, applied as CSS variables consumed by tailwind.config.js and index.css
export const THEMES = {
  green: { primary: '13 242 89', background: '16 34 22', chrome: '26 46 32' },
  amber: { primary: '255 176 0', background: '31 22 5', chrome: '46 33 10' },
  blue: { primary: '56 189 248', background: '11 23 38', chrome: '19 36 58' },
  purple: { primary: '192 132 252', background: '26 16 38', chrome: '39 26 56' },
} as const;

export type ThemeName = keyof typeof THEMES;

const STORAGE_KEY = 'portfolio-theme';

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

export const isThemeName = (name: string): name is ThemeName => name in THEMES;

export const applyTheme = (name: ThemeName) => {
  const theme = THEMES[name];
  const root = document.documentElement.style;
  root.setProperty('--color-primary', theme.primary);
  root.setProperty('--color-background', theme.background);
  root.setProperty('--color-chrome', theme.chrome);
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // Storage can be blocked (private mode); the theme still applies for this visit
  }
};

export const getSavedTheme = (): ThemeName => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isThemeName(saved)) return saved;
  } catch {
    // Fall through to the default
  }
  return 'green';
};

// Current primary color as a CSS color string, for canvas drawing
export const getPrimaryColor = () =>
  `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '13 242 89'})`;
