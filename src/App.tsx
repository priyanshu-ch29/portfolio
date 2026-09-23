import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { TerminalWindow } from './components/TerminalWindow';
import { Prompt } from './components/Prompt';
import { CommandOutput } from './components/CommandOutput';
import { useTerminalStore } from './store/useTerminalStore';
import { processCommand } from './utils/commandRegistry';
import { MatrixEffect } from './components/commands/MatrixEffect';
import { Banner } from './components/Banner';
import { prefersReducedMotion } from './utils/terminal';
import resumeData from './data/resume.json';

const INTRO_DURATION_MS = 4000;

type IntroPhase = 'playing' | 'fading' | 'done';

function App() {
  const history = useTerminalStore((state) => state.history);
  const addEntry = useTerminalStore((state) => state.addEntry);
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => (prefersReducedMotion() ? 'done' : 'playing'));

  // Matrix intro: plays on every landing (skipped for reduced-motion visitors), then fades out; click or any key skips it
  useEffect(() => {
    if (introPhase !== 'playing') return;
    const skip = () => setIntroPhase('fading');
    const timer = setTimeout(skip, INTRO_DURATION_MS);
    window.addEventListener('keydown', skip);
    window.addEventListener('click', skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click', skip);
    };
  }, [introPhase]);

  useEffect(() => {
    // Initial banner (guarded: StrictMode runs effects twice in dev)
    if (useTerminalStore.getState().history.length > 0) return;
    addEntry({ type: 'output', content: <Banner /> });
  }, [addEntry]);

  return (
    <>
      {/* Terminal mounts once the intro starts fading so the prompt grabs focus then */}
      {introPhase !== 'playing' && (
        <Layout>
          <TerminalWindow>
            {history.map((entry) => (
              <CommandOutput key={entry.id} entry={entry} />
            ))}
            <Prompt onSubmit={processCommand} />
          </TerminalWindow>
        </Layout>
      )}
      {introPhase !== 'done' && (
        <MatrixEffect
          title={resumeData.personal_info.name.toUpperCase()}
          subtitle={resumeData.personal_info.tagline}
          hint="Wake up, Neo... (press any key to skip)"
          className={`bg-black transition-opacity duration-700 ${introPhase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onFadeEnd={introPhase === 'fading' ? () => setIntroPhase('done') : undefined}
        />
      )}
    </>
  );
}

export default App;
