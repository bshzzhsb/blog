import { ReactNodeViewRenderer } from '@tiptap/react';
import { Heading as BaseHeading } from '@tiptap/extension-heading';

import { HeadingComponent } from './component';

export const Heading = BaseHeading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadingComponent);
  },
});
