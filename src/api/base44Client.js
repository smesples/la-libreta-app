import { createClient } from '@base44/sdk';

// Ponemos los datos directamente para evitar el error de "null"
export const base44 = createClient({
  appId: 'TU_APP_ID_AQUI',       // Copiá el ID de tu app desde Base44
  token: 'TU_TOKEN_AQUI',       // Copiá el Token/API Key desde Base44
  serverUrl: 'https://api.base44.com', // Aseguramos la URL base
  requiresAuth: false
});
