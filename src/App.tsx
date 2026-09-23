import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { TerminalWindow } from './components/TerminalWindow';
import { Prompt } from './components/Prompt';
import { CommandOutput } from './components/CommandOutput';
import { useTerminalStore } from './store/useTerminalStore';
import { processCommand } from './utils/commandRegistry';
import { MatrixEffect } from './components/commands/MatrixEffect';

const INTRO_DURATION_MS = 7000;

type IntroPhase = 'playing' | 'fading' | 'done';

function App() {
  const history = useTerminalStore((state) => state.history);
  const addEntry = useTerminalStore((state) => state.addEntry);
  const [introPhase, setIntroPhase] = useState<IntroPhase>('playing');

  // Matrix intro: plays on landing, fades out after 5s (click or any key skips it)
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
    addEntry({
      type: 'output',
      content: (
        <div className="mb-4 text-primary/80">
          <pre className="text-[10px] md:text-sm leading-none font-bold">
            {`
  _____   ____  _____ _______ ______ ____  _      _____ ____  
 |  __ \\ / __ \\|  __ \\__   __|  ____/ __ \\| |    |_   _/ __ \\ 
 | |__) | |  | | |__) | | |  | |__ | |  | | |      | || |  | |
 |  ___/| |  | |  _  /  | |  |  __|| |  | | |      | || |  | |
 | |    | |__| | | \\ \\  | |  | |   | |__| | |____ _| || |__| |
 |_|     \\____/|_|  \\_\\ |_|  |_|    \\____/|______|_____\\____/ 
`}
          </pre>
          <div className="mt-2 border-b border-primary/20 pb-2 mb-2">
            Welcome to Portfolio Terminal v1.0.0
          </div>
          <div className="text-white/60">Type <span className="text-primary font-bold">help</span> to see available commands.</div>
        </div>
      )
    });
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
          hint="Wake up, Neo... (press any key to skip)"
          className={`bg-black transition-opacity duration-700 ${introPhase === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onFadeEnd={introPhase === 'fading' ? () => setIntroPhase('done') : undefined}
        />
      )}
    </>
  );
}

export default App;
