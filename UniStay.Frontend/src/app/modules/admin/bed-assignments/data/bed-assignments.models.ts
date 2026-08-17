export interface BedAssignment {
  assignmentId: number;
  bedId: number;
  bedNumber: string;
  roomId: number;
  roomNumber: string;
  studentId: number;
  studentIdentifier: string;
  studentFirstName: string;
  studentLastName: string;
  fromDate: string;
  toDate: string;
}

export interface BedAssignmentFilters {
  search: string;
  page: number;
  pageSize: number;
}

export interface AssignBedRequest {
  bedID: number;
  studentID: number;
  fromDate: string;
  toDate: string;
}

export interface BedAssignmentsResponse {
  items: BedAssignmentApiItem[];
  totalItems?: number;
  totalCount?: number;
}

export interface BedAssignmentApiItem {
  assignmentID?: number;
  assignmentId?: number;
  bedID?: number;
  bedId?: number;
  bedNumber?: string;
  roomID?: number;
  roomId?: number;
  roomNumber?: string;
  studentID?: number;
  studentId?: number;
  studentCode?: string;
  StudentCode?: string;
  indexNumber?: string;
  IndexNumber?: string;
  studentNumber?: string;
  StudentNumber?: string;
  studentIdentifier?: string;
  StudentIdentifier?: string;
  studentUsername?: string;
  StudentUsername?: string;
  username?: string;
  Username?: string;
  studentEmail?: string;
  StudentEmail?: string;
  email?: string;
  Email?: string;
  userId?: string | number;
  UserId?: string | number;
  studentName?: string;
  studentFirstName?: string;
  studenLName?: string;
  studentLastName?: string;
  fromDate?: string;
  toDate?: string;
}

export function mapBedAssignment(item: BedAssignmentApiItem): BedAssignment {
  return {
    assignmentId: item.assignmentID ?? item.assignmentId ?? 0,
    bedId: item.bedID ?? item.bedId ?? 0,
    bedNumber: item.bedNumber ?? '',
    roomId: item.roomID ?? item.roomId ?? 0,
    roomNumber: item.roomNumber ?? '',
    studentId: item.studentID ?? item.studentId ?? 0,
    studentIdentifier: getPublicStudentIdentifier(item),
    studentFirstName: item.studentName ?? item.studentFirstName ?? '',
    studentLastName: item.studenLName ?? item.studentLastName ?? '',
    fromDate: item.fromDate ?? '',
    toDate: item.toDate ?? ''
  };
}

function getPublicStudentIdentifier(item: BedAssignmentApiItem): string {
  const candidates = [
    item.studentCode,
    item.StudentCode,
    item.indexNumber,
    item.IndexNumber,
    item.studentNumber,
    item.StudentNumber,
    item.studentIdentifier,
    item.StudentIdentifier,
    item.studentUsername,
    item.StudentUsername,
    item.username,
    item.Username,
    item.studentEmail,
    item.StudentEmail,
    item.email,
    item.Email,
    item.userId,
    item.UserId
  ];

  for (const candidate of candidates) {
    const value = sanitizePublicIdentifier(candidate);
    if (value) {
      return value;
    }
  }

  return '';
}

function sanitizePublicIdentifier(value: string | number | undefined): string {
  if (value === undefined || value === null) {
    return '';
  }

  const text = String(value).trim();
  if (!text || isTokenLike(text) || /^\d{1,2}$/.test(text)) {
    return '';
  }

  return text;
}

function isTokenLike(value: string): boolean {
  const lower = value.toLowerCase();
  return lower.startsWith('bearer ') ||
    lower.includes('access_token') ||
    lower.includes('refresh_token') ||
    lower.includes('jwt') ||
    /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}
