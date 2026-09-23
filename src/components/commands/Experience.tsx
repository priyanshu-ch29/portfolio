import React from 'react';
import resumeData from '../../data/resume.json';

export const Experience: React.FC = () => {
  return (
    <div className="space-y-8 font-mono max-w-3xl">
      <div className="flex justify-between border-b border-primary/20 pb-1 text-xs md:text-sm text-white/40">
        <span>EXPERIENCE(1)</span>
        <span>User Commands</span>
        <span>EXPERIENCE(1)</span>
      </div>

      <section>
        <h3 className="text-primary font-bold mb-2 uppercase tracking-wider underline decoration-primary/30 underline-offset-4 text-sm">NAME</h3>
        <p className="pl-8 text-white/80">experience - professional history and trajectory</p>
      </section>

      <section>
        <h3 className="text-primary font-bold mb-4 uppercase tracking-wider underline decoration-primary/30 underline-offset-4 text-sm">Timeline</h3>
        
        {resumeData.work_experience.map((job, idx) => (
          <div key={idx} className="mb-8 pl-4 border-l border-dashed border-primary/20 ml-2 relative">
             <div className="absolute -left-[5px] top-0 size-2 bg-primary rounded-full"></div>
             
             <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-2">
               <h4 className="text-primary font-bold text-base md:text-lg">
                 {job.company} :: {job.role.toUpperCase().replace(/\s+/g, '_')}
               </h4>
               <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded">
                 {job.start_date} - {job.end_date}
               </span>
             </div>
             
             <div className="text-white/60 text-xs mb-3 italic flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {job.location}
             </div>

             <ul className="space-y-2 text-white/80 text-sm">
               {job.highlights.map((highlight, hIdx) => (
                 <li key={hIdx} className="flex gap-2">
                   <span className="text-primary flex-shrink-0">&gt;&gt;</span>
                   <span>{highlight}</span>
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </section>

      <div className="flex justify-between border-t border-primary/20 pt-1 text-xs md:text-sm text-white/40">
        <span>Portfolio v1.0</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </div>
  );
};
