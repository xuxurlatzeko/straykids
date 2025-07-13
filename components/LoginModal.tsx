import React, { useState } from 'react';
import { CloseIcon } from './IconComponents';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, username: string, profileUrl: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profileUrl, setProfileUrl] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && username.trim() && email.includes('@')) {
      onLogin(email.trim(), username.trim(), profileUrl.trim());
    }
  };

  const isFormValid = email.trim() && username.trim() && email.includes('@');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700 relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-2">¡Únete a la revelación!</h2>
        <p className="text-slate-400 text-center text-sm mb-6">Regístrate para desbloquear pixeles y dejar tu marca.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-modal" className="block text-slate-300 text-sm font-bold mb-1">
              Nombre de usuario
            </label>
            <input
              id="username-modal"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre STAY"
              required
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label htmlFor="email-modal" className="block text-slate-300 text-sm font-bold mb-1">
              Tu Email
            </label>
            <input
              id="email-modal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
              required
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
           <div>
            <label htmlFor="profile-url-modal" className="block text-slate-300 text-sm font-bold mb-1">
              URL de Perfil (Opcional)
            </label>
            <input
              id="profile-url-modal"
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://twitter.com/tu_usuario"
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Empezar a Revelar
          </button>
        </form>
         <p className="text-xs text-slate-500 mt-4 text-center">
            Guardaremos tu progreso en este navegador.
         </p>
      </div>
    </div>
  );
};

export default LoginModal;