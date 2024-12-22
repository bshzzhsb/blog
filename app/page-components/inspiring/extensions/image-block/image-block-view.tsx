import { memo, useCallback, useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { Editor } from '@tiptap/react';

import { classnames } from '~/utils/classname';
import { NodeViewConstructor } from '@tiptap/pm/view';

interface ImageBlockViewProps {
  editor: Editor;
  getPos: () => number;
  node: Parameters<NodeViewConstructor>[0];
  updateAttributes: (attrs: Record<string, string>) => void;
}

interface ImageBlockAttrs {
  src: string;
  align: 'left' | 'right' | 'center';
  width: string;
}

const ImageBlockView: React.FC<ImageBlockViewProps> = memo(props => {
  const { editor, getPos, node } = props;
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const { src } = node.attrs as ImageBlockAttrs;

  const wrapperClassName = classnames(
    node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    node.attrs.align === 'center' ? 'mx-auto' : '',
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width: node.attrs.width }}>
        <div contentEditable={false} ref={imageWrapperRef}>
          <img className="block" src={src} alt="" onClick={onClick} />
        </div>
      </div>
    </NodeViewWrapper>
  );
});

export default ImageBlockView;
