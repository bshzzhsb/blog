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

      KV_BLOG_KEY: string;

      USER_PASSWORD: string;
      USER_PASSWORD_SECRET_ID: string;

      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;

      LIVEBLOCKS_API_PUBLIC_KEY: string;
      LIVEBLOCKS_API_SECRET_KEY: string;

      AUTH_EMAIL: string;
    }
  }

  interface Window {
    ENV: {
      VERCEL_ANALYTICS_ID: string;
    };
  }
}

export {};
