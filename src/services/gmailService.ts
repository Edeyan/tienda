import { 
  signInWithPopup, 
  linkWithPopup,
  reauthenticateWithPopup,
  GoogleAuthProvider, 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';


export const GMAIL_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels'
];

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  payload?: {
    headers: { name: string; value: string }[];
    body?: { size: number; data?: string };
    parts?: any[];
  };
  // Parsed convenience fields
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  bodyText?: string;
}

export interface GmailDraft {
  id: string;
  message: GmailMessage;
}

// In-memory token management
let cachedAccessToken: string | null = null;
let cachedGoogleUser: FirebaseUser | null = null;
let gmailConnectionInProgress = false;

// Clear cached token on sign out
onAuthStateChanged(auth, (user) => {
  if (!user) {
    cachedAccessToken = null;
    cachedGoogleUser = null;
  } else {
    cachedGoogleUser = user;
  }
});

// Helper to encode UTF-8 to base64url format for Gmail API
function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper to decode base64url to UTF-8
function decodeBase64Url(base64UrlStr: string): string {
  try {
    let base64 = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    return '';
  }
}

export const gmailService = {
  // Get in-memory access token
  getAccessToken: (): string | null => {
    return cachedAccessToken;
  },

  // Set in-memory access token
  setAccessToken: (token: string | null) => {
    cachedAccessToken = token;
  },

  // Check if Gmail is currently connected with a token
  isConnected: (): boolean => {
    return !!cachedAccessToken;
  },

  // Get the current connected user
  getConnectedUser: (): FirebaseUser | null => {
    return cachedGoogleUser || auth.currentUser;
  },

  // Connect Gmail via Google Popup with required scopes
  connectGmail: async (): Promise<{ success: boolean; token?: string; user?: FirebaseUser; error?: string }> => {
    if (gmailConnectionInProgress) {
      return { success: false, error: 'Ya hay una autorización de Gmail abierta.' };
    }

    gmailConnectionInProgress = true;
    try {
      const provider = new GoogleAuthProvider();
      // Add Gmail scopes & Drive scopes
      [...GMAIL_SCOPES].forEach(scope => provider.addScope(scope));
      provider.setCustomParameters({ prompt: 'consent select_account' });

      // Link Gmail to the existing Firebase session when possible. This keeps
      // connecting Gmail from replacing the BUSINESS user session.
      const currentUser = auth.currentUser;
      const hasGoogleProvider = currentUser?.providerData.some(
        ({ providerId }) => providerId === 'google.com'
      );
      const result = currentUser && hasGoogleProvider
        ? await reauthenticateWithPopup(currentUser, provider)
        : currentUser
          ? await linkWithPopup(currentUser, provider)
          : await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential?.accessToken) {
        throw new Error('No se pudo obtener el token de acceso de Google Gmail.');
      }

      cachedAccessToken = credential.accessToken;
      cachedGoogleUser = result.user;

      return {
        success: true,
        token: cachedAccessToken,
        user: result.user
      };
    } catch (error: any) {
      console.error('Error connecting Gmail:', error);
      let msg = 'Error al conectar con Gmail.';
      if (error.code === 'auth/popup-closed-by-user') {
        msg = 'La ventana de autorización de Google fue cerrada.';
      } else if (error.code === 'auth/popup-blocked') {
        msg = 'La ventana emergente fue bloqueada por el navegador.';
      } else if (error.code === 'auth/credential-already-in-use' || error.code === 'auth/provider-already-linked') {
        msg = 'Esta cuenta de Google ya está vinculada. Vuelve a abrir Gmail para renovar el acceso.';
        cachedAccessToken = null;
      } else if (error.message) {
        msg = error.message;
      }
      return { success: false, error: msg };
    } finally {
      gmailConnectionInProgress = false;
    }
  },

  // Disconnect Gmail
  disconnectGmail: async (): Promise<void> => {
    cachedAccessToken = null;
    cachedGoogleUser = null;
  },

  // Get user profile (email, total messages, threads)
  getProfile: async (): Promise<{ emailAddress: string; messagesTotal: number; threadsTotal: number; historyId: string }> => {
    const token = cachedAccessToken;
    if (!token) throw new Error('Gmail no está conectado.');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error al obtener perfil de Gmail (${res.status})`);
    }

    return await res.json();
  },

  // List messages with search query / label filter
  listMessages: async (options: {
    q?: string;
    maxResults?: number;
    pageToken?: string;
    labelIds?: string[];
  } = {}): Promise<{ messages: GmailMessage[]; nextPageToken?: string; resultSizeEstimate?: number }> => {
    const token = cachedAccessToken;
    if (!token) throw new Error('Gmail no está conectado.');

    const params = new URLSearchParams();
    if (options.q) params.append('q', options.q);
    if (options.maxResults) params.append('maxResults', options.maxResults.toString());
    if (options.pageToken) params.append('pageToken', options.pageToken);
    if (options.labelIds && options.labelIds.length) {
      options.labelIds.forEach(l => params.append('labelIds', l));
    }

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error al listar correos (${res.status})`);
    }

    const data = await res.json();
    const rawMessages: { id: string; threadId: string }[] = data.messages || [];

    // Fetch details for first batch of messages in parallel (up to 15)
    const detailedMessages: GmailMessage[] = await Promise.all(
      rawMessages.slice(0, 15).map(async (msg) => {
        try {
          return await gmailService.getMessageDetails(msg.id);
        } catch {
          return { id: msg.id, threadId: msg.threadId };
        }
      })
    );

    return {
      messages: detailedMessages,
      nextPageToken: data.nextPageToken,
      resultSizeEstimate: data.resultSizeEstimate
    };
  },

  // Get specific message detail by ID
  getMessageDetails: async (messageId: string): Promise<GmailMessage> => {
    const token = cachedAccessToken;
    if (!token) throw new Error('Gmail no está conectado.');

    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error al obtener detalles del correo`);
    }

    const data = await res.json();

    // Parse headers
    const headers = data.payload?.headers || [];
    const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    // Extract body text if present
    let bodyText = '';
    if (data.payload?.body?.data) {
      bodyText = decodeBase64Url(data.payload.body.data);
    } else if (data.payload?.parts) {
      for (const part of data.payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = decodeBase64Url(part.body.data);
          break;
        } else if (part.mimeType === 'text/html' && part.body?.data && !bodyText) {
          bodyText = decodeBase64Url(part.body.data);
        }
      }
    }

    return {
      ...data,
      subject: getHeader('Subject') || '(Sin Asunto)',
      from: getHeader('From'),
      to: getHeader('To'),
      date: getHeader('Date'),
      bodyText: bodyText || data.snippet || ''
    };
  },

  // Send an email directly via Gmail API
  sendEmail: async (options: {
    to: string;
    subject: string;
    bodyHtml?: string;
    bodyText: string;
    cc?: string;
    bcc?: string;
  }): Promise<{ id: string; threadId: string }> => {
    const token = cachedAccessToken;
    if (!token) throw new Error('Gmail no está conectado.');

    const { to, subject, bodyHtml, bodyText, cc, bcc } = options;

    let emailLines = [
      `To: ${to}`,
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'MIME-Version: 1.0',
    ];

    if (cc) emailLines.push(`Cc: ${cc}`);
    if (bcc) emailLines.push(`Bcc: ${bcc}`);

    if (bodyHtml) {
      emailLines.push('Content-Type: text/html; charset=UTF-8');
      emailLines.push('');
      emailLines.push(bodyHtml);
    } else {
      emailLines.push('Content-Type: text/plain; charset=UTF-8');
      emailLines.push('');
      emailLines.push(bodyText);
    }

    const rawEmail = emailLines.join('\r\n');
    const rawBase64 = encodeBase64Url(rawEmail);

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: rawBase64 })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Error al enviar correo vía Gmail (${res.status})`);
    }

    return await res.json();
  },

  // Send Order Invoice or Confirmation to customer via Gmail
  sendInvoiceEmail: async (order: any, customerEmail: string): Promise<{ id: string; threadId: string }> => {
    const storeName = 'Mishozuki & Megapro';
    const subject = `Factura y Confirmación de Pedido #${order.orderNumber || order.id} - ${storeName}`;

    const itemsHtml = (order.items || [])
      .map(
        (item: any) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px 8px; font-size: 13px; color: #1e293b;">${item.product?.name || item.name}</td>
          <td style="padding: 10px 8px; font-size: 13px; text-align: center; color: #64748b;">${item.quantity}</td>
          <td style="padding: 10px 8px; font-size: 13px; text-align: right; color: #1e293b; font-weight: bold;">$${Number(item.subtotal || item.product?.price * item.quantity).toFixed(2)} USD</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; color: #1e293b;">
        <div style="background-color: #002147; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 22px; letter-spacing: -0.5px; font-weight: 800;">${storeName}</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #93c5fd;">Comprobante Digital de Pedido</p>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 15px; margin: 0 0 16px;">Hola <strong>${order.customerName || 'Cliente'}</strong>,</p>
          <p style="font-size: 13px; color: #475569; margin: 0 0 20px; line-height: 1.5;">
            Gracias por tu compra. Adjuntamos el detalle de tu factura y orden de compra registrada en nuestro sistema.
          </p>

          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; font-size: 12px; color: #475569;">
              <tr>
                <td><strong>Nº de Factura:</strong> ${order.orderNumber || order.id}</td>
                <td style="text-align: right;"><strong>Fecha:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td><strong>Método de Pago:</strong> ${order.paymentMethod || 'Efectivo'}</td>
                <td style="text-align: right;"><strong>Estado:</strong> ${order.status || 'Completado'}</td>
              </tr>
            </table>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
                <th style="padding: 10px 8px;">Producto</th>
                <th style="padding: 10px 8px; text-align: center;">Cant.</th>
                <th style="padding: 10px 8px; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: bold; color: #0f172a;">TOTAL:</td>
                <td style="padding: 12px 8px; text-align: right; font-size: 16px; font-weight: 800; color: #059669;">$${Number(order.total || 0).toFixed(2)} USD</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #1e40af; margin-bottom: 24px;">
            Para cualquier duda respecto a esta factura o tus garantías, contáctanos a soporte o responde directamente a este correo.
          </div>

          <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
            ${storeName} • Catálogo de Motos, Bicicletas y Repuestos
          </p>
        </div>
      </div>
    `;

    const plainText = `Factura #${order.orderNumber || order.id}\nCliente: ${order.customerName}\nTotal: $${order.total} USD\nGracias por su compra en ${storeName}.`;

    return await gmailService.sendEmail({
      to: customerEmail,
      subject,
      bodyHtml: html,
      bodyText: plainText
    });
  }
};
