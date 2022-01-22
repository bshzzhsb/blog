import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '~/utils/theme';

interface ModeSwitcherProps {
  maskId: string;
}

type Theme = 'light' | 'dark';

// SSR: sun small R; SBR: sun big R; MR: moon R
const [SSR, SBR, MR, R] = [4, 12, 20, 24];

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ maskId }) => {
  const [theme, setTheme] = useTheme();
  const cs = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => [
        R + MR * Math.sin(((i * 60) / 180) * Math.PI),
        R - MR * Math.cos(((i * 60) / 180) * Math.PI),
      ]),
    [],
  );

  const handleChangeTheme = () => {
    setTheme((pre) => (pre === 'light' ? 'dark' : 'light'));
  };

  return (
    <svg
      className="w-6 h-6 text-gray-800 cursor-pointer"
      fill="currentColor"
      viewBox={`0 0 ${R * 2} ${R * 2}`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleChangeTheme}
    >
      <mask id={maskId}>
        <rect x="0" y="0" width={R * 2} height={R * 2} className="fill-gray-200"></rect>
        {theme === 'dark' && <circle cx={(R * 3) / 2} cy={R / 2} r={MR} className="fill-black"></circle>}
      </mask>
      <circle
        cx={R}
        cy={R}
        r={theme === 'light' ? SBR : MR}
        mask={`url(#${maskId})`}
        className={
          'fill-gray-800 dark:fill-gray-200 origin-center ' +
          `${theme === 'dark' ? 'transition-mode-switcher duration-500' : 'rotate-90'}`
        }
      ></circle>
      <g>
        {cs.map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={SSR}
            className={(theme === 'light' ? 'scale-100 transition duration-500' : 'scale-0') + ' origin-center'}
            style={{ transitionDelay: theme === 'light' ? `${i * 75}ms` : undefined }}
          ></circle>
        ))}
      </g>
    </svg>
  );
};
