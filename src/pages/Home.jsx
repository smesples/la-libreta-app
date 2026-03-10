import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Minus, Package, TrendingUp, TrendingDown, Wallet, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BotonGrande from '../components/BotonGrande';
import TarjetaResumen from '../components/TarjetaResumen';
import ModalRegistro from '../components/ModalRegistro';
import ModalProducto from '../components/ModalProducto';
import ListaTransacciones from '../components/ListaTransacciones';
import ListaProductos from '../components/ListaProductos';
import PuntoEquilibrio from '../components/PuntoEquilibrio';
import FortalezaPanel from '../components/FortalezaPanel';
import IndicadorPEQ from '../components/IndicadorPEQ';
import ReporteSolvencia from '../components/ReporteSolvencia';

export default function Home() {
  const [modalIngreso, setModalIngreso] = useState(false);
  const [modalGasto, setModalGasto] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  const queryClient = useQueryClient();

  // --- CAPA DE IDENTIDAD ---
  const currentUserId = localStorage.getItem('usuarioLibreta');
  const nombreUsuario = localStorage.getItem('nombreUsuarioLibreta');

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioLibreta');
    localStorage.removeItem('nombreUsuarioLibreta');
    window.location.reload();
  };

  // --- CONSULTAS FILTRADAS POR USUARIO ---
  const { data: transacciones = [] } = useQuery({
    queryKey: ['transacciones', currentUserId],
    queryFn: () => base44.entities.Transaccion.list({
      where: { usuarioId: currentUserId },
      order: '-fecha',
      limit: 100
    })
  });

  const { data: productos = [] } = useQuery({
    queryKey: ['productos', currentUserId],
    queryFn: () => base44.entities.Producto.list({
      where: { usuarioId: currentUserId }
    })
  });

  // --- MUTACIONES CON ETIQUETA DE USUARIO ---
  const crearTransaccion = useMutation({
    mutationFn: (data) => base44.entities.Transaccion.create({ ...data, usuarioId: currentUserId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transacciones'] })
  });

  const crearProducto = useMutation({
    mutationFn: (data) => base44.entities.Producto.create({ ...data, usuarioId: currentUserId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  const actualizarProducto = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Producto.update(id, { ...data, usuarioId: currentUserId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  const eliminarProducto = useMutation({
    mutationFn: (id) => base44.entities.Producto.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  // Calcular métricas del mes actual (Misma lógica de antes)
  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();
  
  const transaccionesMes = transacciones.filter(t => {
    const fecha = new Date(t.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const ingresosMes = transaccionesMes
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastosMes = transaccionesMes
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const balanceMes = ingresosMes - gastosMes;

  const costosFijos = transaccionesMes
    .filter(t => t.tipo === 'gasto' && t.es_costo_fijo && t.es_gasto_negocio !== false)
    .reduce((sum, t) => sum + t.monto, 0);

  const comprasStock = transacciones
    .filter(t => t.tipo === 'gasto' && ['mercaderia', 'materia_prima'].includes(t.categoria))
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasTotales = transacciones
    .filter(t => t.tipo === 'ingreso' && t.categoria === 'venta')
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasPendientes = transacciones
    .filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'a_cuenta')
    .reduce((sum, t) => sum + t.monto, 0);

  const efectivoCaja = Math.max(0, transacciones
    .filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'contado')
    .reduce((sum, t) => sum + t.monto, 0) - transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0));

  const diaHoy = new Date().getDate();
  const peqAlcanzadoTemprano = diaHoy <= 20 && ingresosMes >= gastosMes && gastosMes > 0;

  const margenPromedio = productos.length > 0
    ? productos.reduce((sum, p) => {
        const margen = ((p.precio_venta - p.costo_unitario) / p.precio_venta) * 100;
        return sum + margen;
      }, 0) / productos.length
    : 0;

  const marcarCobrado = useMutation({
    mutationFn: (t) => base44.entities.Transaccion.update(t.id, { modalidad_pago: 'contado' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transacciones'] })
  });

  const handleGuardarProducto = async (data, id) => {
    if (id) {
      await actualizarProducto.mutateAsync({ id, data });
    } else {
      await crearProducto.mutateAsync(data);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header con Info de Usuario */}
      <div className="bg-white px-5 py-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">La Libreta</h1>
          <p className="text-blue-600 text-sm font-medium">Perfil: {nombreUsuario}</p>
        </div>
        <button 
          onClick={cerrarSesion}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* Botones de acción */}
        <div className="grid grid-cols-2 gap-4">
          <BotonGrande variant="primary" icon={Plus} onClick={() => setModalIngreso(true)}>Ingreso</BotonGrande>
          <BotonGrande variant="danger" icon={Minus} onClick={() => setModalGasto(true)}>Gasto</BotonGrande>
        </div>

        {/* Resumen principal */}
        <div className="grid grid-cols-2 gap-4">
          <TarjetaResumen titulo="Ingresos" valor={ingresosMes} icon={TrendingUp} color="emerald" subtitulo="Este mes" />
          <TarjetaResumen titulo="Gastos" valor={gastosMes} icon={TrendingDown} color="red" subtitulo="Este mes" />
        </div>

        <TarjetaResumen titulo="Balance del mes" valor={balanceMes} icon={Wallet} color={balanceMes >= 0 ? "emerald" : "red"} />

        <IndicadorPEQ gastosMes={gastosMes} ventasMes={ingresosMes} />

        <Tabs defaultValue="movimientos" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl bg-slate-100">
            <TabsTrigger value="movimientos" className="rounded-lg data-[state=active]:bg-white">Movimientos</TabsTrigger>
            <TabsTrigger value="productos" className="rounded-lg data-[state=active]:bg-white">Mi Fortaleza</TabsTrigger>
            <TabsTrigger value="analisis" className="rounded-lg data-[state=active]:bg-white">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="movimientos" className="mt-4">
            <ListaTransacciones transacciones={transaccionesMes.slice(0, 10)} onCobrar={(t) => marcarCobrado.mutate(t)} />
          </TabsContent>

          <TabsContent value="productos" className="mt-4 space-y-4">
            <FortalezaPanel comprasStock={comprasStock} ventasTotales={ventasTotales} ventasPendientes={ventasPendientes} efectivoCaja={efectivoCaja} peqAlcanzadoTemprano={peqAlcanzadoTemprano} />
            <BotonGrande variant="outline" icon={Package} onClick={() => { setProductoEditar(null); setModalProducto(true); }}>Agregar Producto</BotonGrande>
            <ListaProductos productos={productos} onEditar={(p) => { setProductoEditar(p); setModalProducto(true); }} onEliminar={(id) => eliminarProducto.mutate(id)} />
          </TabsContent>

          <TabsContent value="analisis" className="mt-4 space-y-4">
            <PuntoEquilibrio costosFijos={costosFijos} margenPromedio={margenPromedio} ventasMes={ingresosMes} />
            <ReporteSolvencia transacciones={transacciones} />
          </TabsContent>
        </Tabs>
      </div>

      <ModalRegistro open={modalIngreso} onClose={() => setModalIngreso(false)} tipo="ingreso" onGuardar={(data) => crearTransaccion.mutateAsync(data)} />
      <ModalRegistro open={modalGasto} onClose={() => setModalGasto(false)} tipo="gasto" onGuardar={(data) => crearTransaccion.mutateAsync(data)} />
      <ModalProducto open={modalProducto} onClose={() => { setModalProducto(false); setProductoEditar(null); }} producto={productoEditar} onGuardar={handleGuardarProducto} />
    </div>
  );
}
