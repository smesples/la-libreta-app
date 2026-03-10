// App.jsx - Versión corregida que unifica el sistema de auth
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';

const queryClient = new QueryClient();

// Componente interno que lee el contexto de auth
function AppContent() {
  const { isAuthenticated, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Cargando sistema...</p>
      </div>
    );
  }

  return isAuthenticated ? <Home /> : <Login />;
}

// Componente raíz que provee los contextos
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
