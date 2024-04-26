import type { ActionFunction } from '@vercel/remix';
import { json, redirect } from '@vercel/remix';

import {
  createDocument,
  saveAllDocumentsTitlesToVercelKV,
  saveDocumentTitleToVercelKV,
  saveDocumentToVercel,
} from '~/.server/inspiring/api';
import { uploadImage } from '~/.server/cloudinary';
import { getSession } from '~/session';

export const action: ActionFunction = async ({ request, params }) => {
  console.log('editor.api', params);
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has(process.env.TIPTAP_TOKEN_KEY)) {
    return redirect('/login');
  }

  const [api, ...rest] = params['*']?.split('/') ?? [];

  switch (api) {
    case 'save': {
      const [id] = rest;
      const data = await request.json();

      if (!id || !data) {
        return json({}, { status: 400 });
      }

      console.log('api.$.save', id, data.title);
      await saveDocumentTitleToVercelKV(id, data);
      return json({ ok: true });
    }
    case 'create': {
      const id = `blog.${crypto.randomUUID()}`;
      await createDocument(id);
      return redirect(`/editor/${id}`);
    }
    case 'resync': {
      await saveAllDocumentsTitlesToVercelKV();
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

      console.log('dataURL', file.name, file.size, file.type);

      try {
        const url = await uploadImage(dataURL, file.type);
        return json(url);
      } catch (e) {
        return json({}, { status: 500 });
      }
    }
  }

  return json({ ok: true });
};
