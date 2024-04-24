import React from 'react';
import { Form, useFetcher, useNavigation } from '@remix-run/react';

import type { DocumentList } from '~/types/tiptap';
import { Add, Loading, Reset } from '~/components/icon';
import DocList from './doc-list';

interface SidebarProps {
  docList: DocumentList;
}

const Sidebar: React.FC<SidebarProps> = React.memo(props => {
  const { docList } = props;
  const navigation = useNavigation();
  const fetcher = useFetcher();

  return (
    <div className="font-medium text-lg">
      <div className="flex justify-between">
        <div></div>
        <fetcher.Form method="POST" action="/editor/api/resync">
          <button
            name="_action"
            value="RESYNC"
            type="submit"
            className="flex justify-center items-center w-6 h-6 rounded cursor-pointer hover:bg-gray-200"
          >
            <Reset />
          </button>
        </fetcher.Form>
        <Form method="POST" action="/editor/api/create">
          <button
            name="_action"
            value="CREATE"
            type="submit"
            className="flex justify-center items-center w-6 h-6 rounded cursor-pointer hover:bg-gray-200"
          >
            {navigation.formAction === '/editor/api/create' ? <Loading /> : <Add />}
          </button>
        </Form>
      </div>
      <DocList docList={docList} />
    </div>
  );
});

export default Sidebar;
