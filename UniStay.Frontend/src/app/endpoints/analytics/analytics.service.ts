import { Injectable, NgZone } from '@angular/core';
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
  private startPromise?: Promise<void>;

  private analyticsSource = new BehaviorSubject<AnalyticsSnapshot>({
    activeUsers: 0,
    totalUsers: 0,
    totalMessages: 0
  });

  analytics$ = this.analyticsSource.asObservable();

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    window.addEventListener('beforeunload', () => {
      this.stopConnection();
    });
  }

  getSnapshot() {
    return this.http.get<AnalyticsSnapshot>(
      `${MyConfig.baseUrl}/api/analytics/snapshot`
    );
  }

  startConnection(): void {
    if (
      this.hubConnection?.state === signalR.HubConnectionState.Connected ||
      this.hubConnection?.state === signalR.HubConnectionState.Connecting ||
      this.hubConnection?.state === signalR.HubConnectionState.Reconnecting
    ) {
      return;
    }

    if (this.startPromise) {
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${MyConfig.baseUrl}/hubs/analytics`, {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .build();

    connection.on('AnalyticsUpdated', (data: AnalyticsSnapshot) => {
      this.ngZone.run(() => {
        this.analyticsSource.next(data);
      });
    });

    connection.onclose(() => {
      if (this.hubConnection === connection) {
        this.hubConnection = undefined;
      }

      this.startPromise = undefined;
    });

    this.hubConnection = connection;

    this.startPromise = connection
      .start()
      .then(() => {
        this.startPromise = undefined;
      })
      .catch(() => {
        if (this.hubConnection === connection) {
          this.hubConnection = undefined;
        }

        this.startPromise = undefined;
      });
  }

  stopConnection(): void {
    const connection = this.hubConnection;

    this.hubConnection = undefined;
    this.startPromise = undefined;

    if (connection) {
      connection.stop();
    }
  }
}