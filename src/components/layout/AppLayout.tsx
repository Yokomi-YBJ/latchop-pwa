import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from '../common/OfflineBanner';
import { AdminBlockedModal } from '../common/AdminBlockedModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#E5E7EB] flex justify-center">
      {/* Conteneur Mobile First au ratio smartphone */}
      <div className="w-full max-w-md min-h-screen bg-[#F7F7F8] flex flex-col relative shadow-2xl border-x border-[#EBEBEB]">
        <OfflineBanner />
        <Header />

        <main className="flex-1 pb-20 overflow-y-auto">
          <Outlet />
        </main>

        <BottomNav />
        <AdminBlockedModal />
      </div>
    </div>
  );
};
