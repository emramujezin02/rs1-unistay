import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  GetMyNotificationsApiResult,
  GetMyNotificationsResult,
  NotificationApiDto,
  NotificationDto,
  SaveFcmTokenRequest
} from './notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/notifications`;

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<GetMyNotificationsResult> {
    return this.http.get<GetMyNotificationsApiResult>(this.apiUrl).pipe(
      map(response => {
        const notifications = response.notifications ?? response.Notifications ?? [];

        return {
          notifications: notifications.map(item => this.mapNotification(item)),
          unreadCount: response.unreadCount ?? response.UnreadCount ?? 0
        };
      })
    );
  }

  markAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/read-all`, {});
  }

  saveFcmToken(token: string): Observable<void> {
    const request: SaveFcmTokenRequest = { token };
    return this.http.put<void>(`${this.apiUrl}/fcm-token`, request);
  }

  private mapNotification(item: NotificationApiDto): NotificationDto {
    return {
      id: item.id ?? item.Id ?? '',
      title: item.title ?? item.Title ?? '',
      message: item.message ?? item.Message ?? '',
      type: item.type ?? item.Type ?? '',
      isRead: item.isRead ?? item.IsRead ?? false,
      createdAt: item.createdAt ?? item.CreatedAt ?? ''
    };
  }
}
