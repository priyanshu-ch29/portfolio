import React from 'react';
import resumeData from '../../data/resume.json';

const ProjectLink: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className="text-primary text-sm underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
  >
    {label} ↗
  </a>
);

export const Projects: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 max-w-3xl">
      {resumeData.projects.map((project) => (
        <div key={project.name} className="border-l-2 border-primary/30 pl-4 py-1 hover:border-primary/70 transition-colors">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-primary font-bold text-lg">{project.name}</span>
            <span className="text-xs text-white/40 bg-primary/10 px-2 rounded">{project.date}</span>
          </div>
          <p className="text-white/80 text-sm md:text-base leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tech.map((tech) => (
              <span key={tech} className="text-xs text-white/60 border border-white/15 px-2 py-0.5 rounded">
                {tech}
              </span>
            ))}
          </div>
          {(project.live || project.github) && (
            <div className="flex gap-4 mt-3">
              {project.live && <ProjectLink href={project.live} label="Live demo" />}
              {project.github && <ProjectLink href={project.github} label="Source" />}
            </div>
          )}
        </div>
      ))}
      <div className="text-white/40 text-sm italic">
        * More on <a href={resumeData.personal_info.socials.github} target="_blank" rel="noopener noreferrer" className="text-primary not-italic hover:underline">GitHub</a>, or <span className="text-primary">cat projects/&lt;name&gt;</span> for plain text.
      </div>
    </div>
  );
};
