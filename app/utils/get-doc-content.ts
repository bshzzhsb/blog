import type { JSONContent } from '@tiptap/react';

export function getDocContent(node: JSONContent) {
  let title = '';

  if (node.type === 'text') {
    title = node.text ?? '';
    return title;
  }

  const hasTextChild = node.content?.some(child => child.type === 'text');

  if (!node.content) {
    return title;
  }

  for (const child of node.content) {
    title += getDocContent(child);
  }

  if (hasTextChild) {
    title += '\n';
  }

  return title;
}
