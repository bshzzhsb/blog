import { LoaderFunction, redirect } from '@remix-run/node';
import { type ActionFunction } from '@vercel/remix';

import { remixAuth } from '~/.server/auth';

import { Path } from '~/constants/path';

export const action: ActionFunction = async ({ request, params }) => {
  switch (params.action) {
    case 'signin':
      return remixAuth.signin(request);
    default:
      return redirect(Path.LOGIN);
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  switch (params.action) {
    case 'callback':
      return remixAuth.callback(request);
    default:
      return redirect(Path.LOGIN);
  }
};
