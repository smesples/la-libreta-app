import React, { useState, useMemo } from 'react';
import { Wallet, TrendingUp, Package, Clock, PlusCircle } from 'lucide-react';

const LaLibreta = () => {
  const [transacciones, setTransacciones] = useState([]);
  
  // --- LÓGICA DE DATOS (El Manual de Funciones en Código) ---
  const metrics = useMemo(() => {
    const comprasStock = transacciones
      .filter(t => t.tipo === 'gasto' && (t.cat === 'mercaderia' || t.cat === 'materia_prima'))
      .reduce((acc, t) => acc + t.monto, 0);

    const ventasTotales = transacciones
      .filter(t => t.tipo === 'ingreso' && t.cat === 'venta')
      .reduce((acc, t) => acc + t.monto, 0);

    const efectivoCaja = transacciones
      .filter(t => t.tipo === 'ingreso' && t.pago === 'contado')
      .reduce((acc, t) => acc + t.monto, 0) - 
      transacciones.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0);

    const ventasPendientes = transacciones
      .filter(t => t.tipo === 'ingreso' && t.pago === 'a_cuenta')
      .reduce((acc, t) => acc + t.monto, 0);

    // Indicador de Stock Absoluto
    const S = comprasStock - ventasTotales;
    const stockAbs = Math.abs(S);
    const esExcedente = S < 0;

    // Indicador de Fortaleza
    const fortalezaTotal = stockAbs + efectivoCaja + ventasPendientes;

    return { stockAbs, esExcedente, efectivoCaja, ventasPendientes, fortalezaTotal, ventasTotales };
  }, [transacciones]);

  // --- LÓGICA DE ROTACIÓN (Para el Banco Patagonia) ---
  const getRotacion = () => {
    const { stockAbs, efectivoCaja, ventasPendientes } = metrics;
    const liquidez = efectivoCaja + ventasPendientes;
    if (stockAbs > liquidez && liquidez < stockAbs * 0.5) return "Capital Inmovilizado";
    if (liquidez > stockAbs && stockAbs < liquidez * 0.5) return "Operación Fluida";
    return "Alta Eficiencia y Margen";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">La Libreta</h1>
        <p className="text-sm text-gray-500">Consorcio Tecnológico Productivo</p>
      </header>

      {/* DASHBOARD DE FORTALEZA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">FORTALEZA TOTAL</span>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold">${metrics.fortalezaTotal.toLocaleString()}</div>
          <div className="mt-2 text-xs font-bold text-blue-600 bg-blue-50 py-1 px-2 rounded inline-block">
            {getRotacion()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">STOCK (VALOR ABSOLUTO)</span>
            <Package className="text-green-500" size={20} />
          </div>
          <div className="text-3xl font-bold">${metrics.stockAbs.toLocaleString()}</div>
          <div className={`text-xs mt-2 ${metrics.esExcedente ? 'text-green-600' : 'text-orange-600'}`}>
            {metrics.esExcedente ? '● Excedente de Valor' : '● Capital Invertido'}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">CAJA Y CALLE</span>
            <Wallet className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold">${(metrics.efectivoCaja + metrics.ventasPendientes).toLocaleString()}</div>
          <div className="text-xs mt-2 text-gray-400">Efectivo + Cuentas por Cobrar</div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN RÁPIDA */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setTransacciones([...transacciones, { tipo: 'gasto', cat: 'mercaderia', monto: 10000, pago: 'contado', fecha: new Date() }])}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <PlusCircle size={18} /> Cargar Compra ($10k)
        </button>
        <button 
          onClick={() => setTransacciones([...transacciones, { tipo: 'ingreso', cat: 'venta', monto: 15000, pago: 'contado', fecha: new Date() }])}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <PlusCircle size={18} /> Cargar Venta ($15k)
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Monto</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="p-4 text-sm">{t.fecha.toLocaleDateString()}</td>
                <td className="p-4 font-medium uppercase text-xs">{t.tipo}</td>
                <td className="p-4 text-gray-600">{t.cat}</td>
                <td className={`p-4 font-bold ${t.tipo === 'gasto' ? 'text-red-500' : 'text-green-500'}`}>
                  ${t.monto.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaLibreta;
