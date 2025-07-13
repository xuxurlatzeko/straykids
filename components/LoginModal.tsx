import React, { useState } from 'react';

interface LoginWidgetProps {
  onLogin: (email: string, username: string) => void;
}

const LoginWidget: React.FC<LoginWidgetProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && username.trim() && email.includes('@')) {
      onLogin(email.trim(), username.trim());
    }
  };

  const isFormValid = email.trim() && username.trim() && email.includes('@');

  return (
    <div className="fixed top-4 left-4 z-30">
      <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-xs w-full border border-slate-700">
        <h2 className="text-xl font-bold text-center text-white mb-2">¡Únete a la revelación!</h2>
        <p className="text-slate-400 text-center text-sm mb-4">Regístrate para desbloquear pixeles.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-slate-300 text-sm font-bold mb-1">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre STAY"
              required
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-slate-300 text-sm font-bold mb-1">
              Tu Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
              required
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Empezar a Revelar
          </button>
        </form>
         <p className="text-xs text-slate-500 mt-3 text-center">
            Guardaremos tu progreso en este navegador.
         </p>
      </div>
    </div>
  );
};

export default LoginWidget;