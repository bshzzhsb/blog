export enum LiveblocksGetCommands {
  ROOMS = '/rooms',
  ROOMS_ROOM_ID = '/rooms/{roomId}',
}

export enum LiveblocksPostCommands {
  ROOMS = '/rooms',
  ROOMS_ROOM_ID = '/rooms/{roomId}',
}

export enum LiveblocksDeleteCommands {
  ROOMS_ROOM_ID = '/rooms/{roomId}',
}

export type LiveblocksGet = {
  [LiveblocksGetCommands.ROOMS]: {
    request?: GetRoomsRequest;
    response: GetRoomsResponse;
    pathParams?: undefined;
  };
  [LiveblocksGetCommands.ROOMS_ROOM_ID]: {
    request?: undefined;
    response: GetRoomResponse;
    pathParams: GetRoomPathParams;
  };
};

export type LiveblocksPost = {
  [LiveblocksPostCommands.ROOMS]: {
    request: CreateRoomRequest;
    response: undefined;
    pathParams?: undefined;
  };
  [LiveblocksPostCommands.ROOMS_ROOM_ID]: {
    request: UpdateRoomRequest;
    response: undefined;
    pathParams: UpdateRoomPathParams;
  };
};

export type LiveblocksDelete = {
  [LiveblocksDeleteCommands.ROOMS_ROOM_ID]: {
    request?: undefined;
    pathParams: DeleteRoomPathParams;
  };
};

export interface GetRoomsRequest {
  limit?: number;
}

export enum RoomAccess {
  WRITE = 'room:write',
  READ = 'room:read',
  PRESENCE_WRITE = 'room:presence:write',
}

export type RoomMetadata = Record<string, string | string[]>;

export interface Room {
  type: 'room';
  id: string;
  createdAt: string; // '2022-07-13T14:32:50.697Z'
  lastConnectionAt: string; // '2022-08-04T21:07:09.380Z'
  metadata?: RoomMetadata;
  defaultAccesses: RoomAccess[];
  groupsAccesses?: Record<string, RoomAccess[]>;
  usersAccesses?: Record<string, RoomAccess[]>;
}

export interface GetRoomsResponse {
  nextCursor: string;
  nextPage: string;
  data: Room[];
}

export interface GetRoomResponse extends Room {}

export interface GetRoomPathParams {
  roomId: string;
}

export interface DeleteRoomPathParams {
  roomId: string;
}

export interface CreateRoomRequest {
  id: string;
  metadata?: RoomMetadata;
  defaultAccesses: RoomAccess[];
  groupsAccesses?: Record<string, RoomAccess[]>;
  usersAccesses?: Record<string, RoomAccess[]>;
}

export interface UpdateRoomRequest {
  metadata?: RoomMetadata;
  defaultAccesses?: RoomAccess[];
  groupsAccesses?: Record<string, RoomAccess[]>;
  usersAccesses?: Record<string, RoomAccess[]>;
}

export interface UpdateRoomPathParams {
  roomId: string;
}
