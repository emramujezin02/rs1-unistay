export interface PublicRoom {
  id: number;
  roomNumber: string;
  floor: number;
  maxOccupancy: number;
  description: string;
  building?: string | null;
  roomSide?: string | null;
  nearExit: boolean;
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  occupiedBeds: number;
  availableBeds: number;
  images: string[];
}

export interface PublicRoomsResponse {
  items: PublicRoom[];
  pageSize: number;
  currentPage: number;
  includedTotal: boolean;
  totalItems: number;
  totalPages: number;
}

export interface PublicRoomBedAssignment {
  assignmentId: number;
  fromDate: string;
  toDate: string;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
}

export interface PublicRoomBed {
  bedId: number;
  bedNumber: string;
  assignments: PublicRoomBedAssignment[];
}

export interface PublicRoomDetail {
  id: number;
  roomNumber: string;
  floor: number;
  maxOccupancy: number;
  description: string;
  building?: string | null;
  roomSide?: string | null;
  nearExit: boolean;
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  images: string[];
  beds: PublicRoomBed[];
}

export interface PublicRoomReview {
  roomReviewID?: number;
  roomReviewId?: number;
  user?: string;
  rating: number;
  comment: string;
  likes?: number;
  dislikes?: number;
}

export interface PublicRoomFilters {
  floor: number | null;
  maxOccupancy: number | null;
  nearExit: boolean;
  wheelchairAccessible: boolean;
  elevatorAccess: boolean;
  building: string | null;
  page: number;
  pageSize: number;
}
