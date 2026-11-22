import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="bg-[#1A1A2E] text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 sticky top-0 z-40 shadow-sm"
    >
      <WifiOff className="w-3.5 h-3.5 text-[#FFC107] animate-pulse" />
      <span>Mode hors-ligne actif. Vous consultez les plats sauvegardés en local.</span>
    </div>
  );
};
