import { MyConfig } from '../../my-config';

export const DEFAULT_ROOM_IMAGE_URL = '/images/dorm-room.jpg';

export interface RoomDto {
  id: number;
  roomNumber: string;
  floor: number;
  maxOccupancy: number;
  description: string;
  building?: string | null;
  roomSide?: string | null;
  hallId?: number | null;
  nearExit: boolean;
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  occupiedBeds?: number;
  availableBeds?: number;
  images: string[];
  students: RoomStudentDto[];
}

export interface RoomStudentDto {
  id: number;
  fullName: string;
  email?: string | null;
}

export interface RoomViewModel extends RoomDto {
  roomID: number;
}

export interface PageResult<T> {
  items: T[];
  pageSize: number;
  currentPage: number;
  includedTotal: boolean;
  totalItems: number;
  totalPages: number;
}

export interface RoomListFilters {
  q?: string;
  floor?: number | null;
  building?: string | null;
  roomSide?: string | null;
  nearExit?: boolean | null;
  wheelchairAccessible?: boolean | null;
  elevatorAccess?: boolean | null;
  maxOccupancy?: number | null;
}

export interface RoomCreateRequest {
  roomNumber: string;
  floor: number;
  maxOccupancy: number;
  description: string;
  building?: string | null;
  roomSide?: string | null;
  hallId?: number | null;
  nearExit: boolean;
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  images: string[];
}

export type RoomUpdateRequest = RoomCreateRequest;

export function normalizeRoomImageUrl(image: string): string {
  const value = (image ?? '').trim();

  if (!value) {
    return DEFAULT_ROOM_IMAGE_URL;
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if (value.startsWith('/')) {
    return value;
  }

  if (value.startsWith('images/')) {
    return `/${value}`;
  }

  if (value.startsWith('rooms/')) {
    return `/images/${value}`;
  }

  return `/images/${value.replace(/^\/+/, '')}`;
}

export function mapRoomDtoToViewModel(room: RoomDto): RoomViewModel {
  return {
    ...room,
    images: (room.images ?? []).map(normalizeRoomImageUrl),
    students: room.students ?? [],
    roomID: room.id
  };
}
