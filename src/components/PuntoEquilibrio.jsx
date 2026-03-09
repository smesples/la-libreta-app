import React from 'react';
import { Target, AlertCircle, CheckCircle } from 'lucide-react';

export default function PuntoEquilibrio({ costosFijos, margenPromedio, ventasMes }) {
  // Punto de equilibrio = Costos Fijos / Margen de contribución promedio
  const puntoEquilibrio = margenPromedio > 0 ? costosFijos / (margenPromedio / 100) : 0;
  const porcentajeAlcanzado = puntoEquilibrio > 0 ? (ventasMes / puntoEquilibrio * 100) : 0;
  const alcanzado = ventasMes >= puntoEquilibrio;

  return (
    <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-blue-800">Punto de Equilibrio</h3>
      </div>

      {margenPromedio > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-sm text-blue-600 mb-1">Necesitas vender</p>
            <p className="text-3xl font-bold text-blue-800">
              ${puntoEquilibrio.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-blue-600">para cubrir tus costos fijos</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progreso este mes</span>
              <span className="font-medium">{Math.min(porcentajeAlcanzado, 100).toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  alcanzado ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(porcentajeAlcanzado, 100)}%` }}
              />
            </div>
          </div>

          <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 ${
            alcanzado ? 'bg-emerald-100' : 'bg-amber-100'
          }`}>
            {alcanzado ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">
                  ¡Excelente! Tus costos están cubiertos. Todo lo que vendas ahora aumenta tu Fortaleza.
                </p>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-700 font-medium">
                  Te faltan ${(puntoEquilibrio - ventasMes).toLocaleString(undefined, { maximumFractionDigits: 0 })} de ventas para cubrir tus costos fijos. ¡Vamos que falta poco!
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-4 text-blue-600">
          <p className="text-sm">Agrega productos con precios para calcular</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-blue-200 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-xs text-blue-600">Costos fijos</p>
          <p className="font-bold text-blue-800">${costosFijos.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-blue-600">Margen promedio</p>
          <p className="font-bold text-blue-800">{margenPromedio.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
