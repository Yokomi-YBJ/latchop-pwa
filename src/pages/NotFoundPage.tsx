import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center mb-6 shadow-sm">
        <AlertCircle className="w-10 h-10" />
      </div>

      <span className="text-xs font-black tracking-widest text-[#FF6B35] uppercase mb-1">
        Erreur 404
      </span>

      <h1 className="text-2xl font-black text-[#1A1A2E] mb-2 tracking-tight">
        Page introuvable
      </h1>

      <p className="text-sm text-[#6B7280] max-w-xs mb-8 leading-relaxed">
        Le plat ou la page que vous recherchez semble indisponible ou a été déplacé.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={() => window.history.back()}
          className="flex-1 py-3 px-4 rounded-xl border border-[#EBEBEB] bg-white text-[#1A1A2E] text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <Link
          to="/"
          className="flex-1 py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#E5531E] text-white text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-light"
        >
          <Home className="w-4 h-4" />
          Accueil
        </Link>
      </div>
    </div>
  );
};
