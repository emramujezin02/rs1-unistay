export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApplicationListItem {
  applicationId: string;
  preferredRoomType: string;
  preferredRoomId: string | null;
  yearOfStudy: number;
  gpaScore: number | null;
  phoneNumber: string | null;
  specialRequirements: string | null;
  documentNames: string | null;
  notes: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  decisionAt: string | null;
  assignedRoomId: string | null;
}

export interface AdminApplicationListItem extends ApplicationListItem {
  studentId: string;
  studentUsername: string;
  studentEmail: string;
  decisionByUserId: string | null;
}

export interface ApplicationDetails {
  applicationId: string;
  studentId: string;
  studentUsername: string;
  studentEmail: string;
  studentFirstName: string;
  studentLastName: string;
  preferredRoomType: string;
  notes: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  decisionAt: string | null;
  assignedRoomId: string | null;
  assignedRoomNumber: string | null;
  decisionByUserId: string | null;
}

export interface CreateApplicationRequest {
  preferredRoomType: string;
  preferredRoomId: string | null;
  yearOfStudy: number;
  gpaScore: number | null;
  phoneNumber: string | null;
  specialRequirements: string | null;
  documentNames: string | null;
  notes: string | null;
}

export interface CreateApplicationResponse {
  applicationId: string;
}

export interface GetMyApplicationsResponse {
  items: ApplicationListItem[];
}

export interface GetAllApplicationsResponse {
  items: AdminApplicationListItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApproveApplicationResponse {
  applicationId: string;
  bedAssignmentId: string;
}

export interface RejectApplicationResponse {
  applicationId: string;
}

export interface MinGpaResponse {
  minimumGpa: number;
}

export interface ApplicationDraft {
  yearOfStudy: number | null;
  gpaScore: number | null;
  phoneNumber: string | null;
  preferredRoomType: string;
  selectedRoomId: string | null;
  selectedRoomNumber: string | null;
  selectedRoomType: string | null;
  specialRequirements: string | null;
  notes: string | null;
  documentNames: string[];
}

export interface ApplicationApiItem {
  applicationId?: string;
  ApplicationId?: string;
  preferredRoomType?: string;
  PreferredRoomType?: string;
  preferredRoomId?: string | null;
  PreferredRoomId?: string | null;
  yearOfStudy?: number;
  YearOfStudy?: number;
  gpaScore?: number | null;
  GpaScore?: number | null;
  phoneNumber?: string | null;
  PhoneNumber?: string | null;
  specialRequirements?: string | null;
  SpecialRequirements?: string | null;
  documentNames?: string | null;
  DocumentNames?: string | null;
  notes?: string | null;
  Notes?: string | null;
  status?: ApplicationStatus;
  Status?: ApplicationStatus;
  appliedAt?: string;
  AppliedAt?: string;
  appliedAtUtc?: string;
  AppliedAtUtc?: string;
  decisionAt?: string | null;
  DecisionAt?: string | null;
  decisionAtUtc?: string | null;
  DecisionAtUtc?: string | null;
  assignedRoomId?: string | null;
  AssignedRoomId?: string | null;
}

export interface AdminApplicationApiItem extends ApplicationApiItem {
  studentId?: string;
  StudentId?: string;
  studentUsername?: string;
  StudentUsername?: string;
  studentEmail?: string;
  StudentEmail?: string;
  decisionByUserId?: string | null;
  DecisionByUserId?: string | null;
}

export interface ApplicationDetailsApiResult extends AdminApplicationApiItem {
  studentFirstName?: string;
  StudentFirstName?: string;
  studentLastName?: string;
  StudentLastName?: string;
  assignedRoomNumber?: string | null;
  AssignedRoomNumber?: string | null;
}

export interface GetMyApplicationsApiResponse {
  items?: ApplicationApiItem[];
  Items?: ApplicationApiItem[];
}

export interface GetAllApplicationsApiResponse {
  items?: AdminApplicationApiItem[];
  Items?: AdminApplicationApiItem[];
  totalCount?: number;
  TotalCount?: number;
  pageNumber?: number;
  PageNumber?: number;
  pageSize?: number;
  PageSize?: number;
  totalPages?: number;
  TotalPages?: number;
}

export interface CreateApplicationApiResponse {
  applicationId?: string;
  ApplicationId?: string;
}

export interface ApproveApplicationApiResponse {
  applicationId?: string;
  ApplicationId?: string;
  bedAssignmentId?: string;
  BedAssignmentId?: string;
}

export interface RejectApplicationApiResponse {
  applicationId?: string;
  ApplicationId?: string;
}

export interface MinGpaApiResponse {
  minimumGpa?: number;
  MinimumGpa?: number;
}
