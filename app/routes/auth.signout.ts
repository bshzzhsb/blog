import { type ActionFunction } from '@vercel/remix';

import { remixAuth } from '~/.server/auth';

export const action: ActionFunction = async ({ request }) => {
  return remixAuth.signout(request);
};
