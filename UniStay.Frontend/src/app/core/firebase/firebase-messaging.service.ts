import { Injectable } from '@angular/core';
import { NotificationEndpointService } from '../../endpoints/notification-endpoints/notification-endpoint.service';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { firebaseConfig, firebaseVapidKey } from './firebase.config';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {
  constructor(
    private authService: MyAuthService,
    private notificationEndpoint: NotificationEndpointService
  ) {}

  async init(): Promise<void> {
    if (!this.authService.isLoggedIn() || !('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    try {
      const [{ getApps, initializeApp }, { getMessaging, getToken, onMessage }] = await Promise.all([
        import('firebase/app'),
        import('firebase/messaging')
      ]);
      const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
        return;
      }

      const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const fcmToken = await getToken(messaging, {
        vapidKey: firebaseVapidKey,
        serviceWorkerRegistration
      });

      if (!fcmToken) {
        return;
      }

      this.notificationEndpoint.saveFcmToken(fcmToken).subscribe({ error: () => {} });

      onMessage(messaging, payload => {
        const title = payload.notification?.title ?? 'UniStay';
        const body = payload.notification?.body ?? '';
        new Notification(title, { body, icon: '/favicon.ico' });
      });
    } catch {
      // Push notification setup must not interrupt the application.
    }
  }
}
