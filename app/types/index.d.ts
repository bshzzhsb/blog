declare module '*.css';
declare module '*.txt';

interface Window {
  ENV: {
    VERCEL_ANALYTICS_ID?: string;
  };
}
