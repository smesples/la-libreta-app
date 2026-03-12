// ModalRegistro.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ModalRegistro({ open, onClose, tipo, onGuardar }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const datos = {
      monto: Number(formData.get('monto')),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion') || '',
      fecha: formData.get('fecha') || new Date().toISOString().split('T')[0],
      modalidad_pago: formData.get('modalidad_pago') || 'contado',
      es_costo_fijo: formData.get('es_costo_fijo') === 'true',
      es_gasto_negocio: tipo === 'gasto' ? formData.get('es_gasto_negocio') !== 'false' : true,
      tipo,
    };

    try {
      await onGuardar(datos);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar. Reintente.");
    } finally {
      // ✅ FIX: se ejecuta siempre, tanto si tuvo éxito como si falló
      setLoading(false);
    }
  };

  const esIngreso = tipo === 'ingreso';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {esIngreso ? '💰 Registrar Ingreso' : '📤 Registrar Gasto'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Monto */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Monto *
            </label>
            <input
              name="monto"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="w-full h-14 px-4 text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Categoría *
            </label>
            <select
              name="categoria"
              required
              className="w-full h-12 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 bg-white transition-colors"
            >
              {esIngreso ? (
                <>
                  <option value="venta">Producto</option>
                  <option value="servicio">Servicio</option>
                  <option value="otro_ingreso">Otro ingreso</option>
                </>
              ) : (
                <>
                  <option value="mercaderia">Mercadería / Stock</option>
                  <option value="materia_prima">Materia Prima</option>
                  <option value="gasoil">Gasoil / Combustible</option>
                  <option value="servicio">Servicio / Herramienta</option>
                  <option value="costo_fijo">Costo Fijo</option>
                  <option value="otro_gasto">Otro gasto</option>
                </>
              )}
            </select>
          </div>

          {/* Modalidad de pago */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              {esIngreso ? '¿Cómo te pagaron?' : '¿Cómo pagaste?'}
            </label>
            <select
              name="modalidad_pago"
              className="w-full h-12 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 bg-white transition-colors"
            >
              <option value="contado">Contado</option>
              <option value="a_cuenta">A cobrar / La Calle</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Descripción (opcional)
            </label>
            <input
              name="descripcion"
              type="text"
              placeholder="Ej: 10 kg de miel, gasoil tractor..."
              className="w-full h-12 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Fecha
            </label>
            <input
              name="fecha"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full h-12 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>

          {/* Es costo fijo (solo gastos) */}
          {!esIngreso && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <input
                type="checkbox"
                name="es_costo_fijo"
                value="true"
                id="esCostoFijo"
                className="w-5 h-5 accent-slate-600"
              />
              <label htmlFor="esCostoFijo" className="text-sm text-slate-700">
                Es costo fijo mensual (alquiler, luz, etc.)
              </label>
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-2xl font-bold text-white text-lg transition-all
              ${loading
                ? 'bg-slate-400 cursor-not-allowed'
                : esIngreso
                  ? 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
                  : 'bg-red-500 hover:bg-red-600 active:scale-95'
              }`}
          >
            {loading ? '⏳ Guardando...' : esIngreso ? '✅ Guardar Ingreso' : '✅ Guardar Gasto'}
          </button>

        </form>
      </div>
    </div>
  );
}
