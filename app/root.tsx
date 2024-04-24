import { useEffect, useState } from 'react';
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useLocation } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import type { MetaFunction } from '@vercel/remix';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/remix';

import Progress from './page-components/progress';
import { Dinosaur } from './components/icon';
import { GTag } from '~/components/gtag';
import { ThemeContext } from '~/utils/theme';
import type { Theme } from '~/utils/theme';
import { gtag } from '~/utils/gtag';
import { TEXT } from '~/constants';
import tailwindStyles from '~/styles/tailwind.css?url';
import codeStyles from '~/styles/code.css?url';

export const meta: MetaFunction = () => [{ title: TEXT.siteName }];

export const links: LinksFunction = () => [
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

export const loader = () => {
  return {
    ENV: {
      GA_TRACKING_ID: process.env.GA_TRACKING_ID,
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
    },
  };
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const location = useLocation();
  const { ENV } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!ENV.GA_TRACKING_ID) return;
    gtag.pageView(location.pathname, ENV.GA_TRACKING_ID);
  }, [ENV.GA_TRACKING_ID, location]);

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
          {ENV.GA_TRACKING_ID && <GTag gaTrackingId={ENV.GA_TRACKING_ID} />}
        </head>
        <body className="background text-primary font-sans transition duration-500">
          <Outlet />
          <Progress />
          <ScrollRestoration />
          <Analytics />
          <SpeedInsights />
          <script dangerouslySetInnerHTML={{ __html: `window.ENV = ${JSON.stringify(ENV)}` }} />
          <Scripts />
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
