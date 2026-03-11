// Home.jsx — Nueva jerarquía UX: acción > KPIs > PEQ > Fortaleza compacta > Movimientos / Reporte
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../api/localDB';
import { useAuth } from '@/lib/AuthContext';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BotonGrande from '../components/BotonGrande';
import TarjetaResumen from '../components/TarjetaResumen';
import ModalRegistro from '../components/ModalRegistro';
import ListaTransacciones from '../components/ListaTransacciones';
import FortalezaPanel from '../components/FortalezaPanel';
import IndicadorPEQ from '../components/IndicadorPEQ';
import ReporteSolvencia from '../components/ReporteSolvencia';

export default function Home() {
  const [modalIngreso, setModalIngreso] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);

  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const currentUserId = user?.id || 'anonimo';
  const nombreUsuario = user?.nombre || 'Productor';

  const { data: transacciones = [] } = useQuery({
    queryKey: ['transacciones', currentUserId],
    queryFn: () => db.Transaccion.list({
      where: { usuarioId: currentUserId },
      order: '-fecha',
      limit: 100
    })
  });

  const crearTransaccion = useMutation({
    mutationFn: (data) => db.Transaccion.create({ ...data, usuarioId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
      setModalIngreso(false);
      setModalGasto(false);
    },
    onError: (error) => {
      setModalIngreso(false);
      setModalGasto(false);
      alert("Error al guardar: " + error.message);
    }
  });

  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();

  const transaccionesMes = transacciones.filter(t => {
    const fecha = new Date(t.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const ventasMes = transaccionesMes
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastosMes = transaccionesMes
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balanceMes = ventasMes - gastosMes;

  const comprasStock = transacciones
    .filter(t => t.tipo === 'gasto' && ['mercaderia', 'materia_prima'].includes(t.categoria))
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasTotales = transacciones
    .filter(t => t.tipo === 'ingreso' && t.categoria === 'venta')
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasPendientes = transacciones
    .filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'a_cuenta')
    .reduce((sum, t) => sum + t.monto, 0);

  const efectivoCaja = Math.max(0, transacciones.reduce((sum, t) => {
    if (t.tipo === 'ingreso' && t.modalidad_pago !== 'a_cuenta') return sum + t.monto;
    if (t.tipo === 'gasto') return sum - t.monto;
    return sum;
  }, 0));

  const diaHoy = new Date().getDate();
  const peqAlcanzadoTemprano = diaHoy <= 20 && ventasMes >= gastosMes && gastosMes > 0;

  // Fortaleza total para el widget compacto del Home
  const S = comprasStock - ventasTotales;
  const stockAbs = Math.abs(S);
  const fortalezaTotal = stockAbs + efectivoCaja + ventasPendientes;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div>
          <h1 className="font-bold text-slate-800 text-lg">La Libreta</h1>
          <p className="text-xs text-slate-400">{nombreUsuario}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>

      {/* ── ZONA 1: BOTONES DE ACCIÓN — sticky bajo el header ── */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-slate-200 px-4 py-3 flex gap-3 shadow-sm">
        <BotonGrande
          variant="primary"
          onClick={() => setModalIngreso(true)}
          className="flex-1"
        >
          + Ingreso
        </BotonGrande>
        <BotonGrande
          variant="danger"
          onClick={() => setModalGasto(true)}
          className="flex-1"
        >
          − Gasto
        </BotonGrande>
      </div>

      <div className="max-w-2xl mx-auto p-4 pb-10 space-y-4">

        {/* ── ZONA 2: KPIs OPERATIVOS DEL MES ── */}
        <div className="grid grid-cols-3 gap-3">
          <TarjetaResumen titulo="Ingresos" valor={ventasMes} color="emerald" />
          <TarjetaResumen titulo="Gastos" valor={gastosMes} color="red" />
          <TarjetaResumen titulo="Balance" valor={balanceMes} color={balanceMes >= 0 ? "blue" : "red"} />
        </div>

        {/* ── ZONA 3: PUNTO DE EQUILIBRIO ── */}
        <IndicadorPEQ gastosMes={gastosMes} ventasMes={ventasMes} />

        {/* ── ZONA 4: FORTALEZA COMPACTA — solo el número + acceso al Reporte ── */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Mi Fortaleza</p>
              <p className="text-white text-2xl font-bold">${fortalezaTotal.toLocaleString()}</p>
            </div>
          </div>
          {peqAlcanzadoTemprano && (
            <span className="text-xs font-semibold bg-yellow-50 border border-yellow-300 text-yellow-700 px-3 py-1.5 rounded-full">
              🚀 En crecimiento
            </span>
          )}
        </div>

        {/* ── TABS: MOVIMIENTOS / REPORTE ── */}
        <Tabs defaultValue="movimientos">
          <TabsList className="w-full">
            <TabsTrigger value="movimientos" className="flex-1">Movimientos</TabsTrigger>
            <TabsTrigger value="reporte" className="flex-1">Reporte</TabsTrigger>
          </TabsList>

          {/* Movimientos: lista de transacciones del usuario */}
          <TabsContent value="movimientos" className="mt-3">
            <ListaTransacciones transacciones={transacciones} />
          </TabsContent>

          {/* Reporte: Fortaleza completa + historial de solvencia mensual */}
          <TabsContent value="reporte" className="mt-3 space-y-4">
            <FortalezaPanel
              comprasStock={comprasStock}
              ventasTotales={ventasTotales}
              ventasPendientes={ventasPendientes}
              efectivoCaja={efectivoCaja}
              peqAlcanzadoTemprano={peqAlcanzadoTemprano}
            />
            <ReporteSolvencia transacciones={transacciones} />
          </TabsContent>
        </Tabs>
      </div>

      <ModalRegistro
        open={modalIngreso}
        onClose={() => setModalIngreso(false)}
        tipo="ingreso"
        onGuardar={(datos) => crearTransaccion.mutateAsync(datos)}
      />
      <ModalRegistro
        open={modalGasto}
        onClose={() => setModalGasto(false)}
        tipo="gasto"
        onGuardar={(datos) => crearTransaccion.mutateAsync(datos)}
      />
    </div>
     </div> {/* cierre del max-w-2xl */}

      {/* ── PIE DE PÁGINA ── */}
      <div className="text-center py-4 text-xs text-slate-400">
        Powered by <span className="font-semibold text-slate-500">Somos Pioneros</span>
      </div>

    </div> {/* cierre del min-h-screen */}
  );
}
