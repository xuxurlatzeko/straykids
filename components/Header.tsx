import React from 'react';
import type { User } from '../types';
import { DAILY_UNLOCK_LIMIT } from '../constants';

interface HeaderProps {
  user: User;
  onOpenPaymentModal: () => void;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  progress: number;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenPaymentModal, onOpenProfileModal, onLogout, progress }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 p-4">
      <div className="w-full max-w-7xl mx-auto bg-slate-900/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Stray Kids <span className="text-cyan-400">Image Reveal</span>
            </h1>
            <p className="text-sm text-slate-400">Bienvenido, {user.username}</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-300">Tus revelaciones</div>
              <div className="text-2xl font-bold text-cyan-400">{user.dailyUnlocks}
                <span className="text-lg text-slate-400">/{DAILY_UNLOCK_LIMIT}</span>
              </div>
            </div>
            <button
              onClick={onOpenPaymentModal}
              className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold p-2 md:py-2 md:px-4 rounded-lg transition-colors duration-200 shadow-md disabled:bg-gray-500 text-xl"
              title="¡Consigue 20 revelaciones extra!"
            >
              ✨
            </button>
            <button
              onClick={onOpenProfileModal}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-3 md:px-4 rounded-lg transition-colors duration-200 shadow-md"
              title="Editar tu perfil"
            >
              Perfil
            </button>
             <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 md:px-4 rounded-lg transition-colors duration-200 shadow-md"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="mt-4">
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="text-right text-xs text-slate-400 mt-1">{progress.toFixed(2)}% Revelado</p>
        </div>
      </div>
    </header>
  );
};

export default Header;