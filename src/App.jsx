import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificamos si ya hay alguien logueado en este navegador
    const usuarioGuardado = localStorage.getItem('usuarioLibreta');
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setCargando(false);
  }, []);

  if (cargando) return <div className="p-10 text-center text-gray-500">Cargando sistema...</div>;

  // Si no hay usuario, mostramos la pantalla de Login que creaste recién
  if (!usuario) {
    return <Login />;
  }

  // Si hay usuario, entramos a la App principal (Home)
  return <Home />;
}

export default App;
