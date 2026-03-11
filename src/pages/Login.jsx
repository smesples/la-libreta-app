import React, { useState } from 'react';
import { supabase } from '@/api/supabaseClient';

export default function Login() {
  const [modo, setModo] = useState('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    setCargando(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError('Email o contraseña incorrectos');
    setCargando(false);
  };

  const handleRegistro = async () => {
    if (!nombre) { setError('Por favor ingresá tu nombre'); return; }
    setCargando(true); setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError('Error al registrarse: ' + error.message); setCargando(false); return; }
    await supabase.from('usuarios').insert({ id: data.user.id, email, nombre });
    setCargando(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
          <span className="text-white text-2xl font-bold">L</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">La Libreta</h1>
        <p className="text-gray-500 mt-1">Tu verdad financiera</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex mb-6">
          <button onClick={() => setModo('login')}
            className={`flex-1 py-2 text-sm font-medium rounded-l-lg border ${modo === 'login' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-200'}`}>
            Ingresar
          </button>
          <button onClick={() => setModo('registro')}
            className={`flex-1 py-2 text-sm font-medium rounded-r-lg border ${modo === 'registro' ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-200'}`}>
            Registrarse
          </button>
        </div>

        {modo === 'registro' && (
          <input className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm"
            placeholder="Tu nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} />
        )}
        <input className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-3 text-sm"
          placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 text-sm"
          placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={modo === 'login' ? handleLogin : handleRegistro}
          disabled={cargando}
          className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition-all disabled:opacity-50">
          {cargando ? 'Cargando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  );
}
