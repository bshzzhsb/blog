import { Liveblocks } from '@liveblocks/node';

export const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_API_SECRET_KEY,
});
