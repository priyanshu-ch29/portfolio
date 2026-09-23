import React from 'react';
import resumeData from '../../data/resume.json';

export const About: React.FC = () => {
  return (
    <div className="max-w-2xl text-justify leading-relaxed text-white/90">
      <div className="flex items-center gap-4 mb-4">
         <div className="size-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary text-2xl font-bold text-primary">
            {resumeData.personal_info.name.split(' ').map((part) => part[0]).join('')}
         </div>
         <div>
            <h1 className="text-2xl font-bold text-white">{resumeData.personal_info.name}</h1>
            <p className="text-primary italic">{resumeData.personal_info.headline}</p>
         </div>
      </div>
      <p>
         {resumeData.personal_info.summary}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-white/70">
         <div>
            <span className="text-primary font-bold">Email:</span> {resumeData.personal_info.email}
         </div>
         <div>
            <span className="text-primary font-bold">Phone:</span> {resumeData.personal_info.phone}
         </div>
      </div>
    </div>
  );
};
