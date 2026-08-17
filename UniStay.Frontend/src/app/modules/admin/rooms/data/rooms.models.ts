import { RoomCreateRequest, RoomDto, RoomUpdateRequest } from '../../../../endpoints/room-endpoints/room.models';

export interface RoomFilters {
  search: string;
  page: number;
  pageSize: number;
}

export type AdminRoom = RoomDto;
export type AdminRoomCreateRequest = RoomCreateRequest;
export type AdminRoomUpdateRequest = RoomUpdateRequest;
