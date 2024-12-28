import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { remixAuth } from '~/.server/auth';

import Sidebar from '~/page-components/inspiring/editor/sidebar';
import { liveblocksApi, LiveblocksGetCommands } from '~/.server/liveblocks';
import { TEXT } from '~/constants';
import { Path } from '~/constants/path';

export const meta: MetaFunction = () => [{ title: `${TEXT.editorMetaTitle} - ${TEXT.siteName}` }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await remixAuth.auth(request);

  if (!session?.user) {
    return redirect(Path.LOGIN);
  }

  const documentList = await liveblocksApi.get(LiveblocksGetCommands.ROOMS);
  return json(documentList.data);
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
