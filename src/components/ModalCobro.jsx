// ModalCobro.jsx — Resolución de estado: A Cobrar → Contado
// Soporta cobro total y cobro parcial (deja saldo pendiente)
import React, { useState } from 'react';
import { X, CheckCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ModalCobro({ open, transaccion, onClose, onConfirmar }) {
  const [montoCobrado, setMontoCobrado] = useState('');
  const [loading, setLoading] = useState(false);
  const [modo, setModo] = useState('total'); // 'total' | 'parcial'

  if (!open || !transaccion) return null;

  const montoOriginal = transaccion.monto;
  const montoIngresado = Number(montoCobrado) || 0;
  const saldoRestante = montoOriginal - montoIngresado;
  const esParcialValido = modo === 'parcial' && montoIngresado > 0 && montoIngresado < montoOriginal;
  const esTotalValido = modo === 'total';
  const puedeGuardar = esTotalValido || esParcialValido;

  const handleSubmit = async () => {
    if (!puedeGuardar) return;
    setLoading(true);
    try {
      await onConfirmar({
        transaccion,
        montoCobrado: modo === 'total' ? montoOriginal : montoIngresado,
        saldoRestante: modo === 'total' ? 0 : saldoRestante,
        esParcial: modo === 'parcial',
      });
      onClose();
    } catch (err) {
      alert('Error al registrar el cobro: ' + err.message);
    } finally {
      setLoading(false);
      setMontoCobrado('');
      setModo('total');
    }
  };

  const descripcion = transaccion.descripcion || transaccion.categoria || 'Venta';
  const fechaFormateada = format(new Date(transaccion.fecha), "d 'de' MMMM", { locale: es });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-t-3xl p-6 pb-10 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">💰 Registrar Cobro</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Tarjeta de la deuda original */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Deuda pendiente</p>
          <p className="font-semibold text-slate-800">{descripcion}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-400">{fechaFormateada}</span>
            <span className="text-xl font-bold text-amber-600">${montoOriginal.toLocaleString()}</span>
          </div>
        </div>

        {/* Selector de modo */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            onClick={() => setModo('total')}
            className={`py-3 rounded-2xl font-semibold text-sm border-2 transition-all ${
              modo === 'total'
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
            }`}
          >
            ✅ Cobro total
          </button>
          <button
            onClick={() => setModo('parcial')}
            className={`py-3 rounded-2xl font-semibold text-sm border-2 transition-all ${
              modo === 'parcial'
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            🔄 Cobro parcial
          </button>
        </div>

        {/* Cobro total: resumen */}
        {modo === 'total' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                Se moverán <span className="text-emerald-600">${montoOriginal.toLocaleString()}</span> a Caja
              </p>
              <p className="text-xs text-emerald-600 mt-0.5">La deuda quedará saldada completamente</p>
            </div>
          </div>
        )}

        {/* Cobro parcial: input + preview */}
        {modo === 'parcial' && (
          <div className="space-y-3 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                ¿Cuánto te pagaron hoy?
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
                <input
                  type="number"
                  value={montoCobrado}
                  onChange={(e) => setMontoCobrado(e.target.value)}
                  min="1"
                  max={montoOriginal - 1}
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-14 pl-8 pr-4 text-2xl font-bold border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {montoIngresado > 0 && montoIngresado < montoOriginal && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-600 font-medium">Va a Caja</p>
                  <p className="text-lg font-bold text-emerald-700">${montoIngresado.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-600 font-medium">Queda en La Calle</p>
                  <p className="text-lg font-bold text-amber-700">${saldoRestante.toLocaleString()}</p>
                </div>
              </div>
            )}

            {montoIngresado >= montoOriginal && montoIngresado > 0 && (
              <p className="text-xs text-red-500 text-center">
                El monto no puede ser igual o mayor al total. Usá "Cobro total".
              </p>
            )}
          </div>
        )}

        {/* Botón confirmar */}
        <button
          onClick={handleSubmit}
          disabled={!puedeGuardar || loading}
          className={`w-full h-14 rounded-2xl font-bold text-white text-lg transition-all ${
            !puedeGuardar || loading
              ? 'bg-slate-300 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
          }`}
        >
          {loading ? '⏳ Guardando...' : '✅ Confirmar Cobro'}
        </button>
      </div>
    </div>
  );
}
