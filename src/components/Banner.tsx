import React from 'react';
import resumeData from '../data/resume.json';
import { RESUME_URL } from '../utils/terminal';

// Generated with figlet (font: small). Kept as plain ASCII so it lines up in any monospace font.
const NAME_ART = [
  " ___ ___ _____   ___   _  _ ___ _  _ _   _",
  "| _ \\ _ \\_ _\\ \\ / /_\\ | \\| / __| || | | | |",
  "|  _/   /| | \\ V / _ \\| .` \\__ \\ __ | |_| |",
  "|_| |_|_\\___| |_/_/ \\_\\_|\\_|___/_||_|\\___/",
  "  ___ _  _  ___  _   _ ___  _  _   _   _____   __",
  " / __| || |/ _ \\| | | |   \\| || | /_\\ | _ \\ \\ / /",
  "| (__| __ | (_) | |_| | |) | __ |/ _ \\|   /\\ V /",
  " \\___|_||_|\\___/ \\___/|___/|_||_/_/ \\_\\_|_\\ |_|",
].join('\n');

const LINKS = [
  { label: 'Resume', href: RESUME_URL },
  { label: 'GitHub', href: resumeData.personal_info.socials.github },
  { label: 'LinkedIn', href: resumeData.personal_info.socials.linkedin },
];

export const Banner: React.FC = () => (
  <div className="mb-4">
    <pre className="hidden sm:block text-[9px] md:text-xs lg:text-sm leading-none font-bold text-primary/90 text-shadow" aria-label={resumeData.personal_info.name}>
      {NAME_ART}
    </pre>
    <h1 className="sm:hidden text-2xl font-bold text-primary text-shadow">{resumeData.personal_info.name}</h1>

    <div className="mt-3 text-white/80 text-sm md:text-base">{resumeData.personal_info.tagline}</div>
    <div className="text-white/40 text-xs md:text-sm mt-1">{resumeData.personal_info.role} · {resumeData.personal_info.location}</div>

    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          {link.label} ↗
        </a>
      ))}
    </div>

    <div className="border-b border-primary/20 my-4" />

    <div className="text-white/60 text-sm">
      Click a command above or type <span className="text-primary font-bold">help</span>. <span className="hidden md:inline">Tab completes, ↑/↓ recalls history.</span>
    </div>
  </div>
);
