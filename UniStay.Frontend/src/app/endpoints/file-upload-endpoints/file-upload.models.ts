export interface UploadProgressEvent {
  type: 'progress';
  percent: number;
}

export interface UploadCompleteEvent {
  type: 'complete';
  fileId: string;
  fileName: string;
  url: string;
}

export type UploadEvent = UploadProgressEvent | UploadCompleteEvent;

export interface UploadFileApiResponse {
  fileId?: string;
  FileId?: string;
  fileName?: string;
  FileName?: string;
  url?: string;
  Url?: string;
}
