import type { ActionFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import { vercelKv } from '~/.server/vercel-kv';
import { uploadImage } from '~/.server/cloudinary';
import { liveblocks } from '~/.server/liveblocks';
import { remixAuth } from '~/.server/auth';

import { getDocContent } from '~/utils/get-doc-content';
import { Document } from '~/types/inspiring';

export const action: ActionFunction = async ({ request, params }) => {
  if (!(await remixAuth.auth(request))?.user) {
    return redirect('/login');
  }

  const [api, ...rest] = params['*']?.split('/') ?? [];

  switch (api) {
    case 'create': {
      const id = `blog.${crypto.randomUUID()}`;
      await liveblocks.createRoom(id, {
        defaultAccesses: ['room:write'],
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

      await liveblocks.updateRoom(id, {
        metadata: { title: getDocContent(data.title) },
      });
      return json({ ok: true });
    }
    case 'publish': {
      const [id] = rest;
      const data: Document = await request.json();
      const newRoomId = getDocContent(data.title).trim().replaceAll(/\s/g, '-');

      // Update room id to title.
      if (id !== newRoomId) {
        await liveblocks.updateRoomId({ currentRoomId: id, newRoomId });
      }

      // TODO: We don't need to get document again.
      const document = await liveblocks.getRoom(newRoomId);

      if (!document) {
        throw new Error(`cannot find document by id: ${id}`);
      }

      await vercelKv.saveDocument(newRoomId, data, document.createdAt);
      if (id !== newRoomId) {
        await vercelKv.deleteDocument(id);
      }

      return redirect(`/editor/${encodeURIComponent(newRoomId)}`);
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
      // NOTE: This will not delete the saved document.
      await liveblocks.deleteRoom(id);
      return json({ ok: true });
    }
  }

  return json(null, { status: 400 });
};
