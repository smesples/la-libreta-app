// Home.jsx — Versión corregida con persistencia local
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../api/localDB';
import { useAuth } from '@/lib/AuthContext';
import { LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BotonGrande from '../components/BotonGrande';
import TarjetaResumen from '../components/TarjetaResumen';
import ModalRegistro from '../components/ModalRegistro';
import ModalProducto from '../components/ModalProducto';
import ListaTransacciones from '../components/ListaTransacciones';
import ListaProductos from '../components/ListaProductos';
import FortalezaPanel from '../components/FortalezaPanel';
import IndicadorPEQ from '../components/IndicadorPEQ';
import ReporteSolvencia from '../components/ReporteSolvencia';

export default function Home() {
  const [modalIngreso, setModalIngreso] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

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

  const { data: productos = [] } = useQuery({
    queryKey: ['productos', currentUserId],
    queryFn: () => db.Producto.list({ where: { usuarioId: currentUserId } })
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

  const crearProducto = useMutation({
    mutationFn: (data) => db.Producto.create({ ...data, usuarioId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setModalProducto(false);
    },
    onError: (error) => alert("Error al crear producto: " + error.message)
  });

  const actualizarProducto = useMutation({
    mutationFn: ({ id, data }) => db.Producto.update(id, { ...data, usuarioId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setModalProducto(false);
      setProductoEditar(null);
    }
  });

  const eliminarProducto = useMutation({
    mutationFn: (id) => db.Producto.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
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

  const margenPromedio = productos.length > 0
    ? productos.reduce((sum, p) => {
        const m = p.precio_venta > 0 ? ((p.precio_venta - p.costo_unitario) / p.precio_venta) * 100 : 0;
        return sum + m;
      }, 0) / productos.length
    : 0;

  const costosFijos = transaccionesMes
    .filter(t => t.tipo === 'gasto' && t.es_costo_fijo)
    .reduce((sum, t) => sum + t.monto, 0);

  return (
    <div className="min-h-screen bg-slate-50">
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

        {/* ── ZONA 2: KPIs OPERATIVOS ── */}
        <div className="grid grid-cols-3 gap-3">
          <TarjetaResumen titulo="Ingresos" valor={ventasMes} color="emerald" />
          <TarjetaResumen titulo="Gastos" valor={gastosMes} color="red" />
          <TarjetaResumen titulo="Balance" valor={balanceMes} color={balanceMes >= 0 ? "blue" : "red"} />
        </div>

        {/* ── ZONA 3: PUNTO DE EQUILIBRIO ── */}
        <IndicadorPEQ gastosMes={gastosMes} ventasMes={ventasMes} />

        {/* ── ZONA 4: MI FORTALEZA (resumen + acceso al Reporte) ── */}
        <FortalezaPanel
          comprasStock={comprasStock}
          ventasTotales={ventasTotales}
          ventasPendientes={ventasPendientes}
          efectivoCaja={efectivoCaja}
          peqAlcanzadoTemprano={peqAlcanzadoTemprano}
        />

        {/* ── TABS: MOVIMIENTOS / PRODUCTOS / REPORTE ── */}
        <Tabs defaultValue="movimientos">
          <TabsList className="w-full">
            <TabsTrigger value="movimientos" className="flex-1">Movimientos</TabsTrigger>
            <TabsTrigger value="productos" className="flex-1">Productos</TabsTrigger>
            <TabsTrigger value="reporte" className="flex-1">Reporte</TabsTrigger>
          </TabsList>

          <TabsContent value="movimientos" className="mt-3">
            <ListaTransacciones transacciones={transacciones} />
          </TabsContent>

          <TabsContent value="productos" className="mt-3">
            <ListaProductos
              productos={productos}
              onEditar={(p) => { setProductoEditar(p); setModalProducto(true); }}
              onEliminar={(id) => eliminarProducto.mutate(id)}
            />
          </TabsContent>

          <TabsContent value="reporte" className="mt-3">
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
      <ModalProducto
        open={modalProducto}
        onClose={() => { setModalProducto(false); setProductoEditar(null); }}
        producto={productoEditar}
        onGuardar={(datos) => productoEditar
          ? actualizarProducto.mutateAsync({ id: productoEditar.id, data: datos })
          : crearProducto.mutateAsync(datos)
        }
      />
    </div>
  );
}
