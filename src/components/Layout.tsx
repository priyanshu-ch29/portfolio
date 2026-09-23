import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-background-dark flex items-center justify-center p-2 md:p-8 font-display relative overflow-hidden group/design-root">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_rgba(13,242,89,0.03)_0%,_transparent_70%)]"></div>
      </div>

      <div className="relative w-full max-w-5xl h-[85vh] md:h-[90vh] bg-[#102216] border border-primary/20 rounded-lg overflow-hidden terminal-shadow flex flex-col z-10">
        {/* Scanline Overlay */}
        <div className="scanline pointer-events-none absolute inset-0 z-50 opacity-40"></div>
        
        {children}
      </div>
    </div>
  );
};
