import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface HamburgerProps {
  className?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PathProps {
  variant: Variants;
}

const Path: React.FC<PathProps> = ({ variant }) => (
  <motion.path strokeWidth="5" strokeLinecap="round" className="stroke-black dark:stroke-white" variants={variant} />
);

const Hamburger: React.FC<HamburgerProps> = ({ className, open, setOpen }) => (
  <div className={className + ' cursor-pointer'} onClick={() => setOpen((pre) => !pre)}>
    <motion.svg
      animate={open ? 'open' : 'closed'}
      className="w-7 h-7 text-gray-800 cursor-pointer overflow-visible"
      fill="currentColor"
      viewBox="0 0 48 48"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path variant={{ closed: { d: 'M 4 8 L 44 8' }, open: { d: 'M 4 4 L 44 44' } }} />
      <Path variant={{ closed: { d: 'M 4 24 L 44 24' }, open: { d: 'M 24 24 L 24 24' } }} />
      <Path variant={{ closed: { d: 'M 4 40 L 44 40' }, open: { d: 'M 4 44 L 44 4' } }} />
    </motion.svg>
  </div>
);

export default Hamburger;
