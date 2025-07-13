import React from 'react';

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 sm:left-6 sm:-translate-x-0 z-30">
        <button
          onClick={onClick}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 animate-pulse"
        >
          ¡Únete a la revelación!
        </button>
    </div>
  );
};

export default LoginButton;
