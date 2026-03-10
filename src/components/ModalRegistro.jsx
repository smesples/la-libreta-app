// ModalRegistro.jsx — Versión corregida con manejo de loading robusto
import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ModalRegistro({ open, onClose, tipo, onGuardar }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const datos = {
      monto: Number(formData.get('monto')),
      categoria: formData.get('categoria'),
      descripcion: formData.get('descripcion') || '',
      fecha: formData.get('fecha') || new Date().toISOString().split('T')[0],
      modalidad_pago: formData.get('modalidad_pago') || 'contado',
      es_costo_fijo: formData.get('es_costo_fijo') === 'true',
      es_gasto_negocio: tipo === 'gasto' ? formData.get('es_gasto_negocio') !== 'false' : true,
      tipo,
    };

    try {
      await onGuardar(datos);
      // El modal se cierra desde Home.jsx en onSuccess
      // setLoading se resetea cuando el componente se desmonta al cerrar
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar. Reintente.");
      setLoading(false); // Solo liberamos si falla
    }
  };
