import React from 'react';
import resumeData from '../../data/resume.json';

// Where each skill was used professionally, so the list is backed by real work instead of made-up percentages
const usage: Record<string, string[]> = resumeData.skill_usage;

export const Skills: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 max-w-3xl">
      <div className="text-white/50 text-xs flex items-center gap-2">
        <span className="inline-block size-2 rounded-full bg-primary" aria-hidden /> used in production (company shown)
      </div>
      {Object.entries(resumeData.skills).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-primary font-bold uppercase mb-3 border-b border-primary/20 inline-block text-sm tracking-wider">
            {category.replace(/_/g, ' ')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => {
              const companies = usage[skill];
              return companies ? (
                <span key={skill} className="text-sm px-2.5 py-1 rounded border border-primary/50 bg-primary/10 text-primary">
                  {skill}
                  <span className="text-white/50 text-xs ml-2">@{companies.join(', ')}</span>
                </span>
              ) : (
                <span key={skill} className="text-sm px-2.5 py-1 rounded border border-white/15 text-white/75">
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
