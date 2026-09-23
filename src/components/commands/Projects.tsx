import React from 'react';
import resumeData from '../../data/resume.json';

export const Projects: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      {resumeData.projects.map((project, idx) => (
        <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1 hover:bg-primary/5 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary font-bold text-lg group-hover:underline decoration-dashed offset-4">
              {project.name}
            </span>
            <span className="text-xs text-white/30 bg-primary/10 px-2 rounded">{project.date}</span>
          </div>
          <div className="text-xs text-white/50 mb-1">[{project.tech.join(', ')}]</div>
          <p className="text-white/80 text-sm md:text-base font-mono leading-relaxed">
            {project.description}
          </p>
        </div>
      ))}
      <div className="mt-4 text-white/40 text-sm italic">
        * Use <span className="text-primary">cat projects/project-name</span> for more details (if available).
      </div>
    </div>
  );
};
