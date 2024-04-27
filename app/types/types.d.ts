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
      USER_PASSWORD: string;
      USER_PASSWORD_SECRET_ID: string;

      TIPTAP_APP_SECRET_ID: string;
      TIPTAP_API_SECRET_ID: string;
      TIPTAP_TOKEN_KEY: 'tiptapToken';

      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
    }
  }

  interface Window {
    ENV: {
      VERCEL_ANALYTICS_ID: string;
    };
  }
}

export {};
