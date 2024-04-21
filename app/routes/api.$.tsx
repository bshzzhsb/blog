import { ActionFunction, json } from '@vercel/remix';
import { createDocument } from '~/.server/tiptap/api';

export const action: ActionFunction = async ({ request, params }) => {
  console.log('api.$action', params);

  const paths = params['*']?.split('/') ?? [];

  if (paths[0]?.startsWith('save')) {
    const data = (await request.body?.getReader().read())?.value;
    const title = paths[1];

    if (!title || !data) {
      return json({}, { status: 400 });
    }

    console.log('api.$.save', title, data.length);
    try {
      await createDocument(title, data);
    } catch (e) {
      console.log('api.$action error', e);
    }
  }

  return json({ success: true });
};
