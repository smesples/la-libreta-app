import React from 'react';
import { ShieldCheck, TrendingUp, Banknote, PackageSearch } from 'lucide-react';

function getRotacionInfo(stockAbs, cajaYCalle) {
  // Capital Inmovilizado: stock muy alto, caja muy baja
  if (stockAbs > cajaYCalle && cajaYCalle < stockAbs * 0.5) {
    return { label: 'Capital Inmovilizado', sub: 'Baja rotación', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' };
  }
  // Operación Fluida: caja alta, stock bajo
  if (cajaYCalle > stockAbs && stockAbs < cajaYCalle * 0.5) {
    return { label: 'Operación Fluida', sub: 'Alta rotación', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  }
  // Alta Eficiencia: ambos parejos (ninguno es menos de la mitad del otro)
  if (stockAbs >= cajaYCalle * 0.5 && cajaYCalle >= stockAbs * 0.5) {
    return { label: 'Alta Eficiencia y Margen', sub: 'Negocio de alto valor agregado', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' };
  }
  // Cualquier otro caso
  return { label: 'Equilibrio Operativo', sub: 'Distribución balanceada', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
}

export default function FortalezaPanel({ comprasStock, ventasTotales, ventasPendientes, efectivoCaja, peqAlcanzadoTemprano }) {
  // S = Total Compras - Total Ventas
  const S = comprasStock - ventasTotales;
  const stockAbs = Math.abs(S);
  const esExcedente = S < 0;

  const stockLabel = esExcedente ? 'Excedente de Valor' : 'Capital Invertido';
  const stockColor = esExcedente ? 'emerald' : 'slate';

  const stockIconBg = esExcedente ? 'bg-emerald-100' : 'bg-slate-200';
  const stockIconText = esExcedente ? 'text-emerald-700' : 'text-slate-700';
  const stockValueText = esExcedente ? 'text-emerald-700' : 'text-slate-800';

  const cajaYCalle = efectivoCaja + ventasPendientes;
  const fortalezaTotal = stockAbs + cajaYCalle;

  const rotacion = getRotacionInfo(stockAbs, cajaYCalle);

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {/* Header Total */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Mi Fortaleza</p>
            <p className="text-white text-3xl font-bold">${fortalezaTotal.toLocaleString()}</p>
          </div>
        </div>
        {/* Badge de eficiencia */}
        <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${rotacion.bg} ${rotacion.color}`}>
          <span className="w-2 h-2 rounded-full bg-current inline-block" />
          {rotacion.label} · {rotacion.sub}
        </div>
        {peqAlcanzadoTemprano && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold bg-yellow-50 border-yellow-300 text-yellow-700">
            <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
            🚀 En Crecimiento Acelerado
          </div>
        )}
      </div>

      {/* Indicadores */}
      <div className="bg-slate-50 divide-y divide-slate-100">

        {/* Stock / Capital */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${stockIconBg} rounded-xl flex items-center justify-center`}>
              <PackageSearch className={`w-5 h-5 ${stockIconText}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">{stockLabel}</p>
              <p className="text-xs text-slate-400">
                {esExcedente ? 'Operación autofinanciada · genera valor neto' : 'Dinero en productos aún no vendidos'}
              </p>
            </div>
          </div>
          <span className={`font-bold text-lg ${stockValueText}`}>${stockAbs.toLocaleString()}</span>
        </div>

        {/* La Calle */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">La calle</p>
              <p className="text-xs text-slate-400">Cobros pendientes</p>
            </div>
          </div>
          <span className="font-bold text-lg text-slate-800">${ventasPendientes.toLocaleString()}</span>
        </div>

        {/* Caja */}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Banknote className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">Caja</p>
              <p className="text-xs text-slate-400">Efectivo disponible</p>
            </div>
          </div>
          <span className="font-bold text-lg text-slate-800">${efectivoCaja.toLocaleString()}</span>
        </div>

      </div>
    </div>
  );
}
