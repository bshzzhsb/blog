import type { JSONContent } from '@tiptap/react';

export type DocumentListItem = { id: string; title: JSONContent; savedAt: number };
export type DocumentList = DocumentListItem[];

export type Document = {
  title: JSONContent;
  content: JSONContent;
};

export type BlogDocument = {
  title: JSONContent;
  content: JSONContent;
  createdAt?: number;
  updatedAt?: number;
};

export type BlogList = {
  slug: string;
  title: string;
  createdAt?: number;
  updatedAt?: number;
}[];
