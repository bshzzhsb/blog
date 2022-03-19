import { motion } from 'framer-motion';

import { useTheme } from '~/utils/theme';

const CIRCLES = Array.from({ length: 6 }).map((_, i) => ({
  x: 24 + 20 * Math.sin(((i * 60) / 180) * Math.PI),
  y: 24 - 20 * Math.cos(((i * 60) / 180) * Math.PI),
  r: 4,
}));
const SUN = 'M 24 12 A 12 12 0 1 0 24 36 A 12 12 0 1 0 24 12';
const MOON = 'M 24 12 A 12 12 0 1 0 36 24 A 8 8 0 0 1 24 12';

const variants = {
  dark: { scale: 1.75, rotate: 0 },
  light: { scale: 1, rotate: 90 },
};

const circlesVariant = {
  dark: { scale: 0, transition: { duration: 0 } },
  light: (i: number) => ({
    scale: 1,
    transition: {
      type: 'spring',
      delay: i * 0.075,
    },
  }),
};

export const ModeSwitcher: React.FC = () => {
  const [theme, setTheme] = useTheme();

  const handleChangeTheme = () => {
    setTheme((pre) => (pre === 'light' ? 'dark' : 'light'));
  };

  return (
    <motion.svg
      animate={theme}
      className="w-6 h-6 text-gray-800 cursor-pointer overflow-visible"
      fill="currentColor"
      viewBox="0 0 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleChangeTheme}
    >
      <motion.path
        initial={false}
        d={theme === 'dark' ? MOON : SUN}
        variants={variants}
        transition={{ type: 'spring' }}
        style={{ originX: 'center', originY: 'center' }}
        className="fill-gray-800 dark:fill-gray-200"
      />
      <g>
        {CIRCLES.map(({ x, y, r }, i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            custom={i}
            variants={circlesVariant}
            style={{ originX: 'center', originY: 'center' }}
          />
        ))}
      </g>
    </motion.svg>
  );
};
