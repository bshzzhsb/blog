import React from 'react';
import { Form, useNavigation } from '@remix-run/react';

import { Room } from '~/.server/liveblocks';
import { Icon } from '~/components/icon';

import DocList from './doc-list';

interface SidebarProps {
  docList: Room[];
}

const Sidebar: React.FC<SidebarProps> = React.memo(props => {
  const { docList } = props;
  const navigation = useNavigation();

  return (
    <div className="font-semibold">
      <div className="flex justify-between mb-4 text-lg">
        <div className="px-2 py-1">
          <strong>Inspiring</strong>
        </div>
        <div className="flex items-center gap-1">
          <Form method="POST" action="/editor/api/create">
            <button
              name="_action"
              value="CREATE"
              type="submit"
              className="flex justify-center items-center w-7 h-7 rounded cursor-pointer hover:bg-gray-200"
            >
              {navigation.formAction === '/editor/api/create' ? (
                <Icon name="loading" className="w-6 h-6 animate-spin ease-in-out" />
              ) : (
                <Icon name="plus-solid" className="w-6 h-6" />
              )}
            </button>
          </Form>
        </div>
      </div>
      <DocList docList={docList} />
    </div>
  );
});

export default Sidebar;
