import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '../api/base44Client';
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

  // --- MUTACIONES CON CIERRE DE MODAL FORZADO ---
  const crearTransaccion = useMutation({
    mutationFn: async (data) => {
      console.log("Enviando estos datos a Base44:", { ...data, usuarioId: currentUserId });
      return await base44.entities.Transaccion.create({ 
        ...data, 
        usuarioId: currentUserId || 'anonimo' // Evita que viaje vacío
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transacciones'] });
      setModalIngreso(false);
      setModalGasto(false);
    },
    onError: (error) => {
      setModalIngreso(false);
      setModalGasto(false);
      alert("Error técnico: " + error.message);
      console.error("Detalle del error:", error);
    }
  });

  const crearProducto = useMutation({
    mutationFn: (data) => base44.entities.Producto.create({ ...data, usuarioId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setModalProducto(false);
    },
    onError: (error) => {
      alert("Error al crear producto.");
      console.error(error);
    }
  });

  const actualizarProducto = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Producto.update(id, { ...data, usuarioId: currentUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      setModalProducto(false);
      setProductoEditar(null);
    }
  });

  const eliminarProducto = useMutation({
    mutationFn: (id) => base44.entities.Producto.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  // --- LÓGICA DE CÁLCULOS ---
  const mesActual = new Date().getMonth();
  const añoActual = new Date().getFullYear();
  
  const transaccionesMes = transacciones.filter(t => {
    const fecha = new Date(t.fecha);
    return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
  });

  const ingresosMes = transaccionesMes.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
  const gastosMes = transaccionesMes.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
  const balanceMes = ingresosMes - gastosMes;

  const costosFijos = transaccionesMes
    .filter(t => t.tipo === 'gasto' && t.es_costo_fijo && t.es_gasto_negocio !== false)
    .reduce((sum, t) => sum + t.monto, 0);

  const comprasStock = transacciones
    .filter(t => t.tipo === 'gasto' && ['mercaderia', 'materia_prima'].includes(t.categoria))
    .reduce((sum, t) => sum + t.monto, 0);

  const ventasTotales = transacciones.filter(t => t.tipo === 'ingreso' && t.categoria === 'venta').reduce((sum, t) => sum + t.monto, 0);
  const ventasPendientes = transacciones.filter(t => t.tipo === 'ingreso' && t.modalidad_pago === 'a_cuenta').reduce((sum, t) => sum + t.monto, 0);

  const efectivoCaja = Math.max(0, transacciones
    .filter(t => t.tipo === 'ingreso' && t.modal
