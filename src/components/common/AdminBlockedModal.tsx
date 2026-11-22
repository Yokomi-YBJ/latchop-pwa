import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AdminBlockedModal: React.FC = () => {
  const { isAdminBlocked, dismissAdminBlock } = useAuth();

  if (!isAdminBlocked) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-block-title"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center shadow-heavy border border-[#EBEBEB]">
        <div className="w-16 h-16 bg-red-100 text-[#E74C3C] rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <h2 id="admin-block-title" className="text-xl font-bold text-[#1A1A2E] mb-2">
          Interface client uniquement
        </h2>

        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          Votre compte dispose de privilèges administrateur. Pour des raisons de sécurité, cette application web est exclusivement dédiée aux commandes clients. La session a été immédiatement clôturée.
        </p>

        <button
          onClick={dismissAdminBlock}
          className="w-full py-3 px-4 bg-[#1A1A2E] hover:bg-[#2C2C45] active:scale-[0.98] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-light"
        >
          <X className="w-4 h-4" />
          Compris, fermer
        </button>
      </div>
    </div>
  );
};
