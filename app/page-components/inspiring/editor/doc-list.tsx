import React from 'react';
import { Link, useFetcher } from '@remix-run/react';

import { Room } from '~/.server/liveblocks';
import { Icon } from '~/components/icon';

interface DocListProps {
  docList: Room[];
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
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(doc => (
          <Link
            key={doc.id}
            to={`/editor/${encodeURIComponent(doc.id)}`}
            className="group flex items-center px-2 py-1 rounded hover:bg-gray-200"
          >
            <span className="flex-1 line-clamp-1">{doc.metadata?.title || 'Undefined'}</span>
            <button
              className="hidden group-hover:block w-5 h-5 p-0.5 rounded hover:bg-gray-300"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete(doc.id);
              }}
            >
              <Icon name="trash-can-regular" />
            </button>
          </Link>
        ))}
    </div>
  );
});

export default DocList;
