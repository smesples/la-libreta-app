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
      descripcion: formData.get('descripcion'),
      fecha: formData.get('fecha') || new Date().toISOString().split('T')[0],
      modalidad_pago: formData.get('modalidad_pago') || 'contado',
      tipo: tipo // 'ingreso' o 'gasto'
    };

    try {
      // Llamamos a la función que está en Home.jsx
      await onGuardar(datos);
      // NO reseteamos el loading aquí porque Home.jsx cerrará el modal
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar. Reintente.");
      setLoading(false); // Solo si falla, liberamos el botón
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 capitalize">Registrar {tipo}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto ($)</label>
            <input
              required
              name="monto"
              type="number"
              placeholder="0.00"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select name="categoria" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none">
              {tipo === 'ingreso' ? (
                <>
                  <option value="venta">Venta de producto</option>
                  <option value="servicio">Servicio/Asesoría</option>
                  <option value="otro">Otro ingreso</option>
                </>
              ) : (
                <>
                  <option value="materia_prima">Insumos / Materia Prima</option>
                  <option value="fijo">Costo Fijo (Luz, Alquiler, etc)</option>
                  <option value="empaque">Packaging / Empaque</option>
                  <option value="transporte">Flete / Transporte</option>
                  <option value="otro">Otro gasto</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input
              name="descripcion"
              placeholder="Ej: Venta 10kg de Maíz"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input
                name="fecha"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pago</label>
              <select name="modalidad_pago" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                <option value="contado">Contado</option>
                <option value="a_cuenta">A cuenta (Pendiente)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              tipo === 'ingreso' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Procesando...' : `Confirmar ${tipo}`}
          </button>
        </form>
      </div>
    </div>
  );
}
