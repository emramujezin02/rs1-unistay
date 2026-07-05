import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface AnalyticsSnapshot {
  activeUsers: number;
  totalUsers: number;
  totalMessages: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  
private hubConnection?: signalR.HubConnection;
  private analyticsSource = new BehaviorSubject<AnalyticsSnapshot>({
    activeUsers: 0,
    totalUsers: 0,
    totalMessages: 0
  });
  analytics$ = this.analyticsSource.asObservable();

constructor(private http: HttpClient) {
  window.addEventListener('beforeunload', () => {
    this.stopConnection();
  });
}

getSnapshot() {
  return this.http.get<AnalyticsSnapshot>(`${MyConfig.baseUrl}/api/analytics/snapshot`);
}

startConnection(userId: number) {
  if (this.hubConnection) {
    return;
  }

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:5177/hubs/analytics?userId=${userId}`, {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.on('AnalyticsUpdated', data => {
    this.analyticsSource.next(data);
  });

  this.hubConnection.start();
}




stopConnection() {
  if (this.hubConnection) {
    this.hubConnection.stop();
    this.hubConnection = undefined;
  }
}

}
