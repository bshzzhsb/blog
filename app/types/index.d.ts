interface Window {
  ENV: {
    GA_TRACKING_ID?: string;
    VERCEL_ANALYTICS_ID?: string;
  };
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GA_TRACKING_ID: string;
      VERCEL_ANALYTICS_ID: string;
    }
  }

  interface Window {
    ENV: {
      VERCEL_ANALYTICS_ID: string;
    };
  }
}

export {};
