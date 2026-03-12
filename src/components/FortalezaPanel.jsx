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

function getDiagnosticoServicios(ventasPendientes, efectivoCaja) {
  const promedio = (ventasPendientes + efectivoCaja) / 2;
  const calle = clasificar(ventasPendientes, promedio);
  const caja = clasificar(efectivoCaja, promedio);

  // 🟢 VERDE
  if (caja === 'alto' && calle === 'alto') return {
    label: 'Servicio en Expansión',
    mensaje: 'Cobrás bien y tenés caja para crecer.',
    semaforo: 'verde',
  };
  if (caja === 'alto' && calle !== 'alto') return {
    label: 'Liquidez Sólida',
    mensaje: 'Tenés caja disponible y poca deuda pendiente.',
    semaforo: 'verde',
  };

  // 🔴 ROJO
  if (caja === 'bajo' && calle === 'alto') return {
    label: 'Cobranza Crítica',
    mensaje: 'Trabajaste pero no estás cobrando.',
    semaforo: 'rojo',
  };
  if (caja === 'bajo' && calle === 'normal') return {
    label: 'Liquidez Ajustada',
    mensaje: 'Tu caja necesita refuerzo urgente.',
    semaforo: 'rojo',
  };
  if (caja === 'bajo' && calle === 'bajo') return {
    label: 'Servicio Inactivo',
    mensaje: 'No hay movimiento en ninguna variable.',
    semaforo: 'rojo',
  };

  // 🟡 AMARILLO
  if (calle === 'alto') return {
    label: 'Cobranza Pendiente',
    mensaje: 'Trabajaste bien, pero el dinero todavía está en la calle.',
    semaforo: 'amarillo',
  };

  return {
    label: 'Actividad Moderada',
    mensaje: 'Hay movimiento pero podés mejorar el volumen.',
    semaforo: 'amarillo',
  };
}
function getDiagnosticoServicios(ventasPendientes, efectivoCaja) {
  const promedio = (ventasPendientes + efectivoCaja) / 2;
  const calle = clasificar(ventasPendientes, promedio);
  const caja = clasificar(efectivoCaja, promedio);

  // 🟢 VERDE
  if (caja === 'alto' && calle === 'alto') return {
    label: 'Servicio en Expansión',
    mensaje: 'Cobrás bien y tenés caja para crecer.',
    semaforo: 'verde',
  };
  if (caja === 'alto' && calle === 'bajo') return {
    label: 'Liquidez Sólida',
    mensaje: 'Tenés caja disponible y poca deuda pendiente.',
    semaforo: 'verde',
  };

  // 🔴 ROJO
  if (caja === 'bajo' && calle === 'alto') return {
    label: 'Cobranza Crítica',
    mensaje: 'Trabajaste pero no estás cobrando.',
    semaforo: 'rojo',
  };
  if (caja === 'bajo' && calle === 'normal') return {
    label: 'Liquidez Ajustada',
    mensaje: 'Tu caja necesita refuerzo urgente.',
    semaforo: 'rojo',
  };
  if (caja === 'bajo' && calle === 'bajo') return {
    label: 'Servicio Inactivo',
    mensaje: 'No hay movimiento en ninguna variable.',
    semaforo: 'rojo',
  };

  // 🟡 AMARILLO
  if (calle === 'alto') return {
    label: 'Cobranza Pendiente',
    mensaje: 'Trabajaste bien, pero el dinero todavía está en la calle.',
    semaforo: 'amarillo',
  };
  if (caja === 'normal' && calle === 'bajo') return {
    label: 'Actividad Moderada',
    mensaje: 'Hay movimiento pero podés mejorar el volumen.',
    semaforo: 'amarillo',
  };

  return {
    label: 'Operación Equilibrada',
    mensaje: 'Tu negocio está estable.',
    semaforo: 'amarillo',
  };
}

function getEstiloSemaforo(semaforo) {
  if (semaforo === 'verde') return { color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300', emoji: '🟢' };
  if (semaforo === 'rojo') return { color: 'text-red-700', bg: 'bg-red-50 border-red-300', emoji: '🔴' };
  return { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-300', emoji: '🟡' };
}

export default function FortalezaPanel({ comprasStock, ventasTotales, ventasPendientes, efectivoCaja, peqAlcanzadoTemprano, ingresosServicio }) {
  const S = comprasStock - ventasTotales;
  const stockAbs = Math.abs(S);
  const esExcedente = S < 0;

  const stockIconBg = esExcedente ? 'bg-emerald-100' : 'bg-slate-200';
  const stockIconText = esExcedente ? 'text-emerald-700' : 'text-slate-700';
  const stockValueText = esExcedente ? 'text-emerald-700' : 'text-slate-800';

  const cajaYCalle = efectivoCaja + ventasPendientes;
  const fortalezaTotal = stockAbs + cajaYCalle;

  // Detectar perfil automáticamente
  const tieneProductos = comprasStock > 0 || ventasTotales > 0;
  const tieneServicios = (ingresosServicio || 0) > 0;
  const esSoloServicios = tieneServicios && !tieneProductos;

  const diagnostico = esSoloServicios
    ? getDiagnosticoServicios(ventasPendientes, efectivoCaja)
    : getDiagnosticoProductos(stockAbs, ventasPendientes, efectivoCaja);

  const estilo = getEstiloSemaforo(diagnostico.semaforo);

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
        <div className={`mt-3 inline-flex flex-col px-3 py-2 rounded-2xl border ${estilo.bg}`}>
          <div className="flex items-center gap-2">
            <span className="text-base">{estilo.emoji}</span>
            <span className={`text-xs font-bold ${estilo.color}`}>{diagnostico.label}</span>
          </div>
          <p className={`text-xs mt-0.5 ${estilo.color} opacity-80`}>{diagnostico.mensaje}</p>
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

        {/* Stock / Capital — solo si tiene productos */}
        {tieneProductos && (
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
        )}

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
