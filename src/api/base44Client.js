// base44Client.js - Versión MVP sin dependencia de backend Base44
// El sistema de auth ahora vive en App.jsx con localStorage

export const base44 = {
  // Stub vacío para evitar errores en imports que todavía referencien base44
  auth: {
    me: () => Promise.reject(new Error('Auth manejado localmente')),
    logout: () => {},
    redirectToLogin: () => {},
  },
};
