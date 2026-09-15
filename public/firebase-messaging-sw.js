importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Firebase config for service worker background notifications
const firebaseConfig = {
  projectId: "gen-lang-client-0975848525",
  appId: "1:427470685450:web:98772fdc0a3035adf466f3",
  apiKey: "AIzaSyCpPnI7hOoUwvWXmNrYm1x10GVPN3_EAyg",
  authDomain: "gen-lang-client-0975848525.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-businesscatlogoy-5e10c7ec-75f2-43d1-901c-ce07f911170c",
  storageBucket: "gen-lang-client-0975848525.firebasestorage.app",
  messagingSenderId: "427470685450"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);
    
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Actualización de Pedido - BUSINESS';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'El estado de tu pedido ha cambiado.',
      icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
      badge: '/favicon.ico',
      data: payload.data || {},
      vibrate: [200, 100, 200],
      tag: payload.data?.orderNumber || 'order-status-update',
      actions: [
        { action: 'track', title: 'Ver Pedido' },
        { action: 'close', title: 'Cerrar' }
      ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('[firebase-messaging-sw.js] Firebase background initialization error:', e);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
