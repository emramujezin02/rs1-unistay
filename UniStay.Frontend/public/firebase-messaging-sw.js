importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyB_WHTGO2mi2vIB_dC66wkhLITL9UfxOjQ',
  authDomain: 'unistay-7fbdb.firebaseapp.com',
  projectId: 'unistay-7fbdb',
  storageBucket: 'unistay-7fbdb.firebasestorage.app',
  messagingSenderId: '91004507003',
  appId: '1:91004507003:web:909aa096bfc81d4cea23de'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title ?? 'UniStay';
  const body = payload.notification?.body ?? '';

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico'
  });
});
