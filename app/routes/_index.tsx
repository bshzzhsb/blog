import type { LoaderFunction, MetaFunction } from '@vercel/remix';
import { redirect } from '@vercel/remix';

import { TEXT } from '~/constants';

export const meta: MetaFunction = () => [{ title: TEXT.siteName }];

export const loader: LoaderFunction = async () => {
  return redirect('/blog');
};
