
import React from 'react';
import { CloseIcon } from './IconComponents';

interface PaymentModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 relative p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <CloseIcon />
        </button>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-200 mb-4">
                <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Consigue Revelaciones Extra</h3>
            <p className="text-slate-300 mb-6">
                Esta es una función de demostración. En una aplicación real, aquí podrías realizar un pago (ej: 2€) para apoyar el proyecto y conseguir bloques extra.
            </p>
            <p className="text-lg font-semibold text-yellow-400 mb-6">
                Haz clic abajo para recibir <span className="font-bold">20 revelaciones</span> de bonificación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                    onClick={onConfirm}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    Confirmar Bonificación
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                    Cancelar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
