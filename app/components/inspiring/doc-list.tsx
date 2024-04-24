import React from 'react';
import { Link } from '@remix-run/react';

import type { DocumentList } from '~/types/tiptap';
import { getDocContent } from '~/utils/get-doc-content';

interface DocListProps {
  docList: DocumentList;
}

const DocList: React.FC<DocListProps> = React.memo(props => {
  const { docList } = props;

  return (
    <div className="flex flex-col">
      {docList
        .sort((a, b) => b.savedAt - a.savedAt)
        .map(doc => (
          <Link
            key={doc.id}
            to={`/editor/${encodeURIComponent(doc.id)}`}
            className="px-2 py-1 rounded hover:bg-gray-200"
          >
            {getDocContent(doc.title) || 'Undefined'}
          </Link>
        ))}
    </div>
  );
});

export default DocList;
