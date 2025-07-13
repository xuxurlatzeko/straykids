import React, { useState, useEffect } from 'react';
import type { User } from '../types';
import { CloseIcon } from './IconComponents';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  currentUser: User | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, currentUser }) => {
  const [profileUrl, setProfileUrl] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      setProfileUrl(currentUser.profileUrl || '');
    }
  }, [isOpen, currentUser]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profileUrl.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-700 relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold text-center text-white mb-2">Tu Perfil</h2>
        <p className="text-slate-400 text-center text-sm mb-6">Añade o actualiza la URL de tu perfil. Se enlazará desde los pixeles que reveles.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="profile-url-edit" className="block text-slate-300 text-sm font-bold mb-1">
              URL de Perfil
            </label>
            <input
              id="profile-url-edit"
              type="url"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://twitter.com/tu_usuario"
              className="shadow appearance-none border border-slate-600 rounded-lg w-full py-2 px-3 bg-slate-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;