export type AnnouncementAudience =
  | 'Everyone'
  | 'Students'
  | 'Employees'
  | 'StudentsAndEmployees';

export interface AnnouncementDto {
  announcementId: string;
  title: string;
  content: string;
  audience: AnnouncementAudience;
  createdAt: string;
  expiresAt?: string | null;
  createdByUserId: string;
  createdByUsername: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  expiresAt?: string | null;
  expiresAtUtc?: string | null;
  audience: AnnouncementAudience;
}

export interface PagedAnnouncementsResult {
  items: AnnouncementDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface AnnouncementApiDto {
  announcementId?: string;
  AnnouncementId?: string;
  title?: string;
  Title?: string;
  content?: string;
  Content?: string;
  audience?: AnnouncementAudience;
  Audience?: AnnouncementAudience;
  createdAt?: string;
  CreatedAt?: string;
  createdAtUtc?: string;
  CreatedAtUtc?: string;
  expiresAt?: string | null;
  ExpiresAt?: string | null;
  expiresAtUtc?: string | null;
  ExpiresAtUtc?: string | null;
  createdByUserId?: string;
  CreatedByUserId?: string;
  createdByUsername?: string;
  CreatedByUsername?: string;
}

export interface PagedAnnouncementsApiResult {
  items?: AnnouncementApiDto[];
  Items?: AnnouncementApiDto[];
  totalCount?: number;
  TotalCount?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
  totalPages?: number;
  TotalPages?: number;
}

export interface CreateAnnouncementApiResult {
  announcementId?: string;
  AnnouncementId?: string;
}

export interface DeleteAnnouncementResult {
  announcementId: string;
}

export interface DeleteAnnouncementApiResult {
  announcementId?: string;
  AnnouncementId?: string;
}

export const ANNOUNCEMENT_AUDIENCES = {
  PUBLIC: 'Everyone',
  STUDENT: 'Students,StudentsAndEmployees,Everyone',
  EMPLOYEE: 'Employees,StudentsAndEmployees,Everyone'
} as const;
