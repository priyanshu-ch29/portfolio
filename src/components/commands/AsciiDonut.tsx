import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/terminal';

const WIDTH = 40;
// Monospace cells are ~1.8x taller than wide (0.6em x 1.1em line height)
const CELL_ASPECT = 1.8;
const HEIGHT = Math.ceil(WIDTH / CELL_ASPECT);
const SCALE_X = WIDTH * 0.6;
const SCALE_Y = SCALE_X / CELL_ASPECT;
// Brightness ramp from dim to bright
const LUMINANCE = '.,-~:;=!*#$@';

// One frame of Andy Sloane's donut.c: a lit, rotating torus rendered as text
const renderFrame = (a: number, b: number): string => {
  const output: string[] = new Array(WIDTH * HEIGHT).fill(' ');
  const zBuffer: number[] = new Array(WIDTH * HEIGHT).fill(0);
  const [sinA, cosA, sinB, cosB] = [Math.sin(a), Math.cos(a), Math.sin(b), Math.cos(b)];

  for (let theta = 0; theta < 6.28; theta += 0.07) {
    const [sinT, cosT] = [Math.sin(theta), Math.cos(theta)];
    for (let phi = 0; phi < 6.28; phi += 0.02) {
      const [sinP, cosP] = [Math.sin(phi), Math.cos(phi)];
      const circleX = cosT + 2;
      const depth = 1 / (sinP * circleX * sinA + sinT * cosA + 5);
      const t = sinP * circleX * cosA - sinT * sinA;

      const x = Math.floor(WIDTH / 2 + SCALE_X * depth * (cosP * circleX * cosB - t * sinB));
      const y = Math.floor(HEIGHT / 2 + SCALE_Y * depth * (cosP * circleX * sinB + t * cosB));
      const idx = x + WIDTH * y;
      const lum = Math.floor(8 * ((sinT * sinA - sinP * cosT * cosA) * cosB - sinP * cosT * sinA - sinT * cosA - cosP * cosT * sinB));

      if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && depth > zBuffer[idx]) {
        zBuffer[idx] = depth;
        output[idx] = LUMINANCE[Math.max(lum, 0)];
      }
    }
  }

  const rows: string[] = [];
  for (let row = 0; row < HEIGHT; row++) rows.push(output.slice(row * WIDTH, (row + 1) * WIDTH).join(''));
  return rows.join('\n');
};

export const AsciiDonut: React.FC = () => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;

    let a = 1;
    let b = 0.6;
    pre.textContent = renderFrame(a, b);
    if (prefersReducedMotion()) return;

    // Only spin while on screen, so old neofetch outputs scrolled out of view cost nothing
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(pre);

    // Write straight to the DOM instead of setState: ~20 frames/sec with no React re-renders
    const interval = setInterval(() => {
      if (!visible) return;
      a += 0.07;
      b += 0.03;
      pre.textContent = renderFrame(a, b);
    }, 50);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return <pre ref={preRef} aria-hidden className="text-primary text-shadow text-xs leading-[1.1] md:text-sm md:leading-[1.1] select-none shrink-0" />;
};
