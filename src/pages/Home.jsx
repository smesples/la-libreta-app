// localDB.js — Reemplaza base44.entities con persistencia en localStorage
// Ubicación: src/api/localDB.js

const getCollection = (nombre) => {
  try {
    return JSON.parse(localStorage.getItem(nombre) || '[]');
  } catch {
    return [];
  }
};

const saveCollection = (nombre, datos) => {
  localStorage.setItem(nombre, JSON.stringify(datos));
};

const generarId = () => `_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// Fábrica genérica de entidad con CRUD completo
const crearEntidad = (nombreColeccion) => ({

  list: ({ where = {}, order = '', limit = 1000 } = {}) => {
    let datos = getCollection(nombreColeccion);

    // Filtrar por todas las propiedades de where
    datos = datos.filter(item =>
      Object.entries(where).every(([k, v]) => item[k] === v)
    );

    // Ordenar: prefijo '-' indica descendente
    if (order) {
      const desc = order.startsWith('-');
      const campo = desc ? order.slice(1) : order;
      datos.sort((a, b) => {
        if (a[campo] < b[campo]) return desc ? 1 : -1;
        if (a[campo] > b[campo]) return desc ? -1 : 1;
        return 0;
      });
    }

    return Promise.resolve(datos.slice(0, limit));
  },

  create: (datos) => {
    const coleccion = getCollection(nombreColeccion);
    const nuevo = { ...datos, id: generarId(), created_date: new Date().toISOString() };
    coleccion.push(nuevo);
    saveCollection(nombreColeccion, coleccion);
    return Promise.resolve(nuevo);
  },

  update: (id, datos) => {
    const coleccion = getCollection(nombreColeccion);
    const idx = coleccion.findIndex(item => item.id === id);
    if (idx === -1) return Promise.reject(new Error('Registro no encontrado'));
    coleccion[idx] = { ...coleccion[idx], ...datos };
    saveCollection(nombreColeccion, coleccion);
    return Promise.resolve(coleccion[idx]);
  },

  delete: (id) => {
    const coleccion = getCollection(nombreColeccion);
    saveCollection(nombreColeccion, coleccion.filter(item => item.id !== id));
    return Promise.resolve({ success: true });
  },

  get: (id) => {
    const coleccion = getCollection(nombreColeccion);
    const item = coleccion.find(i => i.id === id);
    if (!item) return Promise.reject(new Error('No encontrado'));
    return Promise.resolve(item);
  },
});

// Entidades de La Libreta
export const db = {
  Transaccion: crearEntidad('transacciones'),
  Producto: crearEntidad('productos'),
};
