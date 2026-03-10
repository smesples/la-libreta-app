// Login.jsx - Versión corregida que usa AuthContext
import React from 'react';
import { useAuth } from '@/lib/AuthContext';

const PERFILES = [
  { id: 'PROD_01', nombre: 'Productor A' },
  { id: 'PROD_02', nombre: 'Productor B' },
  { id: 'PROD_03', nombre: 'Productor C' },
  { id: 'PROD_04', nombre: 'Productor D' },
  { id: 'PROD_05', nombre: 'Productor E' },
];

export default function Login() {
  const { loginConPerfil } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">L</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">La Libreta</h1>
        <p className="text-gray-500 mt-1">Prueba Piloto de Solvencia</p>
      </div>

      {/* Selector de perfil */}
      <div className="w-full max-w-sm">
        <p className="text-gray-700 font-medium mb-4 text-center">
          Seleccione su perfil de productor:
        </p>
        <div className="flex flex-col gap-3">
          {PERFILES.map((perfil) => (
            <button
              key={perfil.id}
              onClick={() => loginConPerfil(perfil.id)}
              className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <p className="font-semibold text-gray-900">{perfil.nombre}</p>
              <p className="text-sm text-gray-400">ID: {perfil.id}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
