import React from 'react';

const Login = () => {
  // Lista de los 5 usuarios para la prueba piloto
  const usuarios = [
    { id: 'prod_01', nombre: 'Productor A' },
    { id: 'prod_02', nombre: 'Productor B' },
    { id: 'prod_03', nombre: 'Productor C' },
    { id: 'prod_04', nombre: 'Productor D' },
    { id: 'prod_05', nombre: 'Productor E' }
  ];

  const seleccionarUsuario = (usuario) => {
    // Guardamos la identidad en el navegador
    localStorage.setItem('usuarioLibreta', usuario.id);
    localStorage.setItem('nombreUsuarioLibreta', usuario.nombre);
    
    // Forzamos la recarga para que el sistema reconozca al nuevo usuario
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-10">
          <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">La Libreta</h1>
          <p className="text-slate-500 mt-2">Prueba Piloto de Solvencia</p>
        </div>
        
        <label className="block text-sm font-medium text-slate-700 mb-4">
          Seleccione su perfil de productor:
        </label>
        
        <div className="space-y-3">
          {usuarios.map((u) => (
            <button
              key={u.id}
              onClick={() => seleccionarUsuario(u)}
              className="w-full p-4 text-left border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all flex justify-between items-center group"
            >
              <div>
                <span className="font-semibold text-slate-700 block">{u.nombre}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">ID: {u.id}</span>
              </div>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold">
                Entrar →
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-10 pt-6 border-t border-slate-100">
          <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest leading-relaxed">
            Propiedad del Consorcio Tecnológico <br/> Datos Protegidos por ID de Usuario
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
