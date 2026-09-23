import React, { useEffect, useRef, useState } from 'react';
import { getPrimaryColor } from '../../utils/theme';

const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

const randomChar = () => alphabet.charAt(Math.floor(Math.random() * alphabet.length));

// Text that starts as random glyphs and locks in left to right, like it's being decrypted
const DecryptText: React.FC<{ text: string; duration: number }> = ({ text, duration }) => {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, randomChar));

  useEffect(() => {
    const start = performance.now();
    const interval = setInterval(() => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const locked = Math.floor(progress * text.length);
      setDisplay(
        text
          .split('')
          .map((char, i) => (i < locked || char === ' ' ? char : randomChar()))
          .join('')
      );
      if (progress === 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [text, duration]);

  return <>{display}</>;
};

interface MatrixEffectProps {
  hint?: string;
  className?: string;
  // Centered text revealed with a decrypt effect (used by the landing intro)
  title?: string;
  subtitle?: string;
  onFadeEnd?: () => void;
}

export const MatrixEffect: React.FC<MatrixEffectProps> = ({
  hint = 'Press F5 to exit the Matrix',
  className = 'pointer-events-none fade-in',
  title,
  subtitle,
  onFadeEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const color = getPrimaryColor();
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    const draw = () => {
        // Black with opacity for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            ctx.fillText(randomChar(), i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    };

    const interval = setInterval(draw, 30);

    // Resize handler
    const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-50 ${className}`} onTransitionEnd={onFadeEnd}>
      <canvas ref={canvasRef} className="block" />
      {title && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center pointer-events-none">
          <div className="bg-black/70 px-6 py-4 rounded">
            <div className="font-mono font-bold text-primary text-shadow text-2xl sm:text-4xl md:text-5xl tracking-widest">
              <DecryptText text={title} duration={1400} />
            </div>
            {subtitle && <div className="mt-3 font-mono text-white/70 text-xs sm:text-sm">{subtitle}</div>}
          </div>
        </div>
      )}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white bg-black/80 px-4 py-2 rounded border border-primary/60 text-sm whitespace-nowrap">
        {hint}
      </div>
    </div>
  );
};
