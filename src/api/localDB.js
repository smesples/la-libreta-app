import { supabase } from './supabaseClient';

const crearEntidad = (tabla) => ({

  list: async ({ where = {}, order = '', limit = 1000 } = {}) => {
    let query = supabase.from(tabla).select('*').limit(limit);
    Object.entries(where).forEach(([k, v]) => { query = query.eq(k, v); });
    if (order) {
      const desc = order.startsWith('-');
      query = query.order(desc ? order.slice(1) : order, { ascending: !desc });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (datos) => {
    const { data, error } = await supabase.from(tabla).insert(datos).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id, datos) => {
    const { data, error } = await supabase.from(tabla).update(datos)
      .eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from(tabla).delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  get: async (id) => {
    const { data, error } = await supabase.from(tabla).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }
});

export const db = {
  Transaccion: crearEntidad('transacciones'),
  Producto: crearEntidad('productos'),
};
