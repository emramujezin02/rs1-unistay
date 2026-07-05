export interface FreeBed {
  bedId: number;
  bedNumber: string;
  roomId: number;
  roomNumber: string;
  floor: number;
}

export interface FreeBedsResponse {
  items: FreeBed[];
  pageSize: number;
  currentPage: number;
  includedTotal: boolean;
  totalItems: number;
  totalPages: number;
}
