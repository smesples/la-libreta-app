import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Repeat, CheckCircle } from 'lucide-react';

const categoriaLabels = {
  venta: "Venta",
  servicio: "Servicio",
  otro_ingreso: "Otro ingreso",
  materia_prima: "Materia prima",
  transporte: "Transporte",
  servicios: "Servicios",
  alquiler: "Alquiler",
  salarios: "Salarios",
  publicidad: "Publicidad",
  otros_gastos: "Otros"
};

export default function ListaTransacciones({ transacciones, onCobrar }) {
  if (!transacciones || transacciones.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No hay movimientos todavía</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transacciones.map((t) => {
        const esIngreso = t.tipo === 'ingreso';
        const esACuenta = esIngreso && t.modalidad_pago === 'a_cuenta';
        return (
          <div 
            key={t.id} 
            className={`flex items-center justify-between p-4 rounded-xl border ${
              esACuenta ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                esACuenta ? 'bg-amber-100' : esIngreso ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {esIngreso ? (
                  <TrendingUp className={`w-5 h-5 ${esACuenta ? 'text-amber-600' : 'text-emerald-600'}`} />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-800">
                  {t.descripcion || categoriaLabels[t.categoria] || t.categoria}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{format(new Date(t.fecha), 'd MMM', { locale: es })}</span>
                  {t.es_costo_fijo && (
                    <span className="flex items-center gap-1 text-amber-500">
                      <Repeat className="w-3 h-3" /> Fijo
                    </span>
                  )}
                  {esACuenta && (
                    <span className="text-amber-600 font-medium bg-amber-100 px-2 py-0.5 rounded-full">
                      A cuenta
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <p className={`font-bold text-lg ${
                esACuenta ? 'text-amber-600' : esIngreso ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {esIngreso ? '+' : '-'}${t.monto.toLocaleString()}
              </p>
              {esACuenta && onCobrar && (
                <button
                  onClick={() => onCobrar(t)}
                  className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle className="w-3 h-3" /> Marcar cobrado
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
