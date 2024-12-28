import type { ActionFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { deleteDocument, saveDocumentToVercel } from '~/.server/inspiring/api';
import { uploadImage } from '~/.server/cloudinary';
import { liveblocksApi, LiveblocksPostCommands, RoomAccess } from '~/.server/liveblocks';
import { getDocContent } from '~/utils/get-doc-content';
import { remixAuth } from '~/.server/auth';

export const action: ActionFunction = async ({ request, params }) => {
  if (!(await remixAuth.auth(request))?.user) {
    return redirect('/login');
  }

  const [api, ...rest] = params['*']?.split('/') ?? [];

  switch (api) {
    case 'create': {
      const id = `blog.${crypto.randomUUID()}`;
      await liveblocksApi.post(LiveblocksPostCommands.ROOMS, {
        id,
        defaultAccesses: [RoomAccess.WRITE],
        metadata: {
          title: 'Default Title',
        },
      });
      return redirect(`/editor/${id}`);
    }
    case 'save': {
      const [id] = rest;
      const data = await request.json();

      if (!id || !data) {
        return json({}, { status: 400 });
      }

      await liveblocksApi.post(
        LiveblocksPostCommands.ROOMS_ROOM_ID,
        { metadata: { title: getDocContent(data.title) } },
        { roomId: id },
      );
      return json({ ok: true });
    }
    case 'publish': {
      const [id] = rest;
      const data = await request.json();
      await saveDocumentToVercel(id, data);
      return json({ ok: true });
    }
    case 'upload_image': {
      const data = await request.formData();
      const file = data.get('file');

      if (!file || typeof file === 'string') {
        return json('Error file type', { status: 404 });
      }

      const dataURL = Buffer.from(await file.arrayBuffer()).toString('base64');

      try {
        const url = await uploadImage(dataURL, file.type);
        return json(url);
      } catch (e) {
        return json({}, { status: 500 });
      }
    }
    case 'delete': {
      const [id] = rest;
      await deleteDocument(id);
      return json({ ok: true });
    }
  }

  return json(null, { status: 400 });
};
