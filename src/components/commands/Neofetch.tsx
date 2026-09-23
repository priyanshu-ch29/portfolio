import React from 'react';
import resumeData from '../../data/resume.json';
import { AsciiDonut } from './AsciiDonut';

// Time since the first full-time role, e.g. "2 years, 1 month"
const experienceSince = (start: string) => {
  const [year, month] = start.split('-').map(Number);
  const now = new Date();
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;
  return [years && plural(years, 'year'), rest && plural(rest, 'month')].filter(Boolean).join(', ');
};

export const Neofetch: React.FC = () => {
  const info = resumeData.personal_info;
  const jobs = resumeData.work_experience;
  const firstJob = jobs[jobs.length - 1];
  const user = info.name.split(' ')[0].toLowerCase();

  const rows: [string, string][] = [
    ['Role', info.role],
    ['Uptime', `${experienceSince(firstJob.start_date)} in industry`],
    ['Location', info.location],
    ['Shell', 'TypeScript'],
    ['Frontend', 'React, Next.js, React Native'],
    ['Backend', 'Node.js, Express, GraphQL'],
    ['Data', 'MongoDB, PostgreSQL, DynamoDB'],
    ['Cloud', 'AWS (SQS, S3), Docker, GitHub Actions'],
    ['Education', resumeData.education.map((edu) => edu.degree).join(', ')],
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 font-mono text-sm">
      <AsciiDonut />
      <div>
        <div>
          <span className="text-primary font-bold">{user}</span>
          <span className="text-white/60">@</span>
          <span className="text-primary font-bold">portfolio</span>
        </div>
        <div className="text-white/30">{'-'.repeat(user.length + 10)}</div>
        {rows.map(([label, value]) => (
          <div key={label}>
            <span className="text-primary font-bold">{label}</span>
            <span className="text-white/60">: </span>
            <span className="text-white/85">{value}</span>
          </div>
        ))}
        <div className="flex gap-0 mt-3" aria-hidden>
          {['bg-primary', 'bg-primary/70', 'bg-primary/40', 'bg-white/70', 'bg-white/30', 'bg-[#ff5f56]', 'bg-[#ffbd2e]', 'bg-[#27c93f]'].map((color) => (
            <span key={color} className={`${color} w-6 h-3`} />
          ))}
        </div>
      </div>
    </div>
  );
};
