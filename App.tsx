import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from './hooks/useUser';
import { GRID_COLS, GRID_ROWS } from './constants';
import Header from './components/Header';
import GridOverlay from './components/GridOverlay';
import LoginWidget from './components/LoginModal';
import PaymentModal from './components/PaymentModal';
import QRCode from './components/QRCode';
import AdminPanel from './components/AdminPanel';

export default function App(): React.ReactNode {
  const { 
    user, login, unlockBlock, addBonusUnlocks, logout, 
    globalReveals, imageUrl, isLoading 
  } = useUser();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);


  const totalBlocks = useMemo(() => GRID_COLS * GRID_ROWS, []);
  const revealedCount = globalReveals.size;
  const progress = useMemo(() => (revealedCount / totalBlocks) * 100, [revealedCount, totalBlocks]);

  const handleBlockClick = (index: number) => {
    if (user && user.dailyUnlocks > 0 && !globalReveals.has(index)) {
      unlockBlock(index);
    } else if (!user) {
        console.log("User must be logged in to unlock blocks.");
    }
  };

  const handleSimulatedPayment = () => {
    addBonusUnlocks(20);
    setIsPaymentModalOpen(false);
  };
  
  const handleLogin = (email: string, username: string) => {
    login(email, username);
  }
  
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <p className="text-2xl animate-pulse">Loading STAY experience...</p>
      </div>
    );
  }

  if (isAdminView) {
    return <AdminPanel />;
  }

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 bg-slate-900"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <main className="w-full h-auto sm:h-full sm:w-auto max-w-full max-h-full aspect-[120/84] shadow-2xl rounded-lg overflow-hidden border-2 border-slate-500/50">
         <GridOverlay 
            globalReveals={globalReveals} 
            onBlockClick={handleBlockClick} 
            canUnlock={user ? user.dailyUnlocks > 0 : false} 
            isLoggedIn={!!user}
         />
      </main>
      
      {user ? (
        <Header 
          user={user} 
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onLogout={logout}
          progress={progress}
        />
      ) : (
         <LoginWidget onLogin={handleLogin} />
      )}
        
      {user && user.dailyUnlocks <= 0 && (
          <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-20 p-4 bg-slate-800/80 rounded-lg text-center shadow-lg backdrop-blur-md">
              <p className="font-semibold text-cyan-300">¡Has agotado tus revelaciones de hoy!</p>
              <p className="text-slate-300 text-sm">Vuelve mañana para desbloquear 10 más.</p>
          </div>
      )}
      
      <QRCode />

      {isPaymentModalOpen && (
        <PaymentModal 
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={handleSimulatedPayment}
        />
      )}
    </div>
  );
}