import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Minus, Package, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
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

  const { data: transacciones = [] } = useQuery({
    queryKey: ['transacciones'],
    queryFn: () => base44.entities.Transaccion.list('-fecha', 100)
  });

  const { data: productos = [] } = useQuery({
    queryKey: ['productos'],
    queryFn: () => base44.entities.Producto.list()
  });

  const crearTransaccion = useMutation({
    mutationFn: (data) => base44.entities.Transaccion.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transacciones'] })
  });

  const crearProducto = useMutation({
    mutationFn: (data) => base44.entities.Producto.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  const actualizarProducto = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Producto.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  const eliminarProducto = useMutation({
    mutationFn: (id) => base44.entities.Producto.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  // Calcular métricas del mes actual
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

  // Solo gastos del negocio para punto de equilibrio
  const costosFijos = transaccionesMes
    .filter(t => t.tipo === 'gasto' && t.es_costo_fijo && t.es_gasto_negocio !== false)
    .reduce((sum, t) => sum + t.monto, 0);

  // Stock: S = Total Compras - Total Ventas (puede ser negativo = excedente)
  const comprasStock = transacciones
    .filter(t => t.tipo === 'gasto' && ['mercaderia', 'materia_prima'].includes(t.categoria))
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasTotales = transacciones
    .filter(t => t.tipo === 'ingreso' && t.categoria === 'venta')
    .reduce((sum, t) => sum + t.monto, 0);

  // Ventas pendientes de cobro (a cuenta)
  const ventasPendientes = transacciones
    .filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'a_cuenta')
    .reduce((sum, t) => sum + t.monto, 0);

  // Efectivo en caja (ingresos contado menos gastos totales)
  const efectivoCaja = Math.max(0, transacciones
    .filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'contado')
    .reduce((sum, t) => sum + t.monto, 0) - transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0));

  // PEQ alcanzado temprano: antes del día 20 del mes con ventas >= gastos del mes
  const diaHoy = new Date().getDate();
  const peqAlcanzadoTemprano = diaHoy <= 20 && ingresosMes >= gastosMes && gastosMes > 0;

  // Calcular margen promedio de productos
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
      {/* Header */}
      <div className="bg-white px-5 py-6 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Mi Negocio</h1>
        <p className="text-slate-500 text-sm mt-1">Control de finanzas</p>
      </div>

      <div className="p-5 space-y-6">
        {/* Botones de acción - primero */}
        <div className="grid grid-cols-2 gap-4">
          <BotonGrande
            variant="primary"
            icon={Plus}
            onClick={() => setModalIngreso(true)}
          >
            Ingreso
          </BotonGrande>
          <BotonGrande
            variant="danger"
            icon={Minus}
            onClick={() => setModalGasto(true)}
          >
            Gasto
          </BotonGrande>
        </div>

        {/* Resumen principal */}
        <div className="grid grid-cols-2 gap-4">
          <TarjetaResumen
            titulo="Ingresos"
            valor={ingresosMes}
            icon={TrendingUp}
            color="emerald"
            subtitulo="Este mes"
          />
          <TarjetaResumen
            titulo="Gastos"
            valor={gastosMes}
            icon={TrendingDown}
            color="red"
            subtitulo="Este mes"
          />
        </div>

        <TarjetaResumen
          titulo="Balance del mes"
          valor={balanceMes}
          icon={Wallet}
          color={balanceMes >= 0 ? "emerald" : "red"}
        />

        {/* Indicador PEQ en tiempo real */}
        <IndicadorPEQ gastosMes={gastosMes} ventasMes={ingresosMes} />

        {/* Tabs para secciones */}
        <Tabs defaultValue="movimientos" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-12 rounded-xl bg-slate-100">
            <TabsTrigger value="movimientos" className="rounded-lg data-[state=active]:bg-white">
              Movimientos
            </TabsTrigger>
            <TabsTrigger value="productos" className="rounded-lg data-[state=active]:bg-white">
              Mi Fortaleza
            </TabsTrigger>
            <TabsTrigger value="analisis" className="rounded-lg data-[state=active]:bg-white">
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movimientos" className="mt-4">
            <ListaTransacciones
              transacciones={transaccionesMes.slice(0, 10)}
              onCobrar={(t) => marcarCobrado.mutate(t)}
            />
          </TabsContent>

          <TabsContent value="productos" className="mt-4 space-y-4">
            <FortalezaPanel
              comprasStock={comprasStock}
              ventasTotales={ventasTotales}
              ventasPendientes={ventasPendientes}
              efectivoCaja={efectivoCaja}
              peqAlcanzadoTemprano={peqAlcanzadoTemprano}
            />
            
            <BotonGrande
              variant="outline"
              icon={Package}
              onClick={() => {
                setProductoEditar(null);
                setModalProducto(true);
              }}
            >
              Agregar Producto
            </BotonGrande>

            <ListaProductos
              productos={productos}
              onEditar={(p) => {
                setProductoEditar(p);
                setModalProducto(true);
              }}
              onEliminar={(id) => eliminarProducto.mutate(id)}
            />
          </TabsContent>

          <TabsContent value="analisis" className="mt-4 space-y-4">
            <PuntoEquilibrio
              costosFijos={costosFijos}
              margenPromedio={margenPromedio}
              ventasMes={ingresosMes}
            />

            <ReporteSolvencia transacciones={transacciones} />

            <div className="p-5 bg-amber-50 rounded-2xl border-2 border-amber-100">
              <h3 className="font-bold text-amber-800 mb-3">📊 Costo de Ventas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Materia prima</span>
                  <span className="font-semibold text-amber-800">
                    ${transaccionesMes
                      .filter(t => t.categoria === 'materia_prima')
                      .reduce((sum, t) => sum + t.monto, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Empaque</span>
                  <span className="font-semibold text-amber-800">
                    ${transaccionesMes
                      .filter(t => t.categoria === 'empaque')
                      .reduce((sum, t) => sum + t.monto, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Transporte</span>
                  <span className="font-semibold text-amber-800">
                    ${transaccionesMes
                      .filter(t => t.categoria === 'transporte')
                      .reduce((sum, t) => sum + t.monto, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-amber-200 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-amber-800">Total costo de ventas</span>
                  <span className="font-bold text-amber-900">
                    ${transaccionesMes
                      .filter(t => ['materia_prima', 'empaque', 'transporte'].includes(t.categoria))
                      .reduce((sum, t) => sum + t.monto, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <ModalRegistro
        open={modalIngreso}
        onClose={() => setModalIngreso(false)}
        tipo="ingreso"
        onGuardar={(data) => crearTransaccion.mutateAsync(data)}
      />

      <ModalRegistro
        open={modalGasto}
        onClose={() => setModalGasto(false)}
        tipo="gasto"
        onGuardar={(data) => crearTransaccion.mutateAsync(data)}
      />

      <ModalProducto
        open={modalProducto}
        onClose={() => {
          setModalProducto(false);
          setProductoEditar(null);
        }}
        producto={productoEditar}
        onGuardar={handleGuardarProducto}
      />
    </div>
  );
}
