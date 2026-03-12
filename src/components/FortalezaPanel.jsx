import React from 'react';
import { ShieldCheck, TrendingUp, Banknote, PackageSearch } from 'lucide-react';

// Umbrales: Alto > 60% del promedio, Bajo < 40%, Normal en el medio
function clasificar(valor, promedio) {
  if (promedio === 0) return valor > 0 ? 'alto' : 'bajo';
  const ratio = valor / promedio;
  if (ratio > 0.6) return 'alto';
  if (ratio < 0.4) return 'bajo';
  return 'normal';
}

function getDiagnostico(stockAbs, ventasPendientes, efectivoCaja) {
  const promedio = (stockAbs + ventasPendientes + efectivoCaja) / 3;
  const stock = clasificar(stockAbs, promedio);
  const calle = clasificar(ventasPendientes, promedio);
  const caja = clasificar(efectivoCaja, promedio);

  // 🟢 VERDE
  if (stock === 'alto' && calle === 'alto' && caja === 'alto') return {
    label: 'Crecimiento Acelerado',
    mensaje: 'Tu negocio está creciendo en todos los frentes.',
    semaforo: 'verde',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-300',
    dot: 'bg-emerald-500',
  };
  if (stock === 'bajo' && calle === 'alto' && caja === 'alto') return {
    label: 'Ciclo Exitoso',
    mensaje: 'Vendiste bien y cobrás bien.',
    semaforo: 'verde',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-300',
    dot: 'bg-emerald-500',
  };

  // 🔴 ROJO
  if (stock === 'bajo' && calle === 'bajo' && caja === 'bajo') return {
    label: 'Negocio Inactivo',
    mensaje: 'No hay movimiento en ninguna variable.',
    semaforo: 'rojo',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-300',
    dot: 'bg-red-500',
  };
  if (stock === 'alto' && calle === 'bajo' && caja === 'bajo') return {
    label: 'Capital Inmovilizado',
    mensaje: 'Tu capital está atrapado en stock sin caja ni cobros.',
    semaforo: 'rojo',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-300',
    dot: 'bg-red-500',
  };
  if (calle === 'alto' && caja === 'bajo') return {
    label: 'Cobranza Crítica',
    mensaje: 'Vendiste pero no estás cobrando.',
    semaforo: 'rojo',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-300',
    dot: 'bg-red-500',
  };

  // 🟡 AMARILLO
  if (stock === 'alto' && caja !== 'bajo') return {
    label: 'Exceso de Stock',
    mensaje: 'Tenés más mercadería de la que estás vendiendo.',
    semaforo: 'amarillo',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-300',
    dot: 'bg-yellow-500',
  };
  if (caja === 'alto' && stock === 'bajo' && calle === 'bajo') return {
    label: 'Liquidez Sin Actividad',
    mensaje: 'Tenés caja disponible pero poco movimiento comercial.',
    semaforo: 'amarillo',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-300',
    dot: 'bg-yellow-500',
  };

  // 🟡 DEFAULT
  return {
    label: 'Operación Equilibrada',
    mensaje: 'Tu negocio está estable.',
    semaforo: 'amarillo',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-300',
    dot: 'bg-yellow-500',
  };
}

export default function FortalezaPanel({ comprasStock, ventasTotales, ventasPendientes, efectivoCaja, peqAlcanzadoTemprano }) {
  const S = comprasStock - ventasTotales;
  const stockAbs = Math.abs(S);
  const esExcedente = S < 0;

  const stockIconBg = esExcedente ? 'bg-emerald-100' : 'bg-slate-200';
  const stockIconText = esExcedente ? 'text-emerald-700' : 'text-slate-700';
  const stockValueText = esExcedente ? 'text-emerald-700' : 'text-slate-800';

  const cajaYCalle = efectivoCaja + ventasPendientes;
  const fortalezaTotal = stockAbs + cajaYCalle;

  const diagnostico = getDiagnostico(stockAbs, ventasPendientes, efectivoCaja);

  // Emoji semáforo
  const emojiSemaforo = diagnostico.semaforo === 'verde' ? '🟢' : diagnostico.semaforo === 'rojo' ? '🔴' : '🟡';

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

        {/* Badge diagnóstico con semáforo */}
        <div className={`mt-3 inline-flex flex-col px-3 py-2 rounded-2xl border ${diagnostico.bg}`}>
          <div className="flex items-center gap-2">
            <span className="text-base">{emojiSemaforo}</span>
            <span className={`text-xs font-bold ${diagnostico.color}`}>{diagnostico.label}</span>
          </div>
          <p className={`text-xs mt-0.5 ${diagnostico.color} opacity-80`}>{diagnostico.mensaje}</p>
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
              <p className="font-semibold text-slate-700 text-sm">
                {esExcedente ? 'Valor Agregado Operativo' : 'Capital Invertido'}
              </p>
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
              <p className="font-semibold text-slate-700 text-sm">La Calle</p>
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
