import { useLoaderData, useParams } from '@remix-run/react';
import { json } from '@vercel/remix';

import { InspiringEditor } from '~/page-components/inspiring';

export const loader = async () => {
  return json({
    liveblockPublicApiKey: process.env.LIVEBLOCKS_API_PUBLIC_KEY,
  });
};

const Editor: React.FC = () => {
  const { id } = useParams();
  const { liveblockPublicApiKey } = useLoaderData<typeof loader>();

  if (!id) return null;

  return (
    <InspiringEditor
      key={id}
      id={id}
      liveblocksPublicApiKey={liveblockPublicApiKey}
      className="h-full overflow-y-auto"
    />
  );
};

export default Editor;
