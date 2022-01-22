import React from 'react';

interface HamburgerProps {
  className?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Hamburger: React.FC<HamburgerProps> = ({ className, open, setOpen }) => (
  <div className={className + ' w-6 h-[1.25rem] cursor-pointer'} onClick={() => setOpen((pre) => !pre)}>
    <div className='relative'>
    <div
      className={
        'absolute top-0 left-0 w-6 h-0.5 bg-black dark:bg-white rounded-sm transition duration-300 ' +
        (open ? 'rotate-45 scale-150 translate-y-2' : '')
      }
    />
    <div
      className={
        'absolute top-2 left-0 w-6 h-0.5 bg-black dark:bg-white rounded-sm transition duration-300 ' +
        (open ? 'scale-0' : '')
      }
    />
    <div
      className={
        'absolute top-4 left-0 w-6 h-0.5 bg-black dark:bg-white rounded-sm transition duration-300 ' +
        (open ? '-rotate-45 scale-150 -translate-y-2' : '')
      }
    /></div>
  </div>
);

export default Hamburger;
