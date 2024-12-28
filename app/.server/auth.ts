import { Auth, createActionURL, setEnvDefaults, skipCSRFCheck } from '@auth/core';
import type { AuthConfig } from '@auth/core';
import type { Session } from '@auth/core/types';
import GithubProvider from '@auth/core/providers/github';

import { Path } from '~/constants/path';
import { getLogger, LogModule } from '~/utils/logger';

const logger = getLogger(LogModule.AUTH);

async function getAuthSession(request: Request, config: AuthConfig): Promise<Session | null> {
  setEnvDefaults(process.env, config);
  const url = createActionURL('session', 'http', new Headers(request.headers), process.env, config);

  const sessionRequest = new Request(url, { headers: { cookie: request.headers.get('cookie') ?? '' } });
  const response = await Auth(sessionRequest, config);
  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;

  if (response.status === 200) return data;

  throw new Error(data.message);
}

function RemixAuth(config: AuthConfig) {
  setEnvDefaults(process.env, config);

  return {
    signin: (request: Request) => {
      logger.info('signin');
      config.redirectProxyUrl = new URL('/auth/callback/github', request.url).toString();
      return Auth(request, config);
    },
    signout: (request: Request) => {
      logger.info('signout');
      return Auth(request, config);
    },
    callback: (request: Request) => {
      logger.info('callback');
      return Auth(request, config);
    },
    auth: (request: Request) => {
      logger.info('auth');
      return getAuthSession(request, config);
    },
  };
}

export const remixAuth = RemixAuth({
  providers: [GithubProvider],
  skipCSRFCheck,
  callbacks: {
    redirect() {
      return Path.EDITOR;
    },
    signIn({ profile }) {
      return !!profile?.email?.includes(process.env.AUTH_EMAIL);
    },
  },
});
