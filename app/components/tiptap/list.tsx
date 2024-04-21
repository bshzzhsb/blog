import React from 'react';
import { Link } from '@remix-run/react';

import type { TiptapDocument } from '~/types/tiptap';

interface TiptapListProps {
  docList: TiptapDocument[];
}

const TiptapList: React.FC<TiptapListProps> = React.memo(props => {
  const { docList } = props;

  return (
    <div className="font-medium text-lg">
      {docList.map(doc => (
        <Link key={doc.name} to={`/editor/${encodeURIComponent(doc.name)}`}>
          {doc.name}
        </Link>
      ))}
    </div>
  );
});

export default TiptapList;
