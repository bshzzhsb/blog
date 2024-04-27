import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs, LinksFunction, MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import inspiringStypes from '~/styles/inspiring.css?url';
import Sidebar from '~/components/inspiring/sidebar';
import { getDocumentListFromVercelKV } from '~/.server/inspiring/api';
import { commitSession, getSession } from '~/session';
import { TEXT } from '~/constants';

export const meta: MetaFunction = () => [{ title: `${TEXT.editorMetaTitle} - ${TEXT.siteName}` }];

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: inspiringStypes,
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log('[debug] in editor loader');
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has(process.env.TIPTAP_TOKEN_KEY)) {
    return redirect('/login');
  }

  const documentList = await getDocumentListFromVercelKV();
  return json(documentList, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

const EditorIndex: React.FC = () => {
  const docList = useLoaderData<typeof loader>();

  return (
    <div className="flex w-screen h-screen">
      <div className="w-64 p-2 border-r-2 border-gray-300">
        <Sidebar docList={docList} />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default EditorIndex;
