import React, { useState } from 'react';
import resumeData from '../../data/resume.json';
import { highlightMetrics } from '../../utils/highlight';

const VISIBLE_HIGHLIGHTS = 4;

type Job = (typeof resumeData.work_experience)[number];

const JobEntry: React.FC<{ job: Job }> = ({ job }) => {
  const [expanded, setExpanded] = useState(false);
  const hidden = job.highlights.length - VISIBLE_HIGHLIGHTS;
  const highlights = expanded ? job.highlights : job.highlights.slice(0, VISIBLE_HIGHLIGHTS);

  return (
    <div className="mb-8 pl-4 border-l border-dashed border-primary/20 ml-2 relative">
      <div className="absolute -left-[5px] top-1.5 size-2 bg-primary rounded-full"></div>

      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-1 gap-1">
        <h4 className="text-primary font-bold text-base md:text-lg">
          {job.role} <span className="text-white/50 font-normal">@</span> {job.company}
        </h4>
        <span className="text-white/50 text-xs bg-white/5 px-2 py-0.5 rounded shrink-0">
          {job.start_date} → {job.end_date}
        </span>
      </div>

      <div className="text-white/40 text-xs mb-3">{job.location}</div>

      <ul className="space-y-2 text-white/75 text-sm leading-relaxed">
        {highlights.map((highlight, hIdx) => (
          <li key={hIdx} className="flex gap-2">
            <span className="text-primary flex-shrink-0">&gt;&gt;</span>
            <span>{highlightMetrics(highlight)}</span>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((value) => !value);
          }}
          className="mt-3 text-xs text-primary/80 hover:text-primary underline underline-offset-4 decoration-dashed"
        >
          {expanded ? '− show less' : `+ ${hidden} more`}
        </button>
      )}
    </div>
  );
};

export const Experience: React.FC = () => {
  return (
    <div className="space-y-8 font-mono max-w-3xl">
      <div className="flex justify-between border-b border-primary/20 pb-1 text-xs md:text-sm text-white/40">
        <span>EXPERIENCE(1)</span>
        <span className="hidden sm:inline">User Commands</span>
        <span>EXPERIENCE(1)</span>
      </div>

      <section>
        <h3 className="text-primary font-bold mb-4 uppercase tracking-wider underline decoration-primary/30 underline-offset-4 text-sm">Timeline</h3>
        {resumeData.work_experience.map((job) => (
          <JobEntry key={job.company} job={job} />
        ))}
      </section>
    </div>
  );
};
