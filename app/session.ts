import { createCookie, createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  tiptapToken: string;
};

type SessionFlashData = {
  error: string;
};

const cookie = createCookie('__session', {
  httpOnly: true,
  maxAge: 60 * 60 * 24,
  secrets: ['s3cret1'],
  secure: true,
});

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie,
});

export { getSession, commitSession, destroySession };
