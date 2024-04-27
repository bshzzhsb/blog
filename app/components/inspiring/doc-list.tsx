import React from 'react';
import { Link, useFetcher } from '@remix-run/react';

import type { DocumentList } from '~/types/inspiring';
import { getDocContent } from '~/utils/get-doc-content';
import { Delete } from '../icon';

interface DocListProps {
  docList: DocumentList;
}

const DocList: React.FC<DocListProps> = React.memo(props => {
  const { docList } = props;
  const deleteFetcher = useFetcher();

  const handleDelete = (id: string) => {
    deleteFetcher.submit(null, { action: `/editor/api/delete/${id}`, method: 'DELETE' });
  };

  return (
    <div className="flex flex-col gap-0.5 text-sm leading-5 text-gray-700">
      {docList
        .sort((a, b) => b.savedAt - a.savedAt)
        .map(doc => (
          <Link
            key={doc.id}
            to={`/editor/${encodeURIComponent(doc.id)}`}
            className="group flex items-center px-2 py-1 rounded hover:bg-gray-200"
          >
            <span className="flex-1 line-clamp-1">{getDocContent(doc.title) || 'Undefined'}</span>
            <button
              className="hidden group-hover:block w-5 h-5 p-0.5 rounded hover:bg-gray-300"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete(doc.id);
              }}
            >
              <Delete />
            </button>
          </Link>
        ))}
    </div>
  );
});

export default DocList;
