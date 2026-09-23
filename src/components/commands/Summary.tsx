import React from 'react';
import resumeData from '../../data/resume.json';
import { highlightMetrics } from '../../utils/highlight';
import { RESUME_URL } from '../../utils/terminal';

export const Summary: React.FC = () => {
  return (
    <div className="space-y-6 text-sm md:text-base">
      
      {/* Bio Section */}
      <div className="border-b border-primary/30 pb-4">
        <h1 className="text-2xl font-bold text-primary mb-2">{resumeData.personal_info.name}</h1>
        <div className="text-white/80 italic mb-2">{resumeData.personal_info.headline}</div>
        <div className="text-white/60 text-xs md:text-sm">
          📍 {resumeData.personal_info.location} | 
          📧 {resumeData.personal_info.email} | 
          📱 {resumeData.personal_info.phone}
        </div>
        <div className="flex gap-4 mt-2 text-xs">
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Resume (PDF)
          </a>
          {Object.entries(resumeData.personal_info.socials || {}).map(([platform, url]) => (
             <a key={platform} href={url as string} target="_blank" rel="noreferrer" className="text-primary hover:underline capitalize">
               {platform}
             </a>
          ))}
        </div>
      </div>

      {/* Experience Section */}
      <div>
        <h2 className="text-primary font-bold text-lg mb-3 border-b border-gray-700 inline-block">Work Experience</h2>
        <div className="space-y-4">
          {resumeData.work_experience.map((job, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline flex-wrap">
                <span className="text-white font-bold">{job.role}</span>
                <span className="text-white/50 text-xs">{job.start_date} - {job.end_date}</span>
              </div>
              <div className="text-primary/80 text-sm mb-1">{job.company} — {job.location}</div>
              <ul className="list-disc pl-5 space-y-1 text-white/70 text-sm">
                {job.highlights.map((highlight, hIdx) => (
                  <li key={hIdx}>{highlightMetrics(highlight)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h2 className="text-primary font-bold text-lg mb-3 border-b border-gray-700 inline-block">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(resumeData.skills).map(([category, items]) => (
                <div key={category}>
                    <span className="text-primary font-bold capitalize">{category.replace(/_/g, ' ')}:</span> 
                    <span className="text-white/70 ml-2">{(items as string[]).join(', ')}</span>
                </div>
            ))}
        </div>
      </div>

       {/* Education Section */}
      <div>
        <h2 className="text-primary font-bold text-lg mb-3 border-b border-gray-700 inline-block">Education</h2>
        <div className="space-y-3">
          {resumeData.education.map((edu, idx) => (
            <div key={idx}>
              <div className="text-white font-bold">{edu.degree}</div>
              <div className="text-white/70">{edu.institution}</div>
              <div className="text-white/50 text-xs">{edu.start_year} - {edu.end_year} | CGPA: {edu.cgpa}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
