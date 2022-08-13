import { useEffect, useState } from 'react';
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { MetronomeLinks } from '@metronome-sh/react';

import Navbar from '~/page-components/navbar';
import Footer from '~/page-components/footer';
import Progress from './page-components/progress';
import { Dinosaur } from './components/icon';
import { ThemeContext } from '~/utils/theme';
import type { Theme } from '~/utils/theme';
import { LINKS, TEXT } from '~/constants';
import tailwindStyles from '~/styles/tailwind.css';
import codeStyles from '~/styles/code.css';

export const meta: MetaFunction = () => ({ title: TEXT.siteName });

export const links = () => [
  {
    rel: 'stylesheet',
    href: tailwindStyles,
  },
  {
    rel: 'stylesheet',
    href: codeStyles,
  },
  {
    rel: 'preload',
    as: 'font',
    href: '/fonts/Wotfard-Regular.woff2',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload',
    as: 'font',
    href: '/fonts/Sriracha-Regular.woff2',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
];

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const location = useLocation();
  const link = LINKS.find((link) => link.to === location.pathname);
  const withHeader = link?.withHeader ?? true;
  const withFooter = link?.withFooter ?? true;

  useEffect(() => {
    const theme = localStorage.getItem('theme') as Theme;
    setTheme(theme ?? 'light');
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', theme);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <Meta />
          <Links />
          <MetronomeLinks />
        </head>
        <body className="background text-primary font-sans transition duration-500">
          {withHeader && <Navbar />}
          <main className="min-h-[calc(100vh-10.5rem)]">
            <Outlet />
          </main>
          {withFooter && <Footer text={TEXT.footer} />}
          <Progress />
          <ScrollRestoration />
          <Scripts />
          {process.env.NODE_ENV === 'development' && <LiveReload />}
        </body>
      </html>
    </ThemeContext.Provider>
  );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Oh no...</title>
        <Links />
      </head>
      <body>
        <div className="flex flex-col justify-center items-center w-screen h-screen">
          <Dinosaur className="w-36 h-36 mb-4" />
          <p className="mb-4">{TEXT.error}</p>
          <Link className="mb-8 text-blue-500 hover:underline" to="/">
            {TEXT.backToHome}
          </Link>
        </div>
        <Scripts />
      </body>
    </html>
  );
};
