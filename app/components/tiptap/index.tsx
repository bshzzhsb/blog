import React, { useEffect, useMemo } from 'react';
import * as Y from 'yjs';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Collaboration from '@tiptap/extension-collaboration';
import { TiptapCollabProvider } from '@hocuspocus/provider';

import { TIPTAP_APP_ID } from '~/constants';
import { classnames } from '~/utils/classname';

interface TiptapProps {
  docName: string;
  token: string;
  className?: string;
}

const Tiptap: React.FC<TiptapProps> = React.memo(props => {
  const { docName, token, className } = props;
  const ydoc = useMemo(() => new Y.Doc(), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Link.configure({ HTMLAttributes: { rel: undefined } }),
      Collaboration.configure({ document: ydoc }),
    ],
  });

  useEffect(() => {
    const provider = new TiptapCollabProvider({
      name: docName,
      appId: TIPTAP_APP_ID,
      token,
      // token: getCookie(TIPTAP_JWT_TOKEN_KEY),
      document: ydoc,
    });

    return () => {
      provider.destroy();
    };
  }, [docName, token, ydoc]);

  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        const yUpdateMessage = Y.encodeStateAsUpdate(ydoc);
        fetch(`/api/save/${docName}`, { method: 'POST', body: yUpdateMessage });
        console.log(yUpdateMessage);
      }
    };

    window.addEventListener('keydown', handleSave);

    return () => {
      window.removeEventListener('keydown', handleSave);
    };
  }, [docName, ydoc]);

  return <EditorContent className={classnames('tiptap-container', className)} editor={editor} />;
});

export default Tiptap;
