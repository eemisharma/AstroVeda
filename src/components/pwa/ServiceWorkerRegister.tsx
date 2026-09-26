'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('AstroConsult Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('AstroConsult Service Worker registration failed:', err);
        });
    }
  }, []);

  return null;
}
