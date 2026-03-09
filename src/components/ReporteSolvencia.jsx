import React, { useMemo } from 'react';
import { BarChart2, CheckCircle, AlertCircle } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// Recibe todas las transacciones históricas
export default function ReporteSolvencia({ transacciones }) {
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const añoActual = ahora.getFullYear();

  // Construir datos de los últimos 6 meses cerrados
  const meses = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const fecha = subMonths(ahora, i + 1);
      const inicio = startOfMonth(fecha);
      const fin = endOfMonth(fecha);
      const label = format(fecha, 'MMM yyyy', { locale: es });

      const txMes = transacciones.filter(t => {
        const d = new Date(t.fecha);
        return d >= inicio && d <= fin;
      });

      const ventas = txMes.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + t.monto, 0);
      const gastos = txMes.filter(t => t.tipo === 'gasto').reduce((s, t) => s + t.monto, 0);
      const peqAlcanzado = ventas >= gastos;
      const diasMes = fin.getDate();

      // Estimar el día en que se alcanzó el PEQ (aproximado por distribución lineal)
      let diaEstimado = null;
      if (peqAlcanzado && gastos > 0) {
        const ratio = gastos / ventas;
        diaEstimado = Math.ceil(diasMes * ratio);
      }

      return { label, ventas, gastos, peqAlcanzado, diaEstimado, diasMes };
    }).reverse();
  }, [transacciones]);

  const mesesAlcanzados = meses.filter(m => m.peqAlcanzado).length;
  const promedioVentas = meses.length > 0 ? meses.reduce((s, m) => s + m.ventas, 0) / meses.length : 0;
  const promedioGastos = meses.length > 0 ? meses.reduce((s, m) => s + m.gastos, 0) / meses.length : 0;

  if (meses.every(m => m.ventas === 0 && m.gastos === 0)) {
    return null; // No mostrar si no hay datos históricos
  }

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-indigo-800">Reporte de Solvencia Mensual</h3>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-xs text-indigo-600">Meses en equilibrio</p>
          <p className="text-2xl font-bold text-indigo-800">{mesesAlcanzados}/{meses.length}</p>
        </div>
        <div className="bg-white/70 rounded-xl p-3 text-center">
          <p className="text-xs text-indigo-600">Venta prom. mensual</p>
          <p className="text-2xl font-bold text-indigo-800">${Math.round(promedioVentas).toLocaleString()}</p>
        </div>
      </div>

      {/* Tabla de meses */}
      <div className="space-y-2">
        {meses.map((m, i) => (
          <div key={i} className="flex items-center justify-between bg-white/60 rounded-xl px-4 py-2">
            <div className="flex items-center gap-2">
              {m.peqAlcanzado
                ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              }
              <span className="text-sm font-medium text-slate-700 capitalize">{m.label}</span>
            </div>
            <div className="text-right">
              {m.peqAlcanzado ? (
                <span className="text-xs text-emerald-600 font-semibold">
                  {m.diaEstimado ? `~día ${m.diaEstimado}` : 'Alcanzado'}
                </span>
              ) : (
                <span className="text-xs text-red-500 font-semibold">
                  Faltó ${(m.gastos - m.ventas).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-indigo-200 flex justify-between text-xs text-indigo-600">
        <span>Gasto prom. mensual: <strong>${Math.round(promedioGastos).toLocaleString()}</strong></span>
        <span>Solvencia: <strong>{meses.length > 0 ? ((mesesAlcanzados / meses.length) * 100).toFixed(0) : 0}%</strong></span>
      </div>
    </div>
  );
}
