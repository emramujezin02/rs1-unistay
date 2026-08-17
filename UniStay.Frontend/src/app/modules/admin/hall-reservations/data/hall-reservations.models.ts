import type { HallReservation, ReservationStatus } from '../../../../endpoints/hall-reservation-endpoints/hall-reservations-endpoint.service';

export type { HallReservation, ReservationStatus };

export interface ReservationFilters {
  search: string;
  page: number;
  pageSize: number;
}
