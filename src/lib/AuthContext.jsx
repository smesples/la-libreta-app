// AuthContext.jsx - Versión MVP con auth local (sin dependencia de Base44)
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Usuarios de demo para el MVP — reemplazá con tu lógica real cuando escales
const USUARIOS_DEMO = {
  'PROD_01': { id: 'PROD_01', nombre: 'Productor A', perfil: 'apicultor' },
  'PROD_02': { id: 'PROD_02', nombre: 'Productor B', perfil: 'agricultor' },
  'PROD_03': { id: 'PROD_03', nombre: 'Productor C', perfil: 'manufacturero' },
  'PROD_04': { id: 'PROD_04', nombre: 'Productor D', perfil: 'apicultor' },
  'PROD_05': { id: 'PROD_05', nombre: 'Productor E', perfil: 'agricultor' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Al iniciar, verificamos si hay sesión guardada en localStorage
    const sesionGuardada = localStorage.getItem('usuarioLibreta');
    if (sesionGuardada) {
      try {
        const userData = JSON.parse(sesionGuardada);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('usuarioLibreta');
      }
    }
    setIsLoadingAuth(false);
  }, []);

  // Login por selección de perfil (flujo actual de la app)
  const loginConPerfil = (perfilId) => {
    const userData = USUARIOS_DEMO[perfilId];
    if (!userData) {
      setAuthError({ type: 'invalid_user', message: 'Perfil no encontrado' });
      return false;
    }
    localStorage.setItem('usuarioLibreta', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('usuarioLibreta');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Mantenemos navigateToLogin por compatibilidad con código existente
  const navigateToLogin = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false, // Ya no aplica
      authError,
      appPublicSettings: null,        // Ya no aplica
      loginConPerfil,
      logout,
      navigateToLogin,
      checkAppState: () => {},        // Stub por compatibilidad
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
