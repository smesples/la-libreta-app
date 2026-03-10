import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Login from './pages/Login';

// Creamos el cliente de datos que faltaba en la consola
const queryClient = new QueryClient();

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificamos si ya hay alguien logueado
    const usuarioGuardado = localStorage.getItem('usuarioLibreta');
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setCargando(false);
  }, []);

  if (cargando) return <div className="p-10 text-center text-gray-500">Cargando sistema...</div>;

  return (
    // Envolvemos TODA la app con el Provider para solucionar el error de la consola
    <QueryClientProvider client={queryClient}>
      {!usuario ? <Login /> : <Home />}
    </QueryClientProvider>
  );
}

export default App;
