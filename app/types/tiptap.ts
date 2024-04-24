import type { JSONContent } from '@tiptap/react';

export type TiptapDocumentList = {
  name: string;
  size: number;
  created_at: string;
  updated_at: string;
}[];

export type DocumentList = { id: string; title: JSONContent; savedAt: number }[];

export type Document = {
  title: JSONContent;
  content: JSONContent;
};

export type EditorUser = {
  name: string;
};

export type BlogDocument = {
  title: JSONContent;
  content: JSONContent;
  size?: number;
  createdAt?: number;
  updatedAt?: number;
};

export type BlogList = {
  slug: string;
  title: string;
  createdAt?: number;
  updatedAt?: number;
}[];
