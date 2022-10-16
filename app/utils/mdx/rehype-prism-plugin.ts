import { visit } from 'unist-util-visit';
import type { Node, Visitor } from 'unist-util-visit';
import type { Refractor } from 'refractor/lib/core';

type UnistNode = Node & {
  children?: UnistNode[];
  properties?: { className?: string[] };
  tagName?: string;
  value?: string;
};

let refractor: Refractor;

async function getRefractor() {
  if (!refractor) {
    const { refractor: _ } = await import('refractor');
    refractor = _;
  }
  return refractor;
}

getRefractor();

export default function rehypePrismPlugin() {
  function getLanguage(node: UnistNode) {
    const classList = node?.properties?.className || [];

    for (const item of classList) {
      if (item.startsWith('language-')) {
        return item.slice(9).toLocaleLowerCase();
      }
    }

    return null;
  }

  function visitor(node: UnistNode, _: number | null, parent: UnistNode) {
    if (parent?.tagName !== 'pre' || node.tagName !== 'code') return;

    const lang = getLanguage(node) ?? '';

    if (parent.properties) {
      parent.properties.className = [...(parent.properties.className ?? []), `language-${lang}`];
    }

    node.children = refractor.highlight(hastToString(node), lang).children;
  }

  return (tree: UnistNode) => {
    visit(tree, null, visitor as Visitor);
  };
}

function hastToString(node: UnistNode) {
  function one(node: UnistNode): string {
    if (node.type === 'text') {
      return node.value ?? '';
    }

    return node.children ? all(node) : '';
  }

  function all(node: UnistNode): string {
    if (!node.children) return '';
    return node.children.map(child => one(child)).join('');
  }

  return node.children ? all(node) : one(node);
}
