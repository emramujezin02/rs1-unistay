export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface GetMyNotificationsResult {
  notifications: NotificationDto[];
  unreadCount: number;
}

export interface NotificationApiDto {
  id?: string;
  Id?: string;
  title?: string;
  Title?: string;
  message?: string;
  Message?: string;
  type?: string;
  Type?: string;
  isRead?: boolean;
  IsRead?: boolean;
  createdAt?: string;
  CreatedAt?: string;
}

export interface GetMyNotificationsApiResult {
  notifications?: NotificationApiDto[];
  Notifications?: NotificationApiDto[];
  unreadCount?: number;
  UnreadCount?: number;
}

export interface SaveFcmTokenRequest {
  token: string;
}
