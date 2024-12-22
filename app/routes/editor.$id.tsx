import { redirect, useLoaderData, useParams } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@vercel/remix';

import { InspiringEditor } from '~/page-components/inspiring';
import { getSession } from '~/session';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const key = process.env.TIPTAP_TOKEN_KEY;
  if (session.has(key)) {
    return json({
      tiptapToken: session.get(key),
      liveblockPublicApiKey: process.env.LIVEBLOCKS_API_PUBLIC_KEY,
    });
  }

  return redirect('/login');
};

const Editor: React.FC = () => {
  const { id } = useParams();
  const { tiptapToken, liveblockPublicApiKey } = useLoaderData<typeof loader>();

  if (!id || !tiptapToken) return null;

  return (
    <InspiringEditor
      key={id}
      id={id}
      token={tiptapToken}
      liveblocksPublicApiKey={liveblockPublicApiKey}
      className="h-full overflow-y-auto"
    />
  );
};

export default Editor;
