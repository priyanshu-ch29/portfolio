import React from 'react';

// Numbers, counts and percentages ("29", "3,000+", "40%", "3-second") are what a skimming reader looks for
const METRIC = /(\d(?:[\d,.]*\d)?\+?%?(?:-second)?)/g;

export const highlightMetrics = (text: string): React.ReactNode[] =>
  text.split(METRIC).map((part, idx) =>
    idx % 2 === 1 ? (
      <strong key={idx} className="text-white font-bold">
        {part}
      </strong>
    ) : (
      part
    )
  );
