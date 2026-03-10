jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BotonGrande from './BotonGrande';
import { Package } from 'lucide-react';

export default function ModalProducto({ open, onClose, onGuardar, producto }) {
  const [nombre, setNombre] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [cantidadStock, setCantidadStock] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setCostoUnitario(producto.costo_unitario?.toString() || '');
      setPrecioVenta(producto.precio_venta?.toString() || '');
      setCantidadStock(producto.cantidad_stock?.toString() || '');
    } else {
      setNombre('');
      setCostoUnitario('');
      setPrecioVenta('');
      setCantidadStock('');
    }
  }, [producto, open]);

  const handleGuardar = async () => {
    if (!nombre || !costoUnitario || !precioVenta || !cantidadStock) return;

    setGuardando(true);
    try {
      await onGuardar({
        nombre,
        costo_unitario: parseFloat(costoUnitario),
        precio_venta: parseFloat(precioVenta),
        cantidad_stock: parseFloat(cantidadStock)
      }, producto?.id);
      onClose();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Hubo un error al guardar el producto. Reintente.");
    } finally {
      // ✅ FIX: siempre libera el loading
      setGuardando(false);
    }
  };

  const margen = costoUnitario && precioVenta
    ? ((parseFloat(precioVenta) - parseFloat(costoUnitario)) / parseFloat(precioVenta) * 100).toFixed(1)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            {producto ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          <div>
            <Label className="text-base font-medium">Nombre del producto</Label>
            <Input
              placeholder="Ej: Empanada"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-medium">Costo ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={costoUnitario}
                onChange={(e) => setCostoUnitario(e.target.value)}
                className="mt-2 h-12 rounded-xl"
              />
            </div>
            <div>
              <Label className="text-base font-medium">Precio venta ($)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                className="mt-2 h-12 rounded-xl"
              />
            </div>
          </div>

          {margen > 0 && (
            <div className="p-3 bg-emerald-50 rounded-xl text-center">
              <p className="text-sm text-emerald-600">
                Margen de ganancia: <span className="font-bold">{margen}%</span>
              </p>
            </div>
          )}

          <div>
            <Label className="text-base font-medium">Cantidad en stock</Label>
            <Input
              type="number"
              placeholder="0"
              value={cantidadStock}
              onChange={(e) => setCantidadStock(e.target.value)}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          <BotonGrande
            onClick={handleGuardar}
            disabled={guardando || !nombre || !costoUnitario || !precioVenta || !cantidadStock}
          >
            {guardando ? 'Guardando...' : 'Guardar Producto'}
          </BotonGrande>
        </div>
      </DialogContent>
    </Dialog>
  );
}
