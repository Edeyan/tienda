import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safety handler for unhandled promise rejections (e.g., cancelled Firebase popups, network drops)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Ignore standard user cancellations like closed auth popups or benign network aborts
    if (
      event.reason?.code === 'auth/popup-closed-by-user' ||
      event.reason?.code === 'auth/cancelled-popup-request' ||
      event.reason?.name === 'AbortError'
    ) {
      event.preventDefault();
      return;
    }
    console.warn('Unhandled promise rejection captured:', event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
