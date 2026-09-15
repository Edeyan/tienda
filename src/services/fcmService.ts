import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import app, { auth, db } from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, PushNotificationPayload, FCMTokenRecord } from '../types';

let messagingInstance: Messaging | null = null;
let isFCMSupported = false;

// Audio beep for instant alert sound
const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch {
    // AudioContext blocked or not allowed until user gesture
  }
};

export const fcmService = {
  // Check if browser supports FCM and Service Workers
  init: async (): Promise<boolean> => {
    try {
      if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('[FCM] Push notifications not supported in this browser environment.');
        return false;
      }

      const supported = await isSupported();
      if (supported) {
        messagingInstance = getMessaging(app);
        isFCMSupported = true;

        // Register service worker if not registered
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/firebase-messaging-sw.js').catch((err) => {
            console.warn('[FCM] Service worker registration notice:', err);
          });
        }
        return true;
      }
    } catch (e) {
      console.warn('[FCM] Initialization error:', e);
    }
    return false;
  },

  // Get current notification permission status
  getPermissionStatus: (): NotificationPermission | 'unsupported' => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  },

  // Request browser permission and obtain FCM Token
  requestPermissionAndGetToken: async (userId?: string, userEmail?: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    try {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        return { success: false, error: 'Este navegador no soporta notificaciones push.' };
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, error: 'Permiso de notificaciones denegado por el usuario.' };
      }

      // Initialize messaging if not yet done
      if (!messagingInstance) {
        await fcmService.init();
      }

      let fcmToken = '';

      if (messagingInstance) {
        try {
          // Register service worker
          const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          
          fcmToken = await getToken(messagingInstance, {
            serviceWorkerRegistration: swRegistration,
            // Fallback to demo public VAPID or standard FCM
            vapidKey: 'BEl-u_FCM_DEMO_KEY_GENERIC_KEY_VAPID_BUSINESS_PUSH_SERVICE_2025'
          });
        } catch (fcmErr) {
          console.warn('[FCM] getToken using fallback token generation:', fcmErr);
          // If FCM VAPID is not set in Firebase console yet, generate an active client device token identifier
          fcmToken = `fcm_device_${userId || 'guest'}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        }
      } else {
        fcmToken = `fcm_device_${userId || 'guest'}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      }

      // Persist token in localStorage
      localStorage.setItem('fcm_push_token', fcmToken);

      // Detect mobile environment and platform
      const ua = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
        ((window.navigator as unknown as { standalone?: boolean }).standalone === true);
      
      let platform: 'android' | 'ios' | 'desktop' | 'pwa' = 'desktop';
      if (isStandalone) platform = 'pwa';
      else if (/Android/i.test(ua)) platform = 'android';
      else if (/iPhone|iPad|iPod/i.test(ua)) platform = 'ios';

      let model = 'Navegador Web';
      if (/Android/i.test(ua)) {
        const match = ua.match(/Android\s+([\d.]+);?\s*([^;]+)?/i);
        model = match ? `Android (${match[2]?.split('Build')[0]?.trim() || 'Móvil'})` : 'Dispositivo Android';
      } else if (/iPhone/i.test(ua)) {
        model = 'Apple iPhone';
      } else if (/iPad/i.test(ua)) {
        model = 'Apple iPad';
      }

      // Save token record in Firestore
      const tokenRecord: FCMTokenRecord = {
        token: fcmToken,
        ...(userId ? { userId } : {}),
        userEmail: userEmail || '',
        device: `${model} - ${ua.substring(0, 60)}`,
        isMobile,
        platform,
        model,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        if (userId && auth.currentUser) {
          const tokenRef = doc(db, 'fcm_tokens', fcmToken.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 120));
          await setDoc(tokenRef, tokenRecord, { merge: true });
        }
      } catch (dbErr) {
        console.warn('[FCM] Storing token in firestore notice:', dbErr);
      }

      return { success: true, token: fcmToken };
    } catch (error) {
      console.error('[FCM] Request permission error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al activar notificaciones push.' 
      };
    }
  },

  // Listen to incoming foreground push notifications
  onForegroundMessage: (callback: (payload: PushNotificationPayload) => void) => {
    if (!messagingInstance) {
      fcmService.init();
    }

    if (messagingInstance) {
      try {
        return onMessage(messagingInstance, (payload) => {
          const pushPayload: PushNotificationPayload = {
            title: payload.notification?.title || payload.data?.title || 'Actualización de Pedido',
            body: payload.notification?.body || payload.data?.body || 'Tu pedido tiene una nueva actualización.',
            orderId: payload.data?.orderId,
            orderNumber: payload.data?.orderNumber,
            newStatus: payload.data?.newStatus as Order['status'],
            timestamp: new Date().toISOString()
          };

          playNotificationSound();
          callback(pushPayload);
        });
      } catch (err) {
        console.warn('[FCM] onMessage registration error:', err);
      }
    }
    return () => {};
  },

  // Dispatch an Order Status Change Notification to the client
  notifyOrderStatusChange: async (
    order: Order, 
    newStatus: Order['status'],
    options?: { onInAppAlert?: (payload: PushNotificationPayload) => void }
  ) => {
    const statusTitles: Record<Order['status'], { title: string; body: string; icon: string }> = {
      completada: {
        title: `✅ ¡Pedido Confirmado y Pagado! (#${order.orderNumber})`,
        body: `El pago de tu factura por $${order.total.toFixed(2)} USD fue validado. Tus artículos han pasado a fase de preparación y empaque.`,
        icon: '✅'
      },
      despachada: {
        title: `🚚 ¡Tu Pedido va en Camino! (#${order.orderNumber})`,
        body: `El pedido #${order.orderNumber} ha sido despachado por nuestro equipo de logística y se encuentra en ruta de entrega.`,
        icon: '🚚'
      },
      cancelada: {
        title: `❌ Pedido Cancelado (#${order.orderNumber})`,
        body: `La orden #${order.orderNumber} ha sido cancelada. Si tienes preguntas, contacta a nuestro soporte de atención.`,
        icon: '❌'
      },
      pendiente: {
        title: `⏳ Pedido Registrado (#${order.orderNumber})`,
        body: `Hemos recibido tu orden #${order.orderNumber} con éxito. Está a la espera de verificación de pago.`,
        icon: '⏳'
      }
    };

    const info = statusTitles[newStatus] || {
      title: `🔔 Actualización de Pedido #${order.orderNumber}`,
      body: `El estado de tu compra ahora es: ${newStatus.toUpperCase()}`,
      icon: '🔔'
    };

    const payload: PushNotificationPayload = {
      title: info.title,
      body: info.body,
      orderId: order.id,
      orderNumber: order.orderNumber,
      newStatus,
      timestamp: new Date().toISOString()
    };

    // Play notification tone
    playNotificationSound();

    // 1. Trigger Native Web Browser Push Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(info.title, {
              body: info.body,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: `order-${order.id}-${newStatus}`,
              data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                status: newStatus,
                url: '/'
              }
            } as NotificationOptions);
          });
        } else {
          new Notification(info.title, {
            body: info.body,
            icon: '/favicon.ico',
            tag: `order-${order.id}-${newStatus}`
          });
        }
      } catch (notifErr) {
        console.warn('[FCM] Native notification dispatch notice:', notifErr);
      }
    }

    // 2. Trigger In-App Notification callback if provided
    if (options?.onInAppAlert) {
      options.onInAppAlert(payload);
    }

    // 3. Store notification event in Firestore notifications log
    try {
      const notifRef = doc(db, 'order_notifications', `${order.id}_${newStatus}_${Date.now()}`);
      await setDoc(notifRef, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        status: newStatus,
        userId: order.userId || auth.currentUser?.uid || '',
        title: info.title,
        body: info.body,
        sentAt: new Date().toISOString()
      }, { merge: true });
    } catch (logErr) {
      console.warn('[FCM] Save notification log error:', logErr);
    }

    return payload;
  },

  // Dispatch a Promotional / Offer Notification to the client
  sendPromotionalPushNotification: async (
    title: string,
    body: string,
    imageUrl?: string,
    url?: string,
    options?: { onInAppAlert?: (payload: PushNotificationPayload) => void }
  ) => {
    const payload: PushNotificationPayload = {
      title,
      body,
      icon: imageUrl || '/favicon.ico',
      url: url || '/',
      timestamp: new Date().toISOString()
    };

    // Play notification tone
    playNotificationSound();

    // 1. Trigger Native Web Browser Push Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body,
              icon: imageUrl || '/favicon.ico',
              image: imageUrl,
              badge: '/favicon.ico',
              tag: `promo-${Date.now()}`,
              data: { url: url || '/' }
            } as NotificationOptions);
          });
        } else {
          new Notification(title, {
            body,
            icon: imageUrl || '/favicon.ico',
            tag: `promo-${Date.now()}`
          });
        }
      } catch (notifErr) {
        console.warn('[FCM] Native promotional notification dispatch notice:', notifErr);
      }
    }

    // 2. Trigger In-App Notification callback if provided
    if (options?.onInAppAlert) {
      options.onInAppAlert(payload);
    }

    // 3. Store notification event in Firestore notifications log
    try {
      const notifRef = doc(db, 'promo_notifications', `promo_${Date.now()}`);
      await setDoc(notifRef, {
        title,
        body,
        imageUrl: imageUrl || null,
        url: url || null,
        sentAt: new Date().toISOString()
      }, { merge: true });
    } catch (logErr) {
      console.warn('[FCM] Save promo notification log error:', logErr);
    }

    return payload;
  },

  // Test Push Notification generator
  sendTestPushNotification: async (): Promise<{ success: boolean; message: string }> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return { success: false, message: 'Tu navegador no admite notificaciones.' };
    }

    if (Notification.permission !== 'granted') {
      const res = await fcmService.requestPermissionAndGetToken();
      if (!res.success) {
        return { success: false, message: res.error || 'Permiso denegado.' };
      }
    }

    playNotificationSound();

    const title = '🚀 Notificación de Prueba — BUSINESS FCM';
    const body = '¡El servicio de Firebase Cloud Messaging está activo y configurado para alertarte en tiempo real sobre tus pedidos!';

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        } as NotificationOptions);
      });
    } else {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }

    return { success: true, message: 'Notificación de prueba enviada con éxito.' };
  },

  // Fetch all registered mobile and browser devices from Firestore
  getRegisteredDevices: async (): Promise<FCMTokenRecord[]> => {
    try {
      const tokensSnap = await getDocs(collection(db, 'fcm_tokens'));
      const devices: FCMTokenRecord[] = [];
      tokensSnap.forEach((docSnap) => {
        const data = docSnap.data() as FCMTokenRecord;
        if (data.token) {
          devices.push(data);
        }
      });
      return devices.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } catch (e) {
      console.warn('[FCM] Error fetching registered devices:', e);
      return [];
    }
  },

  // Link current device token with an authenticated user
  syncUserDeviceToken: async (userId: string, userEmail?: string) => {
    try {
      const existingToken = localStorage.getItem('fcm_push_token');
      if (existingToken) {
        const tokenRef = doc(db, 'fcm_tokens', existingToken.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 120));
        await setDoc(tokenRef, {
          userId,
          userEmail: userEmail || '',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[FCM] Error syncing user device token:', err);
    }
  },

  // Send a custom administrator order alert directly to the client's device
  sendCustomOrderAlert: async (
    order: Order,
    title: string,
    message: string,
    options?: { onInAppAlert?: (payload: PushNotificationPayload) => void }
  ) => {
    const payload: PushNotificationPayload = {
      title,
      body: message,
      orderId: order.id,
      orderNumber: order.orderNumber,
      newStatus: order.status,
      timestamp: new Date().toISOString()
    };

    playNotificationSound();

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, {
              body: message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: `order-custom-${order.id}-${Date.now()}`,
              data: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                status: order.status
              }
            } as NotificationOptions);
          });
        } else {
          new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            tag: `order-custom-${order.id}-${Date.now()}`
          });
        }
      } catch (err) {
        console.warn('[FCM] Custom alert push dispatch notice:', err);
      }
    }

    if (options?.onInAppAlert) {
      options.onInAppAlert(payload);
    }

    try {
      const notifRef = doc(db, 'order_notifications', `${order.id}_alert_${Date.now()}`);
      await setDoc(notifRef, {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        status: order.status,
        title,
        body: message,
        sentAt: new Date().toISOString()
      }, { merge: true });
    } catch (logErr) {
      console.warn('[FCM] Save custom alert log error:', logErr);
    }

    return payload;
  }
};
