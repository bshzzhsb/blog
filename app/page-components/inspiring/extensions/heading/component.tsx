import { NodeViewWrapper, NodeViewContent, NodeViewProps, mergeAttributes } from '@tiptap/react';
import { Icon } from '~/components/icon';
import { classnames } from '~/utils/classname';

export function HeadingComponent(props: NodeViewProps) {
  console.log(props);
  const { level, id } = props.node.attrs;
  const as = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const attributes = mergeAttributes(props.extension.options.HTMLAttributes, { id, class: 'heading relative group' });

  return (
    <NodeViewWrapper as={as} {...attributes}>
      <span
        className={classnames('absolute t-0 left-0 -translate-x-full hidden group-hover:flex h-full px-4 items-center')}
        contentEditable={false}
      >
        <Icon
          name={`${as}-regular` as 'h1-regular'}
          className={classnames('opacity-60', {
            'w-8 h-6': level === 1,
            'w-7 h-5': level === 2,
            'w-6 h-4': level === 3 || level === 4 || level === 5 || level === 6,
          })}
        />
      </span>
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
