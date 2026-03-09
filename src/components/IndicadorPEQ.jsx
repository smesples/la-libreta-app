import React from 'react';
import { Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export default function IndicadorPEQ({ gastosMes, ventasMes }) {
  const faltante = gastosMes - ventasMes;
  const alcanzado = faltante <= 0;
  const porcentaje = gastosMes > 0 ? Math.min((ventasMes / gastosMes) * 100, 100) : 0;

  return (
    <div className={`p-5 rounded-2xl border-2 ${alcanzado ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-100'}`}>
      <div className="flex items-center gap-2 mb-3">
        <Target className={`w-5 h-5 ${alcanzado ? 'text-emerald-600' : 'text-blue-600'}`} />
        <h3 className={`font-bold text-sm ${alcanzado ? 'text-emerald-800' : 'text-blue-800'}`}>
          PEQ del mes — En tiempo real
        </h3>
      </div>

      {gastosMes > 0 ? (
        <>
          <div className="mb-3">
            {alcanzado ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-700 text-lg">¡Punto de Equilibrio alcanzado!</p>
                  <p className="text-sm text-emerald-600">Excedente: ${Math.abs(faltante).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-blue-600 mb-1">Faltan para cubrir gastos del mes:</p>
                <p className="text-3xl font-bold text-blue-800">
                  ${faltante.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Ventas ${ventasMes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              <span>{porcentaje.toFixed(0)}%</span>
              <span>Meta ${gastosMes.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${alcanzado ? 'bg-emerald-500' : 'bg-blue-500'}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <p className="text-sm text-blue-600 text-center py-2">Sin gastos registrados este mes</p>
      )}
    </div>
  );
}
