import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import BotonGrande from './BotonGrande';
import { Plus, Minus } from 'lucide-react';

const categoriasIngreso = [
  { value: "venta", label: "💰 Venta de productos" },
  { value: "servicio", label: "🔧 Servicio" },
  { value: "otro_ingreso", label: "📥 Otro ingreso" }
];

const categoriasGastoNegocio = [
  { value: "materia_prima", label: "📦 Materia prima" },
  { value: "empaque", label: "📫 Empaque" },
  { value: "mercaderia", label: "🛒 Mercadería" },
  { value: "envios", label: "🚗 Envíos" },
  { value: "servicios_negocio", label: "💡 Servicios (luz, agua)" },
  { value: "alquiler_negocio", label: "🏠 Alquiler local" },
  { value: "salarios", label: "👥 Salarios" },
  { value: "publicidad", label: "📢 Publicidad" },
  { value: "otros_gastos_negocio", label: "📋 Otros gastos" }
];

const categoriasGastoHogar = [
  { value: "alimentacion", label: "🍽️ Alimentación" },
  { value: "servicios_hogar", label: "💡 Servicios (luz, agua, gas)" },
  { value: "alquiler_hogar", label: "🏠 Alquiler vivienda" },
  { value: "salud", label: "💊 Salud" },
  { value: "educacion", label: "📚 Educación" },
  { value: "otros_gastos_hogar", label: "📋 Otros gastos" }
];

export default function ModalRegistro({ open, onClose, tipo, onGuardar }) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esCostoFijo, setEsCostoFijo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tipoGasto, setTipoGasto] = useState('negocio');
  const [modalidadPago, setModalidadPago] = useState('contado');

  const esIngreso = tipo === 'ingreso';
  const categorias = esIngreso 
    ? categoriasIngreso 
    : (tipoGasto === 'negocio' ? categoriasGastoNegocio : categoriasGastoHogar);

  const handleGuardar = async () => {
    if (!monto || parseFloat(monto) <= 0) return;
    
    setGuardando(true);
    await onGuardar({
      tipo,
      monto: parseFloat(monto),
      categoria: categoria || (esIngreso ? 'venta' : 'otros_gastos'),
      descripcion,
      fecha: new Date().toISOString().split('T')[0],
      es_costo_fijo: esCostoFijo,
      modalidad_pago: esIngreso ? modalidadPago : undefined,
      es_gasto_negocio: !esIngreso ? (tipoGasto === 'negocio') : undefined
    });
    
    setMonto('');
    setCategoria('');
    setDescripcion('');
    setEsCostoFijo(false);
    setTipoGasto('negocio');
    setModalidadPago('contado');
    setGuardando(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl flex items-center justify-center gap-2">
            {esIngreso ? (
              <>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                Nuevo Ingreso
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Minus className="w-5 h-5 text-red-600" />
                </div>
                Nuevo Gasto
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {esIngreso && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModalidadPago('contado')}
                className={`py-3 px-4 rounded-xl font-medium text-center transition-all ${
                  modalidadPago === 'contado'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💵 Contado
              </button>
              <button
                type="button"
                onClick={() => setModalidadPago('a_cuenta')}
                className={`py-3 px-4 rounded-xl font-medium text-center transition-all ${
                  modalidadPago === 'a_cuenta'
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📋 A Cuenta
              </button>
            </div>
          )}

          {!esIngreso && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setTipoGasto('negocio'); setCategoria(''); }}
                className={`py-3 px-4 rounded-xl font-medium text-center transition-all ${
                  tipoGasto === 'negocio'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏪 Negocio
              </button>
              <button
                type="button"
                onClick={() => { setTipoGasto('hogar'); setCategoria(''); }}
                className={`py-3 px-4 rounded-xl font-medium text-center transition-all ${
                  tipoGasto === 'hogar'
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏠 Hogar
              </button>
            </div>
          )}

          <div>
            <Label className="text-base font-medium">Monto ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="mt-2 h-14 text-2xl text-center font-bold rounded-xl"
            />
          </div>

          <div>
            <Label className="text-base font-medium">Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="mt-2 h-14 rounded-xl text-base">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-base py-3">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">Descripción (opcional)</Label>
            <Input
              placeholder="Ej: Compra de materiales"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-2 h-12 rounded-xl"
            />
          </div>

          {!esIngreso && (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium">¿Es costo fijo?</p>
                <p className="text-sm text-slate-500">Se repite cada mes</p>
              </div>
              <Switch
                checked={esCostoFijo}
                onCheckedChange={setEsCostoFijo}
              />
            </div>
          )}

          <BotonGrande
            onClick={handleGuardar}
            variant={esIngreso ? "primary" : "danger"}
            disabled={guardando || !monto}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </BotonGrande>
        </div>
      </DialogContent>
    </Dialog>
  );
}
