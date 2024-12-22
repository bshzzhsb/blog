import { LiveblocksGetCommands } from './types';
import type {
  LiveblocksDelete,
  LiveblocksDeleteCommands,
  LiveblocksGet,
  LiveblocksPost,
  LiveblocksPostCommands,
} from './types';

export * from './types';

const LIVEBLOCKS_API_HOST = 'https://api.liveblocks.io';
const LIVEBLOCKS_API_BASE_URL = 'v2';

type HttpMethods = 'GET' | 'POST' | 'DELETE';

function getURL(path: string) {
  return new URL(`${LIVEBLOCKS_API_BASE_URL}/${path.replace(/^\/+/, '')}`, LIVEBLOCKS_API_HOST);
}

async function api(path: string, method: HttpMethods, data?: BodyInit) {
  const url = path.replace(/\/$/, '');
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${process.env.LIVEBLOCKS_API_SECRET_KEY}`);

  if (method === 'POST') {
    headers.append('Content-Type', 'application/json');
  }

  console.log('api', method, url);

  return fetch(url, { method, headers, body: data });
}

type OptionalIfUndefined<P, Q> = Q extends undefined
  ? P extends undefined
    ? [params?: P, pathParams?: Q]
    : [params: P, pathParams?: Q]
  : [params: P, pathParams: Q];

async function get<T extends LiveblocksGetCommands>(
  command: T,
  ...[params, pathParams]: OptionalIfUndefined<LiveblocksGet[T]['request'], LiveblocksGet[T]['pathParams']>
) {
  let path: string = command;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      path = command.replace(`{${key}}`, value);
    });
  }

  const url = getURL(path);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await api(url.toString(), 'GET');
  const a = await response.json();
  return a as Promise<LiveblocksGet[T]['response']>;
}

async function post<T extends LiveblocksPostCommands>(
  command: T,
  ...[params, pathParams]: OptionalIfUndefined<LiveblocksPost[T]['request'], LiveblocksPost[T]['pathParams']>
) {
  let path: string = command;

  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      path = command.replace(`{${key}}`, value);
    });
  }

  const url = getURL(path);

  const response = await api(url.toString(), 'POST', JSON.stringify(params));
  return response.json() as Promise<LiveblocksPost[T]['response']>;
}

async function _delete<T extends LiveblocksDeleteCommands>(
  command: T,
  ...[params, pathParams]: OptionalIfUndefined<LiveblocksDelete[T]['request'], LiveblocksDelete[T]['pathParams']>
) {
  let path: string = command;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      path = command.replace(`{${key}}`, value);
    });
  }

  const url = getURL(path);

  if (params) {
    Object.entries(params as Record<string, string>).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return await api(url.toString(), 'DELETE');
}

export const liveblocksApi = { get, post, delete: _delete };
