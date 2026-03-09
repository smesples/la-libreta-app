import React from 'react';
import { Package, Edit2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function ListaProductos({ productos, onEditar, onEliminar }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No hay productos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {productos.map((p) => {
        const valorStock = p.costo_unitario * p.cantidad_stock;
        const margen = ((p.precio_venta - p.costo_unitario) / p.precio_venta * 100).toFixed(0);
        
        return (
          <div 
            key={p.id} 
            className="p-4 bg-white rounded-xl border border-slate-100"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{p.nombre}</p>
                  <p className="text-sm text-slate-500">
                    {p.cantidad_stock} unidades • Margen {margen}%
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEditar(p)}
                  className="h-8 w-8"
                >
                  <Edit2 className="w-4 h-4 text-slate-400" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEliminar(p.id)}
                  className="h-8 w-8"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-50">
              <div className="text-center">
                <p className="text-xs text-slate-400">Costo</p>
                <p className="font-semibold text-slate-700">${p.costo_unitario}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Venta</p>
                <p className="font-semibold text-emerald-600">${p.precio_venta}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Valor stock</p>
                <p className="font-semibold text-purple-600">${valorStock.toLocaleString()}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
