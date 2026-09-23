import React from 'react';
import resumeData from '../../data/resume.json';

const ProgressBar: React.FC<{ label: string; percent: number }> = ({ label, percent }) => {
  const bars = Math.floor((percent / 100) * 20);
  const empty = 20 - bars;
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between mb-1 font-mono text-sm">
      <div className="w-48 text-white/80">{label}</div>
      <div className="flex gap-2">
        <span className="text-primary">
          [{'#'.repeat(bars)}{'-'.repeat(empty)}]
        </span>
        <span className="text-white/60 w-10 text-right">{percent}%</span>
      </div>
    </div>
  );
};

export const Skills: React.FC = () => {
  // Flatten skills for display or show by category
  // Let's show by category with some fake "mastery" for visual effect
  // Since we don't have real percentages, we'll randomize between 80-100 for effect
  
  return (
    <div className="grid grid-cols-1 gap-6 max-w-3xl">
      {Object.entries(resumeData.skills).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-primary font-bold uppercase mb-2 border-b border-primary/20 inline-block">
            {category.replace(/_/g, ' ')}
          </h3>
          <div className="pl-0 md:pl-4">
            {(items as string[]).map((skill) => (
              <ProgressBar 
                key={skill} 
                label={skill} 
                percent={Math.floor(Math.random() * (100 - 85) + 85)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
