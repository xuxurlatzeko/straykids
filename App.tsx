import React, { useState, useMemo, useEffect } from 'react';
import { useUser } from './hooks/useUser';
import { GRID_COLS, GRID_ROWS } from './constants';
import Header from './components/Header';
import GridOverlay from './components/GridOverlay';
import LoginButton from './components/LoginButton';
import LoginModal from './components/LoginModal';
import PaymentModal from './components/PaymentModal';
import ProfileModal from './components/ProfileModal';
import QRCode from './components/QRCode';
import AdminPanel from './components/AdminPanel';

export default function App(): React.ReactNode {
  const { 
    user, login, logout, unlockBlock, addBonusUnlocks, updateProfileUrl,
    globalReveals, imageUrl, overlayOpacity, isLoading 
  } = useUser();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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
        setIsLoginModalOpen(true);
    }
  };

  const handleSimulatedPayment = () => {
    addBonusUnlocks(20);
    setIsPaymentModalOpen(false);
  };
  
  const handleLogin = (email: string, username: string, profileUrl: string) => {
    login(email, username, profileUrl);
    setIsLoginModalOpen(false);
  }
  
  const handleProfileSave = (url: string) => {
    updateProfileUrl(url);
    setIsProfileModalOpen(false);
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
            overlayOpacity={overlayOpacity}
         />
      </main>
      
      {user ? (
        <Header 
          user={user} 
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onLogout={logout}
          progress={progress}
        />
      ) : (
         <LoginButton onClick={() => setIsLoginModalOpen(true)} />
      )}
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleProfileSave}
        currentUser={user}
      />
        
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