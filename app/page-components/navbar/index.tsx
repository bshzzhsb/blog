import React, { useState } from 'react';
import { Link, useLocation } from "@remix-run/react";

import { ModeSwitcher } from '~/components/mode-switcher';
import Hamburger from '~/components/hamburger';
import { LINKS, TEXT } from '~/constants';

interface NavLinkProps {
  to: string;
  name: string;
  active?: boolean;
}

interface MobileNavLinkProps {
  to: string;
  name: string;
  active?: boolean;
  onClick: () => void;
}

interface MobileNavProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  path: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, name, active }) => (
  <li className={'hover:text-primary ' + (active ? '' : 'text-black/70 dark:text-white/70')}>
    <Link
      className={'block underlined hover:active text-xl font-semibold tracking-wide ' + (active ? 'active' : '')}
      to={to}
    >
      {name}
    </Link>
  </li>
);

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, name, active, onClick }) => (
  <li>
    <Link className={'block text-3xl font-semibold ' + (active ? 'active' : '')} to={to} onClick={onClick}>
      {name}
    </Link>
  </li>
);

const MobileNav: React.FC<MobileNavProps> = ({ visible, setVisible, path }) => (
  <div
    className={
      'fixed top-0 left-0 flex flex-col justify-center gap-32 w-screen h-screen px-8 backdrop-blur-xl z-10 ' +
      (visible ? '' : 'hidden')
    }
  >
    <ul className={'flex flex-col gap-8 font-medium'}>
      {LINKS.map((link) => (
        <MobileNavLink
          key={link.to}
          to={link.to}
          name={link.name}
          active={path.startsWith(link.to)}
          onClick={() => setVisible(false)}
        />
      ))}
    </ul>
    <ModeSwitcher />
  </div>
);

const Navbar = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="sticky top-0 background transition-[background-color] duration-500 z-10">
        <nav className="flex justify-between items-center max-w-5xl xl:max-w-6xl h-16 px-8 mx-auto z-10">
          <div className="flex items-center">
            <div className="mr-16">
              <Link to="/" className="font-semibold text-3xl">
                {TEXT.name}
              </Link>
            </div>
            <ul className={'relative md:flex md:items-center md:gap-8 h-16 hidden font-medium'}>
              {LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} name={link.name} active={location.pathname === link.to} />
              ))}
            </ul>
          </div>
          <div className="hidden md:flex pr-12 md:pr-0">
            <ModeSwitcher />
          </div>
        </nav>
      </div>
      <div className="md:hidden">
        <Hamburger
          className="fixed top-[1.125rem] right-8 z-20"
          open={mobileNavVisible}
          setOpen={setMobileNavVisible}
        />
        <MobileNav visible={mobileNavVisible} setVisible={setMobileNavVisible} path={location.pathname} />
      </div>
    </>
  );
};

export default Navbar;
